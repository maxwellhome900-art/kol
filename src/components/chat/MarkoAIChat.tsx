"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useBooking } from "@/context/booking-context";
import { site } from "@/lib/data";
import {
  emptyMarkoMemory,
  introActions,
  introFor,
  quickPromptsFor,
  replyToMarko,
  type MarkoAction,
  type MarkoMemory,
  type MarkoSurface,
} from "@/lib/marko/engine";
import { MARKO_OPEN_EVENT } from "@/lib/marko/open";

type Bubble = {
  id: string;
  from: "visitor" | "marko";
  text: string;
  actions?: MarkoAction[];
};

type Conversation = {
  memory: MarkoMemory;
  bubbles: Bubble[];
};

function createBubbleId() {
  return `bubble-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function surfaceFromPath(pathname: string): MarkoSurface {
  if (pathname.startsWith("/dev")) return "dev";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  return "photo";
}

function emptyConversation(surface: MarkoSurface): Conversation {
  return {
    memory: emptyMarkoMemory(),
    bubbles: [
      {
        id: "intro",
        from: "marko",
        text: introFor(surface),
        actions: introActions(surface),
      },
    ],
  };
}

function samePageHash(href: string, pathname: string): string | null {
  const hashIdx = href.indexOf("#");
  if (hashIdx === -1) return null;
  const path = href.slice(0, hashIdx);
  const hash = href.slice(hashIdx);
  const onDev = pathname.startsWith("/dev");
  const onPhoto = pathname === "/";
  const same =
    href.startsWith("#") ||
    path === pathname ||
    (path === "/dev" && onDev) ||
    ((path === "/" || path === "") && onPhoto);
  return same ? hash : null;
}

function sectionIdForEvent(event: MarkoAction["event"]): string | null {
  if (event === "open-projects") return "projects";
  if (event === "open-services") return "services";
  if (event === "open-cases") return "case-studies";
  if (event === "open-skills") return "skills";
  if (event === "open-contact") return "contact";
  if (event === "open-reviews") return "reviews";
  if (event === "open-booking") return "booking";
  if (event === "open-gallery") return "gallery";
  return null;
}

function answersOf(actions: MarkoAction[] | undefined): MarkoAction[] {
  return (actions ?? []).filter((a) => Boolean(a.reply));
}

function linksOf(actions: MarkoAction[] | undefined): MarkoAction[] {
  return (actions ?? []).filter((a) => Boolean(a.href) && !a.reply);
}

export function MarkoAIChat() {
  const panelId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const { bookings } = useBooking();
  const surface = surfaceFromPath(pathname);
  const prompts = useMemo(() => quickPromptsFor(surface), [surface]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationsRef = useRef<Partial<Record<MarkoSurface, Conversation>>>({});
  const memoryRef = useRef<MarkoMemory>(emptyMarkoMemory());
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>(() => emptyConversation(surface).bubbles);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    window.addEventListener(MARKO_OPEN_EVENT, openPanel);
    const fromHash = () => {
      if (window.location.hash === "#marko-ai") setOpen(true);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener(MARKO_OPEN_EVENT, openPanel);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  useEffect(() => {
    const saved = conversationsRef.current[surface];
    if (saved) {
      memoryRef.current = saved.memory;
      setBubbles(saved.bubbles);
      return;
    }
    const fresh = emptyConversation(surface);
    conversationsRef.current[surface] = fresh;
    memoryRef.current = fresh.memory;
    setBubbles(fresh.bubbles);
  }, [surface]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [bubbles, typing, open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 280);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const lastMarko = [...bubbles].reverse().find((b) => b.from === "marko");
  const followUps = answersOf(lastMarko?.actions);

  const persist = (nextMemory: MarkoMemory, nextBubbles: Bubble[]) => {
    memoryRef.current = nextMemory;
    conversationsRef.current[surface] = {
      memory: nextMemory,
      bubbles: nextBubbles,
    };
  };

  const runAction = (action: MarkoAction) => {
    if (action.reply) {
      ask(action.reply);
      return;
    }
    const hash = action.href ? samePageHash(action.href, pathname) : null;
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action.href) {
      router.push(action.href);
    } else {
      const sectionId = sectionIdForEvent(action.event);
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setOpen(false);
  };

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || typing) return;
    setDraft("");
    const visitor: Bubble = {
      id: createBubbleId(),
      from: "visitor",
      text: trimmed,
    };
    setBubbles((current) => {
      const next = [...current, visitor];
      persist(memoryRef.current, next);
      return next;
    });
    setTyping(true);
    window.setTimeout(() => {
      const { reply, memory } = replyToMarko(
        trimmed,
        surface,
        bookings,
        memoryRef.current,
      );
      setBubbles((current) => {
        const next = [
          ...current,
          {
            id: createBubbleId(),
            from: "marko",
            text: reply.text,
            actions: reply.actions,
          },
        ];
        persist(memory, next);
        return next;
      });
      setTyping(false);
    }, 480);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px]"
            aria-hidden
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-labelledby={panelId}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
              className="glass mb-24 w-[min(100vw-2.5rem,440px)] origin-bottom overflow-hidden rounded-3xl border border-[var(--border-glass)] shadow-2xl shadow-black/40 md:mb-0 md:w-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-3 border-b border-[var(--border-glass)] bg-gradient-to-r from-sky-500/10 to-amber-500/15 px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-200">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2
                      id={panelId}
                      className="font-[family-name:var(--font-syne)] text-base font-semibold text-[var(--text-primary)]"
                    >
                      {site.agentName}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      {surface === "dev"
                        ? "Engineering guide · one question at a time"
                        : "Supportive studio guide · one question at a time"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-transparent p-2 text-[var(--text-muted)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
                  aria-label="Close Marko AI"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="flex max-h-[min(70dvh,520px)] flex-col">
                <div
                  ref={listRef}
                  className="max-h-[320px] space-y-3 overflow-y-auto p-4 pb-2"
                  aria-live="polite"
                >
                  {bubbles.map((bubble) => {
                    const answers = answersOf(bubble.actions);
                    const links = linksOf(bubble.actions);
                    return (
                      <div
                        key={bubble.id}
                        className={`flex ${bubble.from === "visitor" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            bubble.from === "visitor"
                              ? "bg-sky-500/25 text-sky-50 ring-1 ring-sky-400/35"
                              : "bg-white/10 text-[var(--text-primary)] ring-1 ring-white/15"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{bubble.text}</p>
                          {bubble.from === "marko" && links.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {links.map((action) => (
                                <button
                                  key={action.id}
                                  type="button"
                                  onClick={() => runAction(action)}
                                  className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-100"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                          {bubble.from === "marko" &&
                          answers.length > 0 &&
                          bubble.id !== lastMarko?.id ? (
                            <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                              {answers.map((a) => a.label).join(" · ")}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                  {typing ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-[var(--text-muted)] ring-1 ring-white/15">
                        Marko is thinking of a good question…
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-[var(--border-glass)] bg-black/20 p-3">
                  {followUps.length > 0 ? (
                    <div className="mb-3">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">
                        Answer Marko
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {followUps.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => runAction(action)}
                            className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1.5 text-left text-[12px] font-medium text-amber-50 transition hover:bg-amber-500/25"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {prompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => ask(prompt)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-100/90 transition hover:bg-white/10"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      ask(draft);
                    }}
                  >
                    <label className="sr-only" htmlFor="marko-input">
                      Message Marko AI
                    </label>
                    <input
                      ref={inputRef}
                      id="marko-input"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type anything — there's no wrong answer…"
                      className="h-11 flex-1 rounded-full border border-[var(--border-glass)] bg-black/30 px-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-amber-400/40"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || typing}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/25 text-amber-50 transition hover:bg-amber-400/35 disabled:opacity-40"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="marko-ai"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="glass relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-glass)] bg-gradient-to-br from-sky-500/90 to-amber-500/85 text-white shadow-xl shadow-black/30"
          aria-label={open ? "Close Marko AI" : `Open ${site.agentName}`}
        >
          <MessageCircle className="h-7 w-7" aria-hidden />
        </motion.button>
      </div>
    </>
  );
}

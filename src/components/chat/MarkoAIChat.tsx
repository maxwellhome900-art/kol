"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/data";

type Bubble = {
  id: string;
  from: "visitor" | "marko";
  text: string;
};

const STORAGE_KEY = "marko-ai-chat-last";

const QUICK_PROMPTS = [
  '$449 / 60 min / 30+ / 20× 6×4" prints',
  '$699 / 90 min / 45+ / 35× 6×4" prints',
  "Hold between 7pm–1am",
  "Times Square portrait mood",
] as const;

/** Floating agent — Marko AI. Optional Discord webhook + mailto fallback. */
export function MarkoAIChat() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<Bubble[]>([
    {
      id: "intro",
      from: "marko",
      text: `I am ${site.agentName} — Mark's studio copilot. Software ships by day; by night the avenue turns to tungsten, LED, and glass. Packages: $449 (60 min, 30+ edits, twenty 6×4 inch prints) and $699 (90 min, 45+ edits, thirty-five 6×4 inch prints). Evening holds run 7:00 PM – 1:00 AM; I translate moodboards and nerves into clear asks before they reach Mark.`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"capture" | "chat">("capture");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showUnreadDot, setShowUnreadDot] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [bubble, open]);

  const pushMarko = useCallback((text: string) => {
    setBubble((b) => [
      ...b,
      { id: crypto.randomUUID(), from: "marko", text },
    ]);
  }, []);

  const pushVisitor = useCallback((text: string) => {
    setBubble((b) => [
      ...b,
      { id: crypto.randomUUID(), from: "visitor", text },
    ]);
  }, []);

  const openMailFallback = useCallback(
    (message: string) => {
      const subject = encodeURIComponent(
        `[${site.agentName}] Message from ${name || "visitor"}`,
      );
      const body = encodeURIComponent(
        `From: ${name}\nEmail: ${email}\n\n${message}\n`,
      );
      window.open(
        `mailto:${site.email}?subject=${subject}&body=${body}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
    [email, name],
  );

  const handleSendChat = async () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;
    if (!name.trim() || !email.trim()) {
      setPhase("capture");
      return;
    }

    pushVisitor(trimmed);
    setDraft("");
    setSending(true);

    try {
      const res = await fetch("/api/contact-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: trimmed,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; delivered?: boolean };

      if (data.ok && res.ok) {
        if (data.delivered) {
          pushMarko(
            "Thanks — Mark just got an instant ping. He will reply as soon as he can.",
          );
        } else {
          pushMarko(
            "Thanks! I opened your mail app too so the message reaches Mark reliably until server notifications are turned on.",
          );
          openMailFallback(trimmed);
        }
      } else {
        pushMarko(
          "I could not reach the notify service — your mail app should open now with the same message.",
        );
        openMailFallback(trimmed);
      }
    } catch {
      pushMarko(
        "Connection hiccup — opening your mail app so Mark still gets your message.",
      );
      openMailFallback(trimmed);
    } finally {
      setSending(false);
      localStorage.setItem(STORAGE_KEY, "opened");
      setShowUnreadDot(false);
    }
  };

  const handleFabOpen = () => {
    setOpen(true);
    localStorage.setItem(STORAGE_KEY, "opened");
    setShowUnreadDot(false);
  };

  const onSubmitCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setPhase("chat");
    const first = name.trim().split(/\s+/)[0] ?? "there";
    pushMarko(
      `Noted, ${first} — riff on a package, a timeline, or sanity-check a 7pm–1am hold before you tap Confirm in the booking desk.`,
    );
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-0"
            aria-hidden={!open}
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
              className="glass mb-24 w-[min(100vw-2.5rem,400px)] origin-bottom overflow-hidden rounded-3xl border border-[var(--border-glass)] shadow-2xl shadow-black/40 md:mb-0 md:w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-3 border-b border-[var(--border-glass)] bg-gradient-to-r from-sky-500/10 to-amber-500/15 px-4 py-4">
                <div>
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
                        Studio agent • $449 / $699 + 6×4 prints • 7 PM – 1 AM
                      </p>
                    </div>
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

              <div className="border-b border-[var(--border-glass)] bg-black/15 px-4 py-3">
                <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
                  Compare builds, rehearse wardrobe language, or line up what
                  you will drop into the intelligent hold — I bundle threads for
                  Mark. Tap a chip to seed your message, or write freeform.
                </p>
              </div>

              {phase === "capture" ? (
                <form onSubmit={onSubmitCapture} className="space-y-3 p-4">
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Your name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[var(--border-glass)] bg-white/90 px-3 py-2 text-sm text-slate-900 dark:bg-black/30 dark:text-[var(--text-primary)]"
                      placeholder="e.g. Jordan Lee"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Email (so Mark can reply)
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[var(--border-glass)] bg-white/90 px-3 py-2 text-sm text-slate-900 dark:bg-black/30 dark:text-[var(--text-primary)]"
                      placeholder="you@domain.com"
                      autoComplete="email"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 py-3 text-sm font-semibold text-slate-950"
                  >
                    Start with {site.agentName}
                  </button>
                </form>
              ) : (
                <>
                  <div
                    ref={scrollRef}
                    className="max-h-[260px] space-y-3 overflow-y-auto p-4 pb-6"
                  >
                    {bubble.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.from === "visitor" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            m.from === "visitor"
                              ? "bg-sky-500/25 text-sky-50 ring-1 ring-sky-400/35"
                              : "bg-white/10 text-[var(--text-primary)] ring-1 ring-white/15"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {sending && (
                      <p className="text-center text-xs text-[var(--text-muted)]">
                        Sending…
                      </p>
                    )}
                  </div>
                  <div className="border-t border-[var(--border-glass)] bg-black/20 p-3">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setDraft((d) =>
                              d.trim() ? `${d.trim()} · ${label}` : label,
                            )
                          }
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-100/90 transition hover:bg-white/10"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Ask about shoots, packages, timelines…"
                        rows={2}
                        className="min-h-[44px] flex-1 resize-none rounded-2xl border border-[var(--border-glass)] bg-white/90 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:bg-black/35 dark:text-[var(--text-primary)] dark:placeholder:text-[var(--text-muted)]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void handleSendChat();
                          }
                        }}
                      />
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => void handleSendChat()}
                        disabled={sending || !draft.trim()}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-amber-400 text-white disabled:opacity-40"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </motion.button>
                    </div>
                    <button
                      type="button"
                      className="mt-2 text-xs text-[var(--text-muted)] underline-offset-2 hover:text-[var(--text-primary)] hover:underline"
                      onClick={() => setPhase("capture")}
                    >
                      Edit contact details
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="marko-ai"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => (open ? setOpen(false) : handleFabOpen())}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="glass relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-glass)] bg-gradient-to-br from-sky-500/90 to-amber-500/85 text-white shadow-xl shadow-black/30"
          aria-label={open ? "Close Marko AI" : `Open ${site.agentName}`}
        >
          <MessageCircle className="h-7 w-7" aria-hidden />
          {showUnreadDot && !open && (
            <>
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-black/60" />
              <span
                className="absolute right-2.5 top-2.5 h-4 w-4 animate-ping rounded-full bg-emerald-400/60"
                aria-hidden
              />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}

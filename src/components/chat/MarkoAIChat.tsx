"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useId, useState } from "react";
import { site } from "@/lib/data";

type Bubble = {
  id: string;
  from: "visitor" | "marko";
  text: string;
};

const QUICK_PROMPTS = [
  "How do I book an evening hold?",
  "What's included in the $350 session?",
  "What's included in the $450 session?",
  "How much are picture-only orders?",
  "Show me the gallery experience",
] as const;

const ANSWERS: Record<string, string> = {
  "How do I book an evening hold?":
    "Choose a date and time from the booking desk, select the session length, and confirm. I block overlaps and send the hold alert so the booking stays clean and organized.",
  "What's included in the $350 session?":
    "The $350 portrait session includes a 45-minute shoot, 15+ hand-edited high-resolution images, and a polished gallery delivery. It is ideal for portraits, personal branding, and compact creative sets.",
  "What's included in the $450 session?":
    "The $450 extended session includes a 60-minute shoot, 25+ refined high-resolution images, and a more flexible set for outfits, movement, and multiple looks.",
  "How much are picture-only orders?":
    "Picture-only orders start at $10, depending on the number of images and usage. Use the booking desk and pick the picture-only option to request a simple image package.",
  "Show me the gallery experience":
    "The gallery section is curated from the portfolio source. Scroll the Photography gallery to see cinematic frames, parallax atmosphere, and fullscreen lightbox previews.",
};

function createBubbleId() {
  return `bubble-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

export function MarkoAIChat() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      id: "intro",
      from: "marko",
      text: `I am ${site.agentName} — a booking-focused assistant. I only answer questions about packages, holds, and the photography gallery.`,
    },
  ]);

  const ask = (question: string) => {
    setBubbles((current) => [
      ...current,
      { id: createBubbleId(), from: "visitor", text: question },
      { id: createBubbleId(), from: "marko", text: ANSWERS[question] },
    ]);
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
              className="glass mb-24 w-[min(100vw-2.5rem,400px)] origin-bottom overflow-hidden rounded-3xl border border-[var(--border-glass)] shadow-2xl shadow-black/40 md:mb-0 md:w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-3 border-b border-[var(--border-glass)] bg-gradient-to-r from-sky-500/10 to-amber-500/15 px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-200">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 id={panelId} className="font-[family-name:var(--font-syne)] text-base font-semibold text-[var(--text-primary)]">
                      {site.agentName}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      Booking + gallery guidance only.
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

              <div className="border-b border-[var(--border-glass)] bg-black/15 px-4 py-3">
                <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
                  I only provide answers about booking, packages, and the gallery. Use the booking desk to reserve your session.
                </p>
              </div>

              <div className="max-h-[340px] overflow-hidden">
                <div className="max-h-[240px] space-y-3 overflow-y-auto p-4 pb-6">
                  {bubbles.map((bubble) => (
                    <div key={bubble.id} className={`flex ${bubble.from === "visitor" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${bubble.from === "visitor" ? "bg-sky-500/25 text-sky-50 ring-1 ring-sky-400/35" : "bg-white/10 text-[var(--text-primary)] ring-1 ring-white/15"}`}>
                        {bubble.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border-glass)] bg-black/20 p-3">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
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
                  <button
                    type="button"
                    className="mt-2 w-full rounded-full bg-amber-400/20 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/30"
                    onClick={() => ask("How do I book an evening hold?")}
                  >
                    Start booking guidance
                  </button>
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

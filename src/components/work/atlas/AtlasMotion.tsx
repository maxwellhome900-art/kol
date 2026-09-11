"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function AtlasMotion() {
  const [key, setKey] = useState(0);

  return (
    <main>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl">Motion</h1>
      <p className="mt-2 max-w-xl text-sm opacity-70">
        Enter, lift, and settle. Replay the sequence — these are the same
        easing curves used on the studio site.
      </p>
      <button
        type="button"
        onClick={() => setKey((value) => value + 1)}
        className="mt-6 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
      >
        Replay
      </button>

      <div key={key} className="mt-10 grid gap-4 sm:grid-cols-3">
        {["fade-up", "stagger", "settle"].map((name, index) => (
          <motion.article
            key={name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.08 * index,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-3xl border border-current/10 p-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-50">
              {name}
            </p>
            <p className="mt-2 font-[family-name:var(--font-syne)] text-lg">
              {index === 0
                ? "Arrive from below"
                : index === 1
                  ? "Wait your turn"
                  : "Hold still"}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 rounded-3xl border border-current/15 px-8 py-6 text-left"
      >
        <p className="text-xs uppercase tracking-[0.18em] opacity-50">lift</p>
        <p className="mt-1 font-[family-name:var(--font-syne)] text-xl">
          Hover this card
        </p>
        <p className="mt-2 text-sm opacity-70">
          Spring-soft lift, the same gesture as project tiles on /dev.
        </p>
      </motion.button>
    </main>
  );
}

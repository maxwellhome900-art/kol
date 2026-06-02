"use client";

import { motion } from "framer-motion";
import { ParticleField } from "@/components/effects/ParticleField";
import { site } from "@/lib/data";

export type HeroMode = "photo" | "dev";

export function Hero({ mode = "photo" }: { mode?: HeroMode }) {
  const isPhoto = mode === "photo";
  const headline = isPhoto ? site.photographyHeadline : site.devHeadline;
  const sub = isPhoto ? site.photographySubheadline : site.devSubheadline;
  const words = headline.split(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      <ParticleField />

      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full blur-[100px]"
        style={{ background: "var(--glow-code)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 h-[min(70vw,440px)] w-[min(70vw,440px)] rounded-full blur-[110px]"
        style={{ background: "var(--glow-photo)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[22%] hidden h-24 w-16 rotate-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md lg:block"
        animate={{ y: [0, -18, 0], rotate: [12, 8, 12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[8%] bottom-[18%] hidden h-20 w-28 -rotate-6 rounded-2xl border border-amber-400/15 bg-amber-400/5 backdrop-blur-md lg:block"
        animate={{ y: [0, 14, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="bg-grid pointer-events-none absolute inset-0 z-[1] opacity-[0.35]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.35em] text-[var(--text-muted)]"
        >
          {site.name}
          {isPhoto ? (
            <span className="ml-3 text-amber-200/90">— {site.businessName}</span>
          ) : (
            <span className="ml-3 text-sky-300/90">— Web development</span>
          )}
        </motion.p>

        <h1 className="font-[family-name:var(--font-syne)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.65,
                delay: 0.08 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mr-[0.25em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl"
        >
          {sub}
        </motion.p>

        {isPhoto ? (
          <>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.68 }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl"
            >
              Sessions run from{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                7 PM — 1 AM
              </strong>
              {site.photographyHeroSessionTail}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.8 }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl"
            >
              Need to book or ask a question?{" "}
              <a
                href="#marko-ai"
                className="font-semibold text-amber-200/95 underline decoration-amber-400/35 underline-offset-4 transition hover:text-amber-100"
              >
                {site.agentName}
              </a>{" "}
              {site.photographyHeroMarkoTail}
            </motion.p>
          </>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <motion.div
          className="h-12 w-[1px] bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent"
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

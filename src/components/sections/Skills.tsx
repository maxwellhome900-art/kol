"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { skills } from "@/lib/data";

const badges = [
  "Design systems",
  "Performance",
  "A11y",
  "Color grading",
  "Composition",
  "Film tone",
];

function StatCounter({
  target,
  suffix,
  className,
}: {
  target: number;
  suffix: string;
  className: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const [text, setText] = useState(0);
  useMotionValueEvent(mv, "change", (v) => setText(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, target, {
      duration: 1.35,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => c.stop();
  }, [inView, mv, target]);

  return (
    <p
      ref={ref}
      className={`font-[family-name:var(--font-syne)] text-3xl font-bold tabular-nums ${className}`}
    >
      {text}
      {suffix}
    </p>
  );
}

export function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400/90">
              Skills
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Tools across both worlds
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Animated proficiency bars reveal on scroll; floating badges capture
              the overlap between product craft and photographic taste.
            </p>
          </div>
          <motion.div
            className="flex max-w-md flex-wrap justify-start gap-2 md:justify-end"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
          >
            {badges.map((b) => (
              <motion.span
                key={b}
                whileHover={{ y: -2, scale: 1.03 }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-full border border-[var(--border-glass)] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:border-sky-400/30"
              >
                {b}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl border border-[var(--border-glass)] p-6 md:p-8">
            <ul className="space-y-6">
              {skills.map((s, i) => (
                <li key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--text-primary)]">
                      {s.name}
                    </span>
                    <span className="tabular-nums text-[var(--text-muted)]">
                      {s.level}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: inView ? `${s.level}%` : 0 }}
                      transition={{
                        duration: 1.1,
                        delay: 0.08 * i,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-[var(--bg-elevated)] p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-sky-500/15 blur-3xl" />
            <p className="relative text-sm leading-relaxed text-[var(--text-muted)]">
              Whether I am tuning render performance or pulling curves in
              Lightroom, the through-line is intentionality: fewer arbitrary
              choices, more deliberate contrast, hierarchy, and emotion.
            </p>
            <div className="relative mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <StatCounter
                  target={8}
                  suffix="+"
                  className="text-sky-300"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Years shipping software
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <StatCounter
                  target={40}
                  suffix="+"
                  className="text-amber-300"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Cities photographed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

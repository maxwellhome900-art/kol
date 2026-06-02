"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code2, Aperture } from "lucide-react";

const tech = ["TypeScript", "React", "Next.js", "Node", "PostgreSQL", "AWS"];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yRight = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative scroll-mt-24 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400/90">
            About
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Two halves of the same creative drive
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <motion.div
            style={{ y: yLeft }}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-3xl border border-[var(--border-glass)] p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="relative">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
                <Code2 className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-[var(--text-primary)]">
                Developer identity
              </h3>
              <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                Mornings are for deep work: architecture, performance, and
                interfaces that feel inevitable. I care about clarity,
                maintainability, and the quiet polish users notice but cannot
                name.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-100/90"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yRight }}
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-3xl border border-[var(--border-glass)] p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="relative">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/25">
                <Aperture className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-[var(--text-primary)]">
                Photography passion
              </h3>
              <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                After hours, the city becomes a studio: street rhythm, intimate
                portraits, and neon-soaked nights. I chase contrast, gesture,
                and the cinematic tension between stillness and motion.
              </p>
              <ul className="mt-8 space-y-2 text-sm text-[var(--text-muted)]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Street photography & candid moments
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Environmental portraits
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Urban night & cinematic color
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

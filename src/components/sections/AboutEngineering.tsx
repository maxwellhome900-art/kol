"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code2, Layers } from "lucide-react";
import { site } from "@/lib/data";
import { openMarkoAI } from "@/lib/marko/open";

const beats = [
  "Next.js App Router, TypeScript, and tokens that survive a rebrand",
  "Booking, dashboard, and payment flows with the same luxury surface as this studio",
  "Motion, accessibility, and documented handoffs — not throwaway landing pages",
];

export function AboutEngineering() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [32, -32]);

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
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300/90">
            About the craft
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Product engineering with a photographer&apos;s eye
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            This page is the daytime twin of {site.businessName} — same fonts,
            glass, and dual amber/sky identity, aimed at hiring managers and
            collaborators.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            style={{ y }}
            className="glass relative overflow-hidden rounded-3xl border border-[var(--border-glass)] p-8 md:p-10 lg:col-span-7"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/12 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200 ring-1 ring-sky-400/25">
                <Code2 className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-[var(--text-primary)]">
                  Cinematic systems
                </h3>
                <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                  I treat a route the way I treat a frame: hierarchy, contrast,
                  and nothing accidental. The photography booking desk and studio
                  dashboard on this site are the working proof.
                </p>
                <ul className="mt-8 space-y-3">
                  {beats.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-[var(--text-muted)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="flex flex-col justify-between gap-6 rounded-3xl border border-sky-400/20 bg-gradient-to-b from-sky-500/10 to-transparent p-8 lg:col-span-5"
          >
            <div>
              <div className="flex items-center gap-2 text-sky-100/90">
                <Layers className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Dual practice
                </span>
              </div>
              <p className="mt-4 text-lg font-medium leading-snug text-[var(--text-primary)]">
                Mornings in the editor. Nights in Times Square. One brand across
                both.
              </p>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Scope a hire or a shoot with{" "}
              <button
                type="button"
                onClick={() => openMarkoAI()}
                className="font-medium text-sky-200/90 underline-offset-4 hover:underline"
              >
                {site.agentName}
              </button>
              .
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

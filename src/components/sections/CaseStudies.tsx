"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { caseStudies } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/12 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400/90">
            Case studies
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Outcomes, not vanity slides
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            A few anonymized engagements — each pairing product judgment with
            measurable lift.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-[var(--bg-elevated)]/80 p-8 shadow-xl shadow-black/25 backdrop-blur-md"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {c.client}
                </Badge>
                <Sparkles className="h-4 w-4 text-sky-300/80" />
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--text-primary)]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                {c.summary}
              </p>
              <p className="mt-4 text-sm text-[var(--text-primary)]/90">
                {c.outcome}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-6">
                {c.metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl bg-white/5 px-4 py-2">
                    <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-sky-200">
                      {m.value}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{m.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="#contact"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sky-300 hover:text-sky-200"
              >
                Discuss a similar build
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

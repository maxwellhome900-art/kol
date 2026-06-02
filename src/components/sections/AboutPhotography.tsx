"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Aperture, MapPin } from "lucide-react";
import { site } from "@/lib/data";

const beats = [
  "Times Square portraits with controlled strobe and ambient blend",
  "Street frames that respect subjects — gesture, reflection, rhythm",
  "Fast location scouting and crowd choreography for editorial clients",
];

export function AboutPhotography() {
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
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
            About the work
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Luxury editorial, grounded in one iconic grid
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            Every commission here is anchored in the Times Square district —
            neon, glass, and human velocity as co-directors.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            style={{ y }}
            className="glass relative overflow-hidden rounded-3xl border border-[var(--border-glass)] p-8 md:p-10 lg:col-span-7"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/12 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/25">
                <Aperture className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-[var(--text-primary)]">
                  Cinematic discipline
                </h3>
                <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                  I slow the frame down until light, wardrobe, and background
                  agree — then we move fast before the crowd rewrites the set.
                  The result is fashion-forward portraiture and street work that
                  still feels honest.
                </p>
                <ul className="mt-8 space-y-3">
                  {beats.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-[var(--text-muted)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
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
            className="flex flex-col justify-between gap-6 rounded-3xl border border-amber-400/20 bg-gradient-to-b from-amber-500/10 to-transparent p-8 lg:col-span-5"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-100/90">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  On location
                </span>
              </div>
              <p className="mt-4 text-lg font-medium leading-snug text-[var(--text-primary)]">
                Times Square & Theater District — controlled chaos as the
                backdrop.
              </p>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Engineering questions and shoot ideas both start with{" "}
              <a
                href="#marko-ai"
                className="font-medium text-amber-200/90 underline-offset-4 hover:underline"
              >
                {site.agentName}
              </a>
              .
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

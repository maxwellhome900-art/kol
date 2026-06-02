"use client";

import { motion } from "framer-motion";
import { Coffee, Moon, Sun, Camera, Laptop } from "lucide-react";

const phases = [
  {
    label: "Morning",
    time: "06:00 — 14:00",
    title: "Deep code & craft",
    body: "Standups, architecture, shipping features, and refining UX details until the interface feels invisible.",
    icon: Laptop,
    accent: "from-sky-500/30 to-cyan-400/10",
    ring: "ring-sky-400/30",
  },
  {
    label: "Golden hour",
    time: "16:00 — 19:00",
    title: "Light study",
    body: "Scouting locations, testing lenses, and chasing the transition from day to night.",
    icon: Sun,
    accent: "from-amber-400/25 to-orange-500/10",
    ring: "ring-amber-400/25",
  },
  {
    label: "Night",
    time: "20:00 — 02:00",
    title: "Streets & long exposures",
    body: "Portraits by streetlamp, neon reflections, and the rhythm of a city after most screens go dark.",
    icon: Camera,
    accent: "from-fuchsia-600/25 to-violet-600/15",
    ring: "ring-fuchsia-500/30",
  },
];

export function Timeline() {
  return (
    <section
      id="timeline"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border-glass)] to-transparent md:left-[calc(50%-1px)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
            <Coffee className="h-3.5 w-3.5 text-sky-300" aria-hidden />
            <Moon className="h-3.5 w-3.5 text-amber-300" aria-hidden />
            Rhythm
          </div>
          <h2 className="mt-5 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            One day, two crafts
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            A creative timeline from caffeine to shutter — motion reveals how
            engineering and photography trade the spotlight.
          </p>
        </motion.div>

        <ol className="relative space-y-12 md:space-y-16">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            const isLeft = i % 2 === 0;
            return (
              <motion.li
                key={phase.label}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative grid gap-6 pl-20 md:grid-cols-2 md:gap-10 md:pl-0 ${
                  isLeft ? "" : "md:text-right"
                }`}
              >
                <div
                  className={`md:col-start-1 ${
                    isLeft ? "md:pr-12" : "md:col-start-2 md:pl-12"
                  }`}
                >
                  <div
                    className={`glass inline-flex flex-col rounded-3xl border border-[var(--border-glass)] p-6 md:p-8 ${
                      isLeft ? "md:ml-auto" : "md:mr-auto"
                    } max-w-lg bg-gradient-to-br ${phase.accent}`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {phase.time}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-semibold text-[var(--text-primary)]">
                      {phase.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                      {phase.body}
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute left-4 top-6 flex md:left-1/2 md:top-10 md:-translate-x-1/2 md:justify-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] ring-2 ${phase.ring} shadow-lg shadow-black/30`}
                  >
                    <Icon className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
                  </motion.div>
                </div>

                <div
                  className={`hidden md:block ${
                    isLeft ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                  }`}
                >
                  <p className="pt-2 font-[family-name:var(--font-syne)] text-5xl font-bold text-white/[0.04]">
                    {phase.label}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

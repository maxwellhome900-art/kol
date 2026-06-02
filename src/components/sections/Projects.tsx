"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { IconGitHub } from "@/components/icons/BrandIcons";
import { projects } from "@/lib/data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Projects() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-violet-500/12 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400/90">
              Engineering
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Selected projects
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Product-grade interfaces, APIs, and systems — crafted with the
              same attention to composition I bring to a frame.
            </p>
          </div>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.li
              key={p.title}
              variants={item}
              whileHover={{ y: -8, rotateX: 2 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-[var(--bg-elevated)]/90 shadow-xl shadow-black/20 backdrop-blur-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent opacity-80" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--text-primary)]">
                  {p.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--text-muted)] ring-1 ring-white/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {p.description}
                </p>
                <div className="mt-6 flex gap-3">
                  {p.github && (
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:border-sky-400/40 hover:text-sky-300"
                      >
                        <IconGitHub className="h-4 w-4" />
                        GitHub
                      </Link>
                    </motion.div>
                  )}
                  {p.demo && (
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Live demo
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  gallery,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const categories: (GalleryCategory | "All")[] = ["All", "Portraits", "Street"];

export function Gallery() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const filtered = useMemo(() => {
    if (filter === "All") return gallery;
    return gallery.filter((g) => g.category === filter);
  }, [filter]);

  const activeIndex = useMemo(() => {
    if (!active) return 0;
    const idx = filtered.findIndex((g) => g.id === active.id);
    return idx >= 0 ? idx : 0;
  }, [active, filtered]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        const n = (activeIndex + 1) % filtered.length;
        setActive(filtered[n] ?? null);
      }
      if (e.key === "ArrowLeft") {
        const n = (activeIndex - 1 + filtered.length) % filtered.length;
        setActive(filtered[n] ?? null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, filtered]);

  const goPrev = useCallback(() => {
    if (!active) return;
    const n = (activeIndex - 1 + filtered.length) % filtered.length;
    setActive(filtered[n] ?? null);
  }, [active, activeIndex, filtered]);

  const goNext = useCallback(() => {
    if (!active) return;
    const n = (activeIndex + 1) % filtered.length;
    setActive(filtered[n] ?? null);
  }, [active, activeIndex, filtered]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(251,191,36,0.14),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(56,189,248,0.12),transparent_45%)]" />
      </motion.div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-10 md:mb-14"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
            Photography
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Times Square — portraits & street
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
            Masonry grid with cinematic hover, parallax atmosphere, and a
            fullscreen lightbox. Swap frames in{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
              src/lib/data.ts
            </code>
            .
          </p>

          <motion.div
            layout
            className="mt-8 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Gallery category"
          >
            {categories.map((c) => (
              <motion.button
                layout
                key={c}
                type="button"
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filter === c
                    ? "border-amber-400/50 bg-amber-400/15 text-amber-100 shadow-lg shadow-amber-500/10"
                    : "border-[var(--border-glass)] text-[var(--text-muted)] hover:border-amber-400/30 hover:text-[var(--text-primary)]"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          layout
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((g, index) => (
              <motion.button
                type="button"
                layout
                layoutId={`gallery-card-${g.id}`}
                key={g.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{
                  duration: 0.38,
                  delay: Math.min(index * 0.03, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setActive(g)}
                className={`group relative mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-elevated)] text-left ring-0 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/60 ${
                  g.aspect === "portrait"
                    ? "aspect-[3/4]"
                    : g.aspect === "square"
                      ? "aspect-square"
                      : "aspect-[4/3]"
                }`}
              >
                <GalleryImageCell item={g} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <Badge variant="amber" className="mb-2 rounded-full text-[10px]">
                    {g.category}
                  </Badge>
                  <p className="text-sm font-medium text-white">{g.alt}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              aria-label="Close lightbox"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="relative z-[71] max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--bg-elevated)] shadow-2xl shadow-black/60"
            >
              <button
                type="button"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 md:flex"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 md:flex"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="flex flex-col gap-1 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/90">
                    {active.category}
                  </p>
                  <p className="mt-1 text-lg font-medium text-[var(--text-primary)]">
                    {active.alt}
                  </p>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Use arrow keys to browse
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryImageCell({ item }: { item: GalleryItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: loaded ? 1 : 0.35 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 bg-neutral-900"
        aria-hidden
      />
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className={`object-cover transition duration-[900ms] ease-out group-hover:scale-[1.08] ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

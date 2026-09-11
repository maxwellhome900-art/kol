"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem, StudioGalleryCategory } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { parseGalleryResponse } from "@/lib/gallery";

const categories: (StudioGalleryCategory | "All")[] = [
  "All",
  "Portraits",
  "Street",
];

export function PhotoGallery({
  items: provided,
  showFilters = true,
}: {
  items: GalleryItem[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());

  const visible = useMemo(() => {
    const loaded = provided.filter((g) => !failed.has(g.id));
    if (filter === "All") return loaded;
    return loaded.filter((g) => g.category === filter);
  }, [failed, filter, provided]);

  const activeIndex = useMemo(() => {
    if (!active) return 0;
    const idx = visible.findIndex((g) => g.id === active.id);
    return idx >= 0 ? idx : 0;
  }, [active, visible]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        setActive(visible[(activeIndex + 1) % visible.length] ?? null);
      }
      if (e.key === "ArrowLeft") {
        setActive(
          visible[(activeIndex - 1 + visible.length) % visible.length] ?? null,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, visible]);

  const markFailed = useCallback((id: string) => {
    setFailed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    if (!active) return;
    setActive(
      visible[(activeIndex - 1 + visible.length) % visible.length] ?? null,
    );
  }, [active, activeIndex, visible]);

  const goNext = useCallback(() => {
    if (!active) return;
    setActive(visible[(activeIndex + 1) % visible.length] ?? null);
  }, [active, activeIndex, visible]);

  return (
    <>
      {showFilters ? (
        <div
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Gallery category"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === c
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-100 shadow-lg shadow-amber-500/10"
                  : "border-[var(--border-glass)] text-[var(--text-muted)] hover:border-amber-400/30 hover:text-[var(--text-primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((g, index) => (
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
              className="group relative mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-elevated)] text-left ring-0 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/60"
            >
              <span className="relative block w-full overflow-hidden bg-[var(--bg-elevated)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(g.id)}
                  className="block h-auto w-full object-cover object-center transition duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
              </span>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <Badge variant="amber" className="rounded-full text-[10px]">
                  {g.category}
                </Badge>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
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
              className="relative z-[71] flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--bg-elevated)] shadow-2xl shadow-black/60"
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
              <div className="flex min-h-0 flex-1 items-center justify-center bg-black/35 px-3 py-6 md:px-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.src}
                  alt={active.alt}
                  className="max-h-[78vh] w-auto max-w-full object-contain object-center"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4 md:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/90">
                  {active.category}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Use arrow keys to browse
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function useStudioPhotos() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted || !data) return;
        setItems(parseGalleryResponse(data));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return items;
}

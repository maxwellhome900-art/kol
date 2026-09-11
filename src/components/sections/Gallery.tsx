"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { PhotoGallery, useStudioPhotos } from "@/components/gallery/PhotoGallery";
import { previewGalleryItems } from "@/lib/gallery";

export function Gallery() {
  const items = useStudioPhotos();
  const preview = previewGalleryItems(items);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

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

      <div className="relative mx-auto max-w-6xl">
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
            A short edit from the night. Open the full gallery for every frame.
          </p>
        </motion.div>

        <PhotoGallery items={preview} showFilters={false} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-50 transition hover:bg-amber-500/20"
          >
            View all photos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

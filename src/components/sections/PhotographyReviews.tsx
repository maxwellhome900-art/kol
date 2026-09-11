"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import {
  photographyReviews,
  shortReviewName,
  type PhotographyReview,
  type PhotographyReviewLayout,
} from "@/lib/data";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          aria-hidden
        />
      ))}
    </div>
  );
}

const layoutClass: Record<PhotographyReviewLayout, string> = {
  featured: "mb-5 rounded-[2rem] p-8 md:p-11 lg:mb-6",
  narrow: "mb-5 rounded-2xl p-5 md:p-6",
  compact: "mb-5 rounded-[1.35rem] p-6",
  wide: "mb-5 rounded-3xl p-7 md:p-9",
};

function ReviewCard({
  review,
  index,
}: {
  review: PhotographyReview;
  index: number;
}) {
  const featured = review.layout === "featured";
  const compact = review.layout === "narrow" || review.layout === "compact";

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: 0.06 * index,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={`glass relative inline-block w-full break-inside-avoid overflow-hidden border border-[var(--border-glass)] ${layoutClass[review.layout]}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-100">
          {review.country} · {review.met}
        </span>
        {review.layout !== "featured" ? <Stars rating={review.rating} /> : null}
      </div>
      {featured ? (
        <>
          <Quote className="mb-4 h-10 w-10 text-amber-300/70" aria-hidden />
          <Stars rating={review.rating} className="mb-4" />
        </>
      ) : compact ? null : (
        <Quote className="mb-3 h-7 w-7 text-amber-300/60" aria-hidden />
      )}
      <div
        className={`flex-1 space-y-3 leading-relaxed text-[var(--text-muted)] ${
          featured ? "text-[15px] md:text-base" : "text-sm"
        }`}
      >
        {review.quote.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      <footer
        className={
          featured
            ? "mt-8 flex items-center gap-4 border-t border-white/5 pt-6"
            : "mt-5 flex items-center gap-3 border-t border-white/5 pt-4"
        }
      >
        <span
          className={
            featured
              ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-sm font-semibold text-amber-100 ring-1 ring-amber-400/25"
              : compact
                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-[11px] font-semibold text-amber-100 ring-1 ring-amber-400/25"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-sm font-semibold text-amber-100 ring-1 ring-amber-400/25"
          }
        >
          {initials(review.name)}
        </span>
        <div>
          <cite
            className={
              featured
                ? "not-italic text-base font-semibold text-[var(--text-primary)]"
                : "not-italic text-sm font-semibold text-[var(--text-primary)]"
            }
          >
            {shortReviewName(review.name)}
          </cite>
          <p className="text-xs text-[var(--text-muted)]">{review.role}</p>
        </div>
      </footer>
    </motion.blockquote>
  );
}

export function PhotographyReviews() {
  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.1),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
            Reviews
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Met around Times Square
          </h2>
        </motion.div>

        <div className="columns-1 gap-5 lg:columns-2">
          {photographyReviews.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

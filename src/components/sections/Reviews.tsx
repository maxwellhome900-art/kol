"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { engineeringReviews, shortReviewName, site } from "@/lib/data";
import { openMarkoAI } from "@/lib/marko/open";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
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

export function Reviews() {
  const featured = engineeringReviews.find((r) => r.featured) ?? engineeringReviews[0];
  const rest = engineeringReviews.filter((r) => r !== featured);

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(56,189,248,0.1),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300/90">
              Reviews
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              What collaborators say
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Frontend and backend software engineering — interfaces, APIs, and the
              full-stack work in between. Ask{" "}
              <button
                type="button"
                onClick={() => openMarkoAI()}
                className="font-medium text-sky-200/90 underline-offset-4 hover:underline"
              >
                {site.agentName}
              </button>{" "}
              to route a similar build.
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">
              5.0
            </span>
            <span className="ml-2">average across {engineeringReviews.length} reviews</span>
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featured ? (
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55 }}
              className="glass relative overflow-hidden rounded-3xl border border-sky-400/25 bg-gradient-to-br from-sky-500/12 to-transparent p-8 md:p-10 lg:col-span-6"
            >
              <Quote
                className="mb-6 h-10 w-10 text-sky-300/70"
                aria-hidden
              />
              <Stars rating={featured.rating} />
              <p className="mt-4 font-[family-name:var(--font-syne)] text-xl leading-snug text-[var(--text-primary)] md:text-2xl">
                {featured.quote}
              </p>
              <footer className="mt-8 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/20 text-sm font-semibold text-sky-100 ring-1 ring-sky-400/30">
                  {initials(featured.name)}
                </span>
                <div>
                  <cite className="not-italic text-sm font-semibold text-[var(--text-primary)]">
                    {shortReviewName(featured.name)}
                  </cite>
                  <p className="text-xs text-[var(--text-muted)]">
                    {featured.role} · {featured.company}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-1 lg:col-span-6">
            {rest.map((review, i) => (
              <motion.blockquote
                key={review.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.06 * i,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="glass flex flex-col rounded-3xl border border-[var(--border-glass)] p-6 md:p-7"
              >
                <Stars rating={review.rating} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {review.quote}
                </p>
                <footer className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 text-xs font-semibold text-amber-100 ring-1 ring-amber-400/25">
                    {initials(review.name)}
                  </span>
                  <div>
                    <cite className="not-italic text-sm font-semibold text-[var(--text-primary)]">
                      {shortReviewName(review.name)}
                    </cite>
                    <p className="text-xs text-[var(--text-muted)]">
                      {review.role} · {review.company}
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

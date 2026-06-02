"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers, site } from "@/lib/data";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
            Price menu
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            Night packages — $449 &amp; $699 — {site.businessName}
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            {site.eveningHoldWindowLabel} Scope and nuance through{" "}
            <a
              href="#marko-ai"
              className="font-medium text-amber-200/90 underline-offset-4 hover:underline"
            >
              {site.agentName}
            </a>
            . Edit tiers in{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
              src/lib/data.ts
            </code>
            .
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {pricingTiers.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className={`relative flex flex-col rounded-3xl border p-6 md:p-8 ${
                tier.highlighted
                  ? "border-amber-400/45 bg-gradient-to-b from-amber-500/15 to-transparent shadow-lg shadow-amber-500/10"
                  : "border-[var(--border-glass)] glass"
              }`}
            >
              {tier.highlighted && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-amber-400/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                  Most booked
                </span>
              )}
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--text-primary)]">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{tier.tagline}</p>
              <p className="mt-6 font-[family-name:var(--font-syne)] text-4xl font-bold text-[var(--text-primary)]">
                {tier.price}
                {tier.unit ? (
                  <span className="text-base font-normal text-[var(--text-muted)]">
                    {tier.unit}
                  </span>
                ) : null}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-[var(--text-muted)]">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/90"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

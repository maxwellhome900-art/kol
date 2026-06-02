"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Send } from "lucide-react";
import {
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconX,
} from "@/components/icons/BrandIcons";
import { site } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ContactVariant = "photo" | "dev";

export function Contact({ variant = "photo" }: { variant?: ContactVariant }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const isDev = variant === "dev";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  }

  const socials = [
    { href: site.social.github, icon: IconGitHub, label: "GitHub" },
    { href: site.social.linkedin, icon: IconLinkedIn, label: "LinkedIn" },
    { href: site.social.instagram, icon: IconInstagram, label: "Instagram" },
    { href: site.social.twitter, icon: IconX, label: "X (Twitter)" },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 px-6 pb-28 pt-24 md:pb-36 md:pt-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_bottom,_rgba(56,189,248,0.08),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-2xl"
        >
          <p
            className={`text-sm font-medium uppercase tracking-[0.3em] ${isDev ? "text-sky-400/90" : "text-fuchsia-300/90"}`}
          >
            Contact
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
            {isDev
              ? `Hire ${site.name} for product engineering`
              : `Book ${site.name} for Times Square sessions`}
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            {isDev ? (
              <>
                Tell me about your stack, timeline, and users — I reply with a
                concise plan. Prefer async? Open an issue on GitHub after we
                talk scope.
              </>
            ) : (
              <>
                Prefer the bubble? Open{" "}
                <strong>{site.agentName}</strong> — it can ping Mark when{" "}
                instantly when{" "}
                <code className="rounded bg-white/10 px-1 text-xs">
                  DISCORD_WEBHOOK_URL
                </code>{" "}
                is set in{" "}
                <code className="rounded bg-white/10 px-1 text-xs">
                  .env.local
                </code>
                .
              </>
            )}
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
            className="glass flex flex-col gap-5 rounded-3xl border border-[var(--border-glass)] p-6 md:p-8 lg:col-span-3"
          >
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                required
                name="name"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                required
                type="email"
                name="email"
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                required
                name="message"
                rows={5}
                placeholder={
                  isDev
                    ? "Roadmap, constraints, links to repos or Figma…"
                    : "Tell me about your shoot, wardrobe, and timeline…"
                }
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
              whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
              className="relative mt-2 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-500 to-amber-400 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <motion.span
                animate={{
                  y: status === "sent" ? -28 : 0,
                  opacity: status === "sent" ? 0 : 1,
                }}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? "Sending…" : "Send message"}
              </motion.span>
              {status === "sent" && (
                <motion.span
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center gap-2"
                >
                  Thanks — I&apos;ll be in touch
                </motion.span>
              )}
            </motion.button>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="flex flex-col justify-between gap-8 rounded-3xl border border-[var(--border-glass)] bg-gradient-to-br from-white/[0.04] to-transparent p-6 md:p-8 lg:col-span-2"
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">
                Direct
              </p>
              <Link
                href={`mailto:${site.email}`}
                className="mt-2 inline-block text-lg font-semibold text-[var(--text-primary)] underline-offset-4 hover:text-sky-300 hover:underline"
              >
                {site.email}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">
                Social
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <motion.div key={label} whileHover={{ y: -3 }}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-glass)] bg-white/5 text-[var(--text-primary)] transition hover:border-sky-400/40 hover:text-sky-300"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            {isDev ? (
              <Link
                href="/#marko-ai"
                className="rounded-2xl border border-[var(--border-glass)] bg-sky-500/10 px-4 py-3 text-center text-sm font-semibold text-sky-100 transition hover:bg-sky-500/15"
              >
                Open {site.agentName} →
              </Link>
            ) : (
              <Link
                href="/#marko-ai"
                className="rounded-2xl border border-[var(--border-glass)] bg-amber-500/10 px-4 py-3 text-center text-sm font-semibold text-amber-100 transition hover:bg-amber-500/15"
              >
                Open {site.agentName} →
              </Link>
            )}
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              {isDev
                ? "TypeScript-first delivery, documented handoffs, and motion-aware UI when the brand calls for it."
                : "Editorial portraiture and street work in the Times Square district — with the same polish I bring to production web apps."}
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

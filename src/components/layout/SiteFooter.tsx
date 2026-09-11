"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { site } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-glass)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center">
        <p>
          © 2026 {site.businessName}. Photography studio and
          software engineering — one brand.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/gallery" className="text-[var(--text-primary)] underline-offset-4 hover:underline">
            Gallery
          </Link>
          <Link href="/" className="text-[var(--text-primary)] underline-offset-4 hover:underline">
            Photography
          </Link>
          <Link href="/dev" className="text-[var(--text-primary)] underline-offset-4 hover:underline">
            Software Engineer
          </Link>
          <Link href="/dashboard" className="text-[var(--text-primary)] underline-offset-4 hover:underline">
            Dashboard
          </Link>
          <motion.div whileHover={{ y: -2 }}>
            <Link
              href="#hero"
              className="text-[var(--text-primary)] underline-offset-4 hover:underline"
            >
              Back to top
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { site } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-glass)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {site.businessName}. Crafted with Next.js,
          Tailwind, Framer Motion, and ShadCN-style primitives.
        </p>
        <motion.div whileHover={{ y: -2 }}>
          <Link
            href="#hero"
            className="text-[var(--text-primary)] underline-offset-4 hover:underline"
          >
            Back to top
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}

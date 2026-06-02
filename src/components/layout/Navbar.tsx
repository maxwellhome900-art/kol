"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { site } from "@/lib/data";

const photoLinks = [
  { href: "/#about", label: "About" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#marko-ai", label: site.agentName },
  { href: "/#pricing", label: "Packages" },
  { href: "/#timeline", label: "Rhythm" },
  { href: "/#contact", label: "Contact" },
];

const devLinks = [
  { href: "/dev#hero", label: "Intro" },
  { href: "/dev#projects", label: "Projects" },
  { href: "/dev#case-studies", label: "Case studies" },
  { href: "/dev#skills", label: "Skills" },
  { href: "/dev#contact", label: "Contact" },
  { href: "/#marko-ai", label: site.agentName },
];

export function Navbar() {
  const pathname = usePathname();
  const isDev = pathname.startsWith("/dev");
  const isDashboard = pathname.startsWith("/dashboard");
  const links = isDashboard ? [] : isDev ? devLinks : photoLinks;

  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [elevated, setElevated] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setElevated(y > 24));

  const toggle = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const brandHref = isDashboard
    ? "/dashboard"
    : isDev
      ? "/dev#hero"
      : "/#hero";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-shadow duration-300 md:px-6 ${
          elevated
            ? "glass shadow-lg shadow-black/20"
            : "border-transparent bg-transparent"
        }`}
        style={{
          borderColor: elevated ? "var(--border-glass)" : "transparent",
        }}
      >
        <Link
          href={brandHref}
          className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {site.name}
          <span className="text-amber-400">.</span>
        </Link>

        <nav
          className="hidden flex-1 flex-wrap items-center justify-end gap-1 md:flex"
          aria-label="Primary"
        >
          {isDashboard && (
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
            >
              Photography home
            </Link>
          )}
          {!isDashboard && !isDev && (
            <Link
              href="/dev"
              className="mr-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/20"
            >
              Dev portfolio
            </Link>
          )}
          {!isDashboard && isDev && (
            <Link
              href="/"
              className="mr-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
            >
              Photography
            </Link>
          )}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
            >
              {l.label}
            </Link>
          ))}
          {!isDashboard && (
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={toggle}
              className="glass flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-primary)]"
              aria-label="Toggle color theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>
          )}

          {!isDashboard && (
            <button
              type="button"
              className="glass flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mt-2 flex max-h-[min(70dvh,520px)] flex-col gap-1 overflow-y-auto rounded-2xl border border-[var(--border-glass)] p-3 md:hidden"
          >
            {isDashboard && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              >
                Photography home
              </Link>
            )}
            {!isDashboard && !isDev && (
              <Link
                href="/dev"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-sky-500/15 px-3 py-2 text-center text-sm font-semibold text-sky-100"
              >
                Web development
              </Link>
            )}
            {!isDashboard && isDev && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-amber-500/15 px-3 py-2 text-center text-sm font-semibold text-amber-100"
              >
                Photography home
              </Link>
            )}
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              >
                {l.label}
              </Link>
            ))}
            {!isDashboard && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              >
                Dashboard
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

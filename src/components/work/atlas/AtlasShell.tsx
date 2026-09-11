"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WorkDemoBar } from "@/components/work/WorkDemoBar";
import { atlasNav } from "@/lib/work/atlas";

export function AtlasShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const dark = mode === "dark";

  return (
    <div
      className={`min-h-dvh ${
        dark ? "bg-[#0b1020] text-[#f4f1ea]" : "bg-[#f4f1ea] text-[#0b1020]"
      }`}
    >
      <WorkDemoBar
        product="Atlas Design System"
        hint="Frontend demo — tokens and primitives, not a Storybook host"
      />
      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 md:py-10">
        <aside className="hidden w-52 shrink-0 md:block">
          <Link
            href="/work/atlas"
            className="font-[family-name:var(--font-syne)] text-xl tracking-tight"
          >
            Atlas
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-50">
            Design system
          </p>
          <nav className="mt-8 flex flex-col gap-2 text-sm">
            {atlasNav.map((item) => {
              const active =
                item.href === "/work/atlas"
                  ? pathname === "/work/atlas"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 ${
                    active
                      ? dark
                        ? "bg-white/8 text-sky-200"
                        : "bg-black/6 text-sky-800"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setMode(dark ? "light" : "dark")}
            className={`mt-8 w-full rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
              dark
                ? "border-white/15 hover:border-sky-400/40"
                : "border-black/15 hover:border-sky-600/40"
            }`}
          >
            {dark ? "Light paper" : "Dark ink"}
          </button>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:hidden">
            <Link
              href="/work/atlas"
              className="font-[family-name:var(--font-syne)] text-lg"
            >
              Atlas
            </Link>
            <button
              type="button"
              onClick={() => setMode(dark ? "light" : "dark")}
              className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
          <nav className="mb-6 flex flex-wrap gap-2 text-xs md:hidden">
            {atlasNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-current/15 px-3 py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}

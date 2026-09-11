"use client";

import Image from "next/image";
import Link from "next/link";
import { WorkDemoBar } from "@/components/work/WorkDemoBar";
import { harborBrandImage } from "@/lib/work/harbor";

const links = [
  { href: "/work/harbor", label: "Listings" },
  { href: "/work/harbor#search", label: "Search" },
];

export function HarborShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#071018] text-slate-100">
      <WorkDemoBar
        product="Harbor Estates"
        hint="Frontend demo — inquiries stay on this page"
      />
      <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#071018]/88 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/work/harbor"
            className="flex items-center gap-3 font-[family-name:var(--font-syne)] text-lg tracking-tight"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-cyan-300/40">
              <Image
                src={harborBrandImage}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            Harbor Estates
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-400">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-cyan-200">
                {item.label}
              </Link>
            ))}
            <Link
              href="/work/harbor#inquire"
              className="rounded-full bg-cyan-400 px-4 py-1.5 font-semibold text-slate-950"
            >
              Inquire
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

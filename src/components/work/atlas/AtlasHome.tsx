"use client";

import Link from "next/link";
import { atlasPrinciples } from "@/lib/work/atlas";

export function AtlasHome() {
  return (
    <main>
      <p className="text-xs uppercase tracking-[0.28em] text-sky-400">
        System
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-syne)] text-4xl">
        Compose, don&apos;t invent.
      </h1>
      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed opacity-70">
        Atlas is the documentation surface for the same tokens that dress this
        photography studio — color, type, and motion with a job. Click through
        the primitives; nothing here is a static screenshot.
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {atlasPrinciples.map((item) => (
          <li
            key={item.title}
            className="rounded-3xl border border-current/10 p-5"
          >
            <h2 className="font-[family-name:var(--font-syne)] text-lg">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/work/atlas/tokens"
          className="rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
        >
          Open tokens
        </Link>
        <Link
          href="/work/atlas/components"
          className="rounded-full border border-current/20 px-5 py-2.5 text-sm font-medium"
        >
          Open components
        </Link>
      </div>
    </main>
  );
}

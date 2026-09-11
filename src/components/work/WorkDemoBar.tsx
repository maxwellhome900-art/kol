"use client";

import Link from "next/link";

export function WorkDemoBar({
  product,
  hint,
}: {
  product: string;
  hint: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-2.5 text-xs text-slate-300 backdrop-blur-md">
      <p>
        <span className="font-semibold text-white">{product}</span>
        <span className="mx-2 text-slate-500">·</span>
        {hint}
      </p>
      <Link
        href="/dev#projects"
        className="rounded-full border border-white/15 px-3 py-1 font-medium text-white transition hover:border-sky-400/40 hover:text-sky-200"
      >
        ← Back to projects
      </Link>
    </div>
  );
}

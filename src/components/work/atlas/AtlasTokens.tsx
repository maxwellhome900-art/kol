"use client";

import { atlasColors, atlasMotion, atlasTypeScale } from "@/lib/work/atlas";

export function AtlasTokens() {
  return (
    <main>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl">Tokens</h1>
      <p className="mt-2 max-w-xl text-sm opacity-70">
        Named values squads are allowed to use. One-off hex in a feature file
        is a bug.
      </p>

      <h2 className="mt-10 font-[family-name:var(--font-syne)] text-xl">
        Color
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {atlasColors.map((token) => (
          <li
            key={token.name}
            className="flex items-center gap-4 rounded-2xl border border-current/10 p-3"
          >
            <span
              className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-black/20"
              style={{ background: token.hex }}
            />
            <div className="min-w-0">
              <p className="font-mono text-sm">{token.name}</p>
              <p className="font-mono text-xs opacity-50">{token.hex}</p>
              <p className="mt-1 text-xs opacity-70">{token.usage}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-[family-name:var(--font-syne)] text-xl">Type</h2>
      <ul className="mt-4 space-y-4">
        {atlasTypeScale.map((token) => (
          <li key={token.name} className="border-b border-current/8 pb-4">
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-50">
              {token.name} · {token.size} · {token.weight}
            </p>
            <p
              className="mt-1 font-[family-name:var(--font-syne)]"
              style={{ fontSize: token.size, fontWeight: Number(token.weight) }}
            >
              {token.sample}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-[family-name:var(--font-syne)] text-xl">
        Motion
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {atlasMotion.map((token) => (
          <li key={token.name} className="flex flex-wrap justify-between gap-2">
            <span className="font-mono">{token.name}</span>
            <span className="opacity-60">
              {token.duration} · {token.easing}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

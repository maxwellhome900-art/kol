"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  nebulaAdoptionSeries,
  nebulaErrorSeries,
  nebulaFeed,
  nebulaKpis,
  nebulaRoleCopy,
  nebulaTrafficSeries,
} from "@/lib/work/nebula";
import { NebulaChart } from "@/components/work/nebula/NebulaChart";
import { useNebula } from "@/components/work/nebula/NebulaContext";

export function NebulaOverview() {
  const { role, canTraffic } = useNebula();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((value) => (value + 1) % nebulaFeed.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const feed = [0, 1, 2, 3].map(
    (offset) => nebulaFeed[(tick + offset) % nebulaFeed.length],
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.28em] text-violet-300">
        Streaming overview
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl md:text-4xl">
        Product pulse
      </h1>
      <p className="mt-3 max-w-xl text-sm text-slate-400">
        {nebulaRoleCopy[role].blurb} Charts are seeded — the feed rotates to
        stand in for a live edge stream.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {nebulaKpis.map((kpi) => (
          <li
            key={kpi.id}
            className="rounded-3xl border border-white/8 bg-[#10162a] p-5"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {kpi.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl">
              {kpi.value}
            </p>
            <p
              className={`mt-1 text-sm ${
                kpi.tone === "up" ? "text-emerald-300" : "text-sky-300"
              }`}
            >
              {kpi.delta}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/8 bg-[#10162a] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-syne)] text-lg">
              Sessions
            </h2>
            {canTraffic ? (
              <Link
                href="/work/nebula/traffic"
                className="text-xs text-violet-300 hover:text-white"
              >
                Open traffic →
              </Link>
            ) : (
              <span className="text-xs text-slate-500">Operator+ to drill in</span>
            )}
          </div>
          <NebulaChart
            values={nebulaTrafficSeries}
            color="#a78bfa"
            label="Sessions over twelve intervals"
          />
        </article>
        <article className="rounded-3xl border border-white/8 bg-[#10162a] p-5">
          <h2 className="font-[family-name:var(--font-syne)] text-lg">Errors</h2>
          <NebulaChart
            values={nebulaErrorSeries}
            color="#38bdf8"
            label="Error rate over twelve intervals"
          />
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/8 bg-[#10162a] p-5">
          <h2 className="font-[family-name:var(--font-syne)] text-lg">
            Adoption
          </h2>
          <NebulaChart
            values={nebulaAdoptionSeries}
            color="#34d399"
            label="Adoption over twelve intervals"
          />
        </article>
        <article className="rounded-3xl border border-white/8 bg-[#10162a] p-5 lg:col-span-2">
          <h2 className="font-[family-name:var(--font-syne)] text-lg">
            Edge feed
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {feed.map((event) => (
              <li
                key={`${event.id}-${tick}`}
                className="flex gap-3 border-b border-white/5 pb-3 last:border-0"
              >
                <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-violet-300">
                  {event.source}
                </span>
                <span className="text-slate-300">{event.message}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </main>
  );
}

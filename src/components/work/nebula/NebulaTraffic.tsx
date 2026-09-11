"use client";

import { useState } from "react";
import Link from "next/link";
import { nebulaIncidents, nebulaRoutes } from "@/lib/work/nebula";
import { useNebula } from "@/components/work/nebula/NebulaContext";

export function NebulaTraffic() {
  const { canTraffic, canAck } = useNebula();
  const [acked, setAcked] = useState<Record<string, boolean>>({});

  if (!canTraffic) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-violet-300">
          Restricted
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl">
          Traffic is operator-only
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Switch the role in the header to Operator or Admin to open routes and
          incidents.
        </p>
        <Link
          href="/work/nebula"
          className="mt-8 inline-flex rounded-full bg-violet-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
        >
          Back to overview
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl">Traffic</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-400">
        Hottest routes and the incidents that still need a human. Acknowledge
        stays on this device.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#10162a] text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">P95</th>
              <th className="px-4 py-3 font-medium">Share</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="bg-[#0b1020]">
            {nebulaRoutes.map((route) => (
              <tr key={route.path} className="border-t border-white/6">
                <td className="px-4 py-3 font-mono text-violet-100">
                  {route.path}
                </td>
                <td className="px-4 py-3">{route.p95}</td>
                <td className="px-4 py-3 text-slate-400">{route.share}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      route.status === "healthy"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : "bg-amber-400/15 text-amber-100"
                    }`}
                  >
                    {route.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-[family-name:var(--font-syne)] text-xl">
        Incidents
      </h2>
      <ul className="mt-4 space-y-3">
        {nebulaIncidents.map((incident) => {
          const done = incident.status === "acked" || acked[incident.id];
          return (
            <li
              key={incident.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#10162a] px-4 py-4"
            >
              <div>
                <p className="font-mono text-xs text-violet-300">{incident.id}</p>
                <p className="mt-1 font-medium">{incident.title}</p>
                <p className="text-xs text-slate-500">
                  {incident.region} · {incident.severity}
                </p>
              </div>
              {done ? (
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Acknowledged
                </span>
              ) : canAck ? (
                <button
                  type="button"
                  onClick={() =>
                    setAcked((current) => ({ ...current, [incident.id]: true }))
                  }
                  className="rounded-full bg-violet-400 px-4 py-1.5 text-xs font-semibold text-slate-950"
                >
                  Acknowledge
                </button>
              ) : (
                <span className="text-xs text-slate-500">View only</span>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

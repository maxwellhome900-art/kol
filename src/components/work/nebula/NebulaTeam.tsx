"use client";

import Link from "next/link";
import { nebulaRoleCopy, nebulaSeats } from "@/lib/work/nebula";
import { useNebula } from "@/components/work/nebula/NebulaContext";

export function NebulaTeam() {
  const { canTeam } = useNebula();

  if (!canTeam) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-violet-300">
          Restricted
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl">
          Team is admin-only
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Switch the header role to Admin to see the seat matrix.
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
      <h1 className="font-[family-name:var(--font-syne)] text-3xl">Team</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-400">
        Seats and roles for this demo org. Editing a live directory would live
        behind the same admin gate.
      </p>
      <ul className="mt-8 divide-y divide-white/8 overflow-hidden rounded-3xl border border-white/8 bg-[#10162a]">
        {nebulaSeats.map((seat) => (
          <li
            key={seat.email}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="font-medium">{seat.name}</p>
              <p className="text-sm text-slate-500">{seat.email}</p>
            </div>
            <span className="rounded-full border border-violet-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-100">
              {nebulaRoleCopy[seat.role].label}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

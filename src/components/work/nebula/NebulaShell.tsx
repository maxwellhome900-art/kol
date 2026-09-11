"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkDemoBar } from "@/components/work/WorkDemoBar";
import {
  nebulaRoleCopy,
  nebulaRoles,
} from "@/lib/work/nebula";
import { useNebula } from "@/components/work/nebula/NebulaContext";

const links = [
  { href: "/work/nebula", label: "Overview" },
  { href: "/work/nebula/traffic", label: "Traffic" },
  { href: "/work/nebula/team", label: "Team" },
];

export function NebulaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole } = useNebula();

  return (
    <div className="min-h-dvh bg-[#070b16] text-slate-100">
      <WorkDemoBar
        product="Nebula Dashboard"
        hint="Frontend demo — roles change what you can see"
      />
      <header className="sticky top-0 z-30 border-b border-violet-400/15 bg-[#070b16]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link
            href="/work/nebula"
            className="font-[family-name:var(--font-syne)] text-lg tracking-tight"
          >
            Nebula
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {links.map((item) => {
              const active =
                item.href === "/work/nebula"
                  ? pathname === "/work/nebula"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "text-violet-200" : "hover:text-white"}
                >
                  {item.label}
                </Link>
              );
            })}
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
              Role
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as typeof role)
                }
                className="rounded-full border border-violet-400/30 bg-[#0d1224] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-violet-100"
              >
                {nebulaRoles.map((item) => (
                  <option key={item} value={item}>
                    {nebulaRoleCopy[item].label}
                  </option>
                ))}
              </select>
            </label>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

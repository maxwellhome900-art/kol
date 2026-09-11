"use client";

import { useState } from "react";

export function AtlasComponents() {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <main>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl">
        Components
      </h1>
      <p className="mt-2 max-w-xl text-sm opacity-70">
        A small primitive set — enough to ship a product surface without a new
        button every sprint.
      </p>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] opacity-50">Buttons</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
          >
            Primary
          </button>
          <button
            type="button"
            className="rounded-full border border-current/20 px-5 py-2.5 text-sm font-medium"
          >
            Secondary
          </button>
          <button
            type="button"
            className="rounded-full bg-amber-400/20 px-5 py-2.5 text-sm font-medium text-amber-200"
          >
            Photo accent
          </button>
          <button
            type="button"
            disabled
            className="rounded-full bg-current/10 px-5 py-2.5 text-sm opacity-40"
          >
            Disabled
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] opacity-50">
          Field + toggle
        </h2>
        <div className="mt-3 flex max-w-md flex-col gap-3">
          <label className="text-sm">
            Label
            <input
              className="mt-1 w-full rounded-xl border border-current/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/50"
              placeholder="you@domain.com"
            />
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setOn((value) => !value)}
            className={`flex w-14 items-center rounded-full p-1 transition ${
              on ? "bg-sky-400" : "bg-current/15"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full bg-white transition ${
                on ? "translate-x-6" : ""
              }`}
            />
            <span className="sr-only">Toggle demo</span>
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] opacity-50">Badges</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold text-sky-300">
            Signal
          </span>
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
            Ember
          </span>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Healthy
          </span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] opacity-50">Dialog</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 rounded-full border border-current/20 px-5 py-2.5 text-sm"
        >
          Open dialog
        </button>
        {open ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Dismiss"
              className="absolute inset-0 bg-black/55"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b1020] p-6 text-[#f4f1ea] shadow-2xl">
              <h3 className="font-[family-name:var(--font-syne)] text-xl">
                Confirm hold
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                A primitive dialog — focus stays here until you dismiss. No
                new modal library required.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-full bg-sky-400 py-2.5 text-sm font-semibold text-slate-950"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

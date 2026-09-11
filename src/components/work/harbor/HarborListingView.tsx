"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import { formatUsd } from "@/lib/data";
import type { HarborListing } from "@/lib/work/harbor";

export function HarborListingView({ listing }: { listing: HarborListing }) {
  const [active, setActive] = useState(listing.gallery[0] ?? listing.image);
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href="/work/harbor"
        className="text-xs uppercase tracking-[0.2em] text-cyan-300"
      >
        ← {listing.neighborhood}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image
              src={active}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          <ul className="mt-3 grid grid-cols-3 gap-3">
            {listing.gallery.map((src) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActive(src)}
                  className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-2 ${
                    active === src ? "ring-cyan-300" : "ring-transparent"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            {listing.status} · {listing.type}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl">
            {listing.title}
          </h1>
          <p className="mt-4 text-2xl font-semibold">{formatUsd(listing.price)}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {listing.beds} bedrooms
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.baths} baths
            </span>
            <span className="inline-flex items-center gap-1">
              <Maximize2 className="h-4 w-4" />
              {listing.sqft.toLocaleString("en-US")} sf
            </span>
          </div>
          <p className="mt-6 leading-relaxed text-slate-300">{listing.story}</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-400">
            {listing.highlights.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
          {sent ? (
            <p className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
              Inquiry recorded on this demo — nothing was emailed.
            </p>
          ) : (
            <form
              id="inquire"
              className="mt-8 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <p className="text-sm font-semibold">Request a walkthrough</p>
              <input
                required
                name="name"
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-[#0c1822] px-3 py-2.5 text-sm"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-[#0c1822] px-3 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950"
              >
                Inquire about this home
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import { formatUsd } from "@/lib/data";
import {
  filterHarborListings,
  harborHeroImage,
  harborListings,
  harborNeighborhoods,
  type HarborNeighborhoodFilter,
} from "@/lib/work/harbor";

const bedOptions = [0, 1, 2, 3, 4];
const priceOptions = [
  { label: "Any price", value: 20_000_000 },
  { label: "Under $2M", value: 2_000_000 },
  { label: "Under $3.5M", value: 3_500_000 },
  { label: "Under $6M", value: 6_000_000 },
];

export function HarborHome() {
  const [neighborhood, setNeighborhood] =
    useState<HarborNeighborhoodFilter>("All");
  const [beds, setBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20_000_000);
  const [inquiry, setInquiry] = useState<"idle" | "sent">("idle");

  const results = useMemo(
    () => filterHarborListings({ neighborhood, beds, maxPrice }),
    [neighborhood, beds, maxPrice],
  );

  return (
    <main>
      <section className="relative isolate min-h-[62vh] overflow-hidden">
        <Image
          src={harborHeroImage}
          alt="Harbor Estates — a modern residence at dusk"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-[#071018]/70 to-[#071018]/20" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-6xl flex-col justify-end px-5 py-16">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            New York residences
          </p>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-syne)] text-4xl font-semibold md:text-6xl">
            Homes with a point of view.
          </h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Lofts, townhouses, and penthouses — searched the way a photographer
            reads a street: light, proportion, and neighborhood first.
          </p>
        </div>
      </section>

      <section
        id="search"
        className="mx-auto -mt-10 max-w-6xl scroll-mt-28 px-5"
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="grid gap-3 rounded-3xl border border-cyan-400/15 bg-[#0c1822] p-4 shadow-2xl shadow-black/40 md:grid-cols-4"
        >
          <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Neighborhood
            <select
              value={neighborhood}
              onChange={(event) =>
                setNeighborhood(event.target.value as HarborNeighborhoodFilter)
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm text-white"
            >
              {harborNeighborhoods.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Beds
            <select
              value={beds}
              onChange={(event) => setBeds(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm text-white"
            >
              {bedOptions.map((count) => (
                <option key={count} value={count}>
                  {count === 0 ? "Any" : `${count}+`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Price
            <select
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm text-white"
            >
              {priceOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <p className="w-full rounded-xl bg-cyan-400/10 px-3 py-2.5 text-center text-sm font-semibold text-cyan-100">
              {results.length} {results.length === 1 ? "home" : "homes"}
            </p>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <ul className="grid gap-8 md:grid-cols-2">
          {results.map((listing) => (
            <li key={listing.slug}>
              <Link
                href={`/work/harbor/${listing.slug}`}
                className="group block overflow-hidden rounded-3xl border border-white/8 bg-[#0c1822]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                    {listing.status}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/90">
                    {listing.neighborhood} · {listing.type}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-syne)] text-xl">
                    {listing.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{listing.blurb}</p>
                  <p className="mt-4 text-lg font-semibold">
                    {formatUsd(listing.price)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {listing.beds} bd
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" />
                      {listing.baths} ba
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5" />
                      {listing.sqft.toLocaleString("en-US")} sf
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {results.length === 0 ? (
          <p className="rounded-2xl border border-white/8 px-5 py-10 text-center text-slate-400">
            No homes match those filters. Widen the search.
          </p>
        ) : null}
      </section>

      <section
        id="inquire"
        className="border-t border-white/8 bg-[#0c1822] px-5 py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl">
              Talk to an advisor
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              This inquiry form is a frontend demo. In production it would
              route to a brokerage inbox.
            </p>
          </div>
          {inquiry === "sent" ? (
            <p className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-cyan-50">
              Received — nothing was emailed. In a live build this would notify
              the desk.
            </p>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setInquiry("sent");
              }}
            >
              <input
                required
                name="name"
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm"
              />
              <textarea
                required
                name="note"
                rows={4}
                placeholder="Neighborhood, budget, timing…"
                className="w-full rounded-xl border border-white/10 bg-[#071018] px-3 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950"
              >
                Send inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

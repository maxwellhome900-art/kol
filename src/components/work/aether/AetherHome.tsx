"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/data";
import {
  aetherCategories,
  aetherProducts,
  filterAetherProducts,
  type AetherFilter,
} from "@/lib/work/aether";
import { useAetherCart } from "@/components/work/aether/AetherCartContext";

export function AetherHome() {
  const [filter, setFilter] = useState<AetherFilter>("All");
  const { add } = useAetherCart();
  const products = useMemo(() => filterAetherProducts(filter), [filter]);
  const featured = aetherProducts[0];

  return (
    <main>
      <section className="relative isolate min-h-[70vh] overflow-hidden">
        <Image
          src={featured.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0908] via-[#0b0908]/75 to-transparent" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-5 py-16 md:justify-center">
          <p className="text-xs uppercase tracking-[0.32em] text-[#c9a227]">
            Editorial objects
          </p>
          <h1 className="mt-4 max-w-xl font-[family-name:var(--font-syne)] text-4xl font-semibold tracking-tight md:text-6xl">
            Objects with atmosphere.
          </h1>
          <p className="mt-4 max-w-md text-[#c4b8a8]">
            Apparel, lamps, fragrance, and signed print editions — a shop
            front with the same compositional care as a Times Square frame.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#catalog"
              className="rounded-full bg-[#c9a227] px-6 py-3 text-sm font-semibold text-[#1a1408]"
            >
              Shop the collection
            </Link>
            <Link
              href={`/work/aether/${featured.slug}`}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium"
            >
              View {featured.name}
            </Link>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl">
              The collection
            </h2>
            <p className="mt-2 text-sm text-[#9a8f82]">
              Filter by category. Add to bag without leaving the grid.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {aetherCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
                  filter === category
                    ? "bg-[#c9a227] text-[#1a1408]"
                    : "border border-white/12 text-[#c4b8a8]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.slug} className="group">
              <Link href={`/work/aether/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/40">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#c9a227]">
                  {product.category}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-syne)] text-lg">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-[#9a8f82]">{product.tagline}</p>
                <p className="mt-2 text-sm font-semibold">
                  {formatUsd(product.price)}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => add(product.slug)}
                className="mt-3 w-full rounded-full border border-[#c9a227]/35 py-2.5 text-sm font-medium hover:bg-[#c9a227] hover:text-[#1a1408]"
              >
                Add to bag
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="editions"
        className="border-t border-white/8 bg-[#120f0d] px-5 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl">
            Print editions
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[#9a8f82]">
            Signed Times Square frames, edition of 25. Same shop cart as the
            objects — one checkout.
          </p>
        </div>
      </section>
    </main>
  );
}

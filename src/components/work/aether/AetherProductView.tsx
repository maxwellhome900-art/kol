"use client";

import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/lib/data";
import type { AetherProduct } from "@/lib/work/aether";
import { useAetherCart } from "@/components/work/aether/AetherCartContext";

export function AetherProductView({ product }: { product: AetherProduct }) {
  const { add } = useAetherCart();

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:py-20">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex flex-col justify-center">
        <Link
          href="/work/aether"
          className="text-xs uppercase tracking-[0.2em] text-[#c9a227]"
        >
          ← {product.category}
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-lg text-[#c4b8a8]">{product.tagline}</p>
        <p className="mt-6 text-2xl font-semibold">{formatUsd(product.price)}</p>
        <p className="mt-6 max-w-md leading-relaxed text-[#c4b8a8]">
          {product.description}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-[#9a8f82]">
          {product.details.map((detail) => (
            <li key={detail}>— {detail}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => add(product.slug)}
          className="mt-8 w-full max-w-sm rounded-full bg-[#c9a227] py-3.5 text-sm font-semibold text-[#1a1408]"
        >
          Add to bag
        </button>
      </div>
    </main>
  );
}

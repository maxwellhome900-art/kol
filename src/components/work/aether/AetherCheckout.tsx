"use client";

import Link from "next/link";
import { useState } from "react";
import { formatUsd } from "@/lib/data";
import {
  productForLine,
  useAetherCart,
} from "@/components/work/aether/AetherCartContext";

export function AetherCheckout() {
  const { lines, subtotal, clear } = useAetherCart();
  const [status, setStatus] = useState<"form" | "placed">("form");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("placed");
    clear();
  }

  if (status === "placed") {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[#c9a227]">
          Order received
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-4xl">
          Thank you.
        </h1>
        <p className="mt-4 text-[#c4b8a8]">
          This is a frontend demo — nothing was charged. In a production shop
          this is where payment and fulfillment would start.
        </p>
        <Link
          href="/work/aether"
          className="mt-8 inline-flex rounded-full bg-[#c9a227] px-6 py-3 text-sm font-semibold text-[#1a1408]"
        >
          Back to the shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-12 px-5 py-14 lg:grid-cols-5">
      <form onSubmit={onSubmit} className="space-y-4 lg:col-span-3">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl">Checkout</h1>
        <p className="text-sm text-[#9a8f82]">
          Demo checkout — enter a name and email to complete the flow.
        </p>
        <label className="block text-sm">
          Name
          <input
            required
            name="name"
            autoComplete="name"
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/5 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/5 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          Shipping address
          <input
            required
            name="address"
            autoComplete="street-address"
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/5 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          disabled={lines.length === 0}
          className="w-full rounded-full bg-[#c9a227] py-3.5 text-sm font-semibold text-[#1a1408] disabled:opacity-40"
        >
          Place demo order · {formatUsd(subtotal)}
        </button>
      </form>
      <aside className="rounded-3xl border border-white/10 bg-[#14110f] p-6 lg:col-span-2">
        <h2 className="font-[family-name:var(--font-syne)] text-lg">Bag</h2>
        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-[#9a8f82]">
            Your bag is empty.{" "}
            <Link href="/work/aether" className="text-[#c9a227]">
              Return to shop
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => {
              const product = productForLine(line.slug);
              if (!product) return null;
              return (
                <li key={line.slug} className="flex justify-between gap-3">
                  <span>
                    {product.name} × {line.qty}
                  </span>
                  <span>{formatUsd(product.price * line.qty)}</span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-sm">
          <span className="text-[#9a8f82]">Subtotal</span>
          <span>{formatUsd(subtotal)}</span>
        </div>
      </aside>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { formatUsd } from "@/lib/data";
import { WorkDemoBar } from "@/components/work/WorkDemoBar";
import {
  productForLine,
  useAetherCart,
} from "@/components/work/aether/AetherCartContext";

const nav = [
  { href: "/work/aether", label: "Shop" },
  { href: "/work/aether#editions", label: "Editions" },
];

export function AetherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { itemCount, cartOpen, setCartOpen, lines, setQty, remove, subtotal } =
    useAetherCart();

  return (
    <div className="min-h-dvh bg-[#0b0908] text-[#f4efe6]">
      <WorkDemoBar
        product="Aether Market"
        hint="Frontend demo — cart and checkout stay on this device"
      />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#0b0908]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/work/aether"
            className="font-[family-name:var(--font-syne)] text-lg tracking-[0.18em] uppercase"
          >
            Aether
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#c4b8a8]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#c9a227]/40 px-3 py-1.5 text-[#f4efe6] hover:border-[#c9a227]"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-semibold">{itemCount}</span>
            </button>
          </nav>
        </div>
      </header>
      {children}
      {cartOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/55"
            onClick={() => setCartOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#14110f] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-syne)] text-xl">Bag</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1 hover:bg-white/5"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex-1 space-y-5 overflow-y-auto">
              {lines.length === 0 ? (
                <li className="text-sm text-[#9a8f82]">Your bag is empty.</li>
              ) : (
                lines.map((line) => {
                  const product = productForLine(line.slug);
                  if (!product) return null;
                  return (
                    <li key={line.slug} className="flex gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="mt-1 text-sm text-[#9a8f82]">
                          {formatUsd(product.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <button
                            type="button"
                            className="h-7 w-7 rounded-full border border-white/15"
                            onClick={() => setQty(line.slug, line.qty - 1)}
                          >
                            −
                          </button>
                          <span>{line.qty}</span>
                          <button
                            type="button"
                            className="h-7 w-7 rounded-full border border-white/15"
                            onClick={() => setQty(line.slug, line.qty + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-2 text-xs text-[#c9a227]"
                            onClick={() => remove(line.slug)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-[#9a8f82]">Subtotal</span>
                <span>{formatUsd(subtotal)}</span>
              </div>
              {pathname === "/work/aether/checkout" ? (
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="w-full rounded-full bg-[#c9a227] py-3 text-sm font-semibold text-[#1a1408]"
                >
                  Continue checkout
                </button>
              ) : (
                <Link
                  href="/work/aether/checkout"
                  onClick={() => setCartOpen(false)}
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold ${
                    lines.length
                      ? "bg-[#c9a227] text-[#1a1408]"
                      : "pointer-events-none bg-white/10 text-[#9a8f82]"
                  }`}
                >
                  Checkout
                </Link>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

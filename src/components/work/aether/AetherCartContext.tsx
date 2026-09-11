"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { aetherProducts, type AetherProduct } from "@/lib/work/aether";

export type AetherLine = {
  slug: string;
  qty: number;
};

type AetherCartValue = {
  lines: AetherLine[];
  itemCount: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const AetherCartContext = createContext<AetherCartValue | null>(null);

function lineProduct(slug: string): AetherProduct | undefined {
  return aetherProducts.find((product) => product.slug === slug);
}

export function AetherCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<AetherLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug ? { ...line, qty: line.qty + qty } : line,
        );
      }
      return [...current, { slug, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((current) => {
      if (qty < 1) return current.filter((line) => line.slug !== slug);
      return current.map((line) => (line.slug === slug ? { ...line, qty } : line));
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => {
    const product = lineProduct(line.slug);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
    }),
    [lines, itemCount, subtotal, add, setQty, remove, clear, cartOpen],
  );

  return (
    <AetherCartContext.Provider value={value}>{children}</AetherCartContext.Provider>
  );
}

export function useAetherCart() {
  const ctx = useContext(AetherCartContext);
  if (!ctx) {
    throw new Error("useAetherCart must be used inside AetherCartProvider");
  }
  return ctx;
}

export function productForLine(slug: string): AetherProduct | undefined {
  return lineProduct(slug);
}

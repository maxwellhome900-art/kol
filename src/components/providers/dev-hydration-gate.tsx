"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const emptySubscribe = () => () => {};

/**
 * Cursor's in-editor browser stamps `data-cursor-ref` on the DOM before React
 * hydrates, which Next.js reports as a hydration mismatch. Defer the tree until
 * after hydration in development only. Production still SSR's the full page.
 */
export function DevHydrationGate({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (process.env.NODE_ENV !== "development") return children;
  if (!isClient) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-dvh bg-[var(--background)]"
      />
    );
  }

  return children;
}

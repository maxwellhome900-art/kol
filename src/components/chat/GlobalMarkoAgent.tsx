"use client";

import { MarkoAIChat } from "@/components/chat/MarkoAIChat";

/** Mounts Marko AI on every route so dev + photo visitors share the same agent entry point. */
export function GlobalMarkoAgent() {
  return <MarkoAIChat />;
}

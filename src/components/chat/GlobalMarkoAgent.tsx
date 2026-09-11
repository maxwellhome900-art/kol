"use client";

import { usePathname } from "next/navigation";
import { MarkoAIChat } from "@/components/chat/MarkoAIChat";

/** Mounts Marko AI on studio routes; demo product apps keep their own chrome. */
export function GlobalMarkoAgent() {
  const pathname = usePathname();
  if (pathname.startsWith("/work")) return null;
  return <MarkoAIChat />;
}

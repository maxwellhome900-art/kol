import type { Metadata } from "next";
import { AetherCartProvider } from "@/components/work/aether/AetherCartContext";
import { AetherShell } from "@/components/work/aether/AetherShell";

export const metadata: Metadata = {
  title: "Aether Market",
  description:
    "Editorial ecommerce frontend — collections, cart, and demo checkout.",
};

export default function AetherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AetherCartProvider>
      <AetherShell>{children}</AetherShell>
    </AetherCartProvider>
  );
}

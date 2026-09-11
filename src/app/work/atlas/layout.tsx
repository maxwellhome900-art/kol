import type { Metadata } from "next";
import { AtlasShell } from "@/components/work/atlas/AtlasShell";

export const metadata: Metadata = {
  title: "Atlas Design System",
  description:
    "Live design-system docs — tokens, primitives, and motion examples.",
};

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AtlasShell>{children}</AtlasShell>;
}

import type { Metadata } from "next";
import { HarborShell } from "@/components/work/harbor/HarborShell";

export const metadata: Metadata = {
  title: "Harbor Estates",
  description:
    "Luxury real-estate frontend — neighborhood search and listing inquiry.",
};

export default function HarborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HarborShell>{children}</HarborShell>;
}

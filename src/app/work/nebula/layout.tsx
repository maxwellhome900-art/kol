import type { Metadata } from "next";
import { NebulaProvider } from "@/components/work/nebula/NebulaContext";
import { NebulaShell } from "@/components/work/nebula/NebulaShell";

export const metadata: Metadata = {
  title: "Nebula Dashboard",
  description:
    "Analytics frontend with KPI tiles, charts, and role-aware views.",
};

export default function NebulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NebulaProvider>
      <NebulaShell>{children}</NebulaShell>
    </NebulaProvider>
  );
}

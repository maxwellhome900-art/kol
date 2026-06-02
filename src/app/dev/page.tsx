import type { Metadata } from "next";
import { DevPortfolio } from "@/components/portfolio/DevPortfolio";

export const metadata: Metadata = {
  title: "Web development portfolio",
  description:
    "Interfaces, systems, and product craft — Next.js, TypeScript, and design systems.",
};

export default function DevPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <DevPortfolio />
    </div>
  );
}

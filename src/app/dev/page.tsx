import type { Metadata } from "next";
import { DevPortfolio } from "@/components/portfolio/DevPortfolio";

export const metadata: Metadata = {
  title: "Software Engineer portfolio",
  description:
    "Interfaces, systems, and this photography studio itself — Next.js, TypeScript, and design systems with the same cinematic brand.",
};

export default function DevPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <DevPortfolio />
    </div>
  );
}

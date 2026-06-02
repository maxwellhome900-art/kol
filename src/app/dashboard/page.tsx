import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Studio dashboard",
  description: "Sessions, calendar, and client notes for Mark Photography.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

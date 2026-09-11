import type { Metadata } from "next";
import { AetherCheckout } from "@/components/work/aether/AetherCheckout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Aether Market demo checkout.",
};

export default function AetherCheckoutPage() {
  return <AetherCheckout />;
}

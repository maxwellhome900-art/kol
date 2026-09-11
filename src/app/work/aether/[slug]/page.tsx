import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AetherProductView } from "@/components/work/aether/AetherProductView";
import { aetherProducts, getAetherProduct } from "@/lib/work/aether";

export function generateStaticParams() {
  return aetherProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getAetherProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function AetherProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getAetherProduct(slug);
  if (!product) notFound();
  return <AetherProductView product={product} />;
}

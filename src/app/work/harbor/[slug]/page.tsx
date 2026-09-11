import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HarborListingView } from "@/components/work/harbor/HarborListingView";
import { getHarborListing, harborListings } from "@/lib/work/harbor";

export function generateStaticParams() {
  return harborListings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getHarborListing(slug);
  if (!listing) return { title: "Listing" };
  return {
    title: listing.title,
    description: listing.blurb,
  };
}

export default async function HarborListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getHarborListing(slug);
  if (!listing) notFound();
  return <HarborListingView listing={listing} />;
}

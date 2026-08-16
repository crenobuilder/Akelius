import type { Metadata } from "next";
import ListingDetail from "./ListingDetail";
import { listingBySlug } from "@/data/listings";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = listingBySlug(id);
  return {
    title: listing ? `${listing.title} — akelius` : "annonce — akelius",
    description: listing?.description.slice(0, 155),
  };
}

export default async function BienPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetail slug={id} />;
}

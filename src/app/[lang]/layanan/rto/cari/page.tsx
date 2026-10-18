import type { Metadata } from "next";
import { Suspense } from "react";
import ListingSearch from "@/components/rto/listing/ListingSearch";
import { getAllListings } from "@/lib/rto-listing";

// Cari unit RTO (acuan tampilan halaman hasil cari katalog hunian): kolom cari, filter, kartu, dan peta pin harga.
// Data unit dari database (unit tayang/penuh, kolom aman saja) + listing manual, disaring di browser.

export const metadata: Metadata = {
  title: "Cari kos dan rumah sewa",
  description:
    "Cari kos dan rumah sewa mitra barumahID yang sudah dicek langsung. Saring per kota, harga, fasilitas, dan unit Program Rent-to-Own. Lokasi di peta adalah area perkiraan.",
  alternates: { canonical: "/layanan/rto/cari" },
};

export default async function CariUnitPage() {
  const listings = await getAllListings();
  return (
    <div className="min-h-screen bg-brand-cream pt-[68px]">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ListingSearch listings={listings} />
      </Suspense>
    </div>
  );
}

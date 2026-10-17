"use client";

import dynamic from "next/dynamic";

// Peta area perkiraan di halaman detail unit (lingkaran, bukan titik persis). Leaflet dimuat hanya di sisi browser.

const ListingMap = dynamic(() => import("./ListingMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-brand-cream-warm" />,
});

export default function AreaMap({ lat, lng }: { lat: number; lng: number }) {
  return <ListingMap area={{ lat, lng, radius: 450 }} scrollZoom={false} />;
}

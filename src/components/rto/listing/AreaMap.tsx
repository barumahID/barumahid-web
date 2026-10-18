"use client";

import dynamic from "next/dynamic";
import type { MapTone } from "@/data/listings";

// Peta di halaman detail unit: satu pin berwarna status dan lingkaran area perkiraan (titik sudah digeser, bukan lokasi persis).
// Leaflet dimuat hanya di sisi browser.

const ListingMap = dynamic(() => import("./ListingMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-brand-cream-warm" />,
});

export default function AreaMap({ lat, lng, tone }: { lat: number; lng: number; tone: MapTone }) {
  return <ListingMap area={{ lat, lng, tone }} scrollZoom={false} />;
}

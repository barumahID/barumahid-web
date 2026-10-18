"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Link from "@/i18n/Link";
import { dpPerMonth } from "@/data/rto";
import { listingKind, listingPrice, listingRto, listingStatusLabel, type Listing } from "@/data/listings";
import { SaveHeart } from "./Buttons";
import { priceMain, rp } from "./format";

// Kartu listing gaya katalog hunian: foto bisa digeser (panah saat disorot di desktop, usap di HP), hati untuk
// menyimpan, lencana Program RTO untuk unit yang pemiliknya bersedia ikut program.

export function PhotoPlaceholder({ label = "Foto menyusul" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-mute">
      <svg viewBox="0 0 24 24" aria-hidden className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M3 11 12 4l9 7M5 9.5V20h14V9.5M10 20v-5h4v5" />
      </svg>
      <span className="text-[12px] font-semibold">{label}</span>
    </div>
  );
}

/** Baris kecil di kartu: ukuran atau jumlah kamar, lalu dua fasilitas pertama */
function cardFacts(l: Listing): string[] {
  if (l.category === "siap-berdaya") {
    const size = l.rooms ? `${l.rooms} ${l.kind === "kos" ? "kamar" : "unit"}` : l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "";
    return [size, ...(l.fasilitas ?? []).slice(0, 2)].filter(Boolean);
  }
  if (l.category === "siap-beli") {
    return [l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "", l.kamarMandi ? `${l.kamarMandi} kamar mandi` : "", ...(l.fasilitas ?? []).slice(-1)].filter(Boolean);
  }
  if (l.luasBangunan || l.kamarTidur)
    return [l.lantai ? `${l.lantai} lantai` : "", l.luasBangunan ? `${l.luasBangunan} m²` : "", l.kamarTidur ? `${l.kamarTidur} kamar tidur` : ""].filter(Boolean);
  return [l.luasLahan ? `Lahan ${l.luasLahan} m²` : "", l.dimensi ?? ""].filter(Boolean);
}

/** Warna lencana per status */
const BADGE: Record<string, string> = {
  terisi: "bg-brand-dark/85 text-white",
  terjual: "bg-brand-dark/85 text-white",
  selesai: "bg-credit text-white",
  segera: "bg-build text-white",
};

export default function ListingCard({
  l,
  active = false,
  onHover,
  sizes = "(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw",
}: {
  l: Listing;
  active?: boolean;
  onHover?: (slug: string | null) => void;
  sizes?: string;
}) {
  const href = `/layanan/rto/${l.slug}`;
  const photos = l.photos.slice(0, 6);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const price = listingPrice(l);
  const rto = listingRto(l);
  const place = l.kelurahan || l.kecamatan || l.city;
  const facts = cardFacts(l);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollTo({ left: (index + dir) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <article className="group/card relative" onMouseEnter={() => onHover?.(l.slug)} onMouseLeave={() => onHover?.(null)}>
      <div
        className={`relative aspect-[20/19] overflow-hidden rounded-2xl bg-brand-cream-warm transition-shadow ${
          active ? "shadow-[0_0_0_2px_#141414]" : ""
        }`}
      >
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <div
            ref={track}
            onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
          >
            {photos.length ? (
              photos.map((p, i) => (
                <div key={p.src} className="relative h-full w-full shrink-0 snap-center">
                  <Image src={p.src} alt={i === 0 ? p.alt : ""} fill sizes={sizes} className="object-cover" />
                </div>
              ))
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
        </Link>

        {/* Lencana */}
        {BADGE[l.status] ? (
          <span className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold ${BADGE[l.status]}`}>{listingStatusLabel(l)}</span>
        ) : rto ? (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-brand-dark shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            Program RTO
          </span>
        ) : null}
        <div className="absolute right-2 top-2">
          <SaveHeart slug={l.slug} title={l.title} />
        </div>

        {/* Panah dan titik foto */}
        {photos.length > 1 && (
          <>
            {index > 0 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto sebelumnya"
                className="absolute left-2.5 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand-dark opacity-0 shadow transition-opacity hover:scale-105 focus-visible:opacity-100 group-hover/card:opacity-100 md:grid"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto berikutnya"
                className="absolute right-2.5 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand-dark opacity-0 shadow transition-opacity hover:scale-105 focus-visible:opacity-100 group-hover/card:opacity-100 md:grid"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
              {photos.map((p, i) => (
                <span key={p.src} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/55"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <Link href={href} className="mt-3 block">
        <h3 className="truncate text-[15px] font-bold text-brand-dark">
          {listingKind(l)} di {place}
        </h3>
        <p className="truncate text-[14px] text-brand-gray">{l.title}</p>
        {facts.length > 0 && <p className="truncate text-[13.5px] text-brand-gray">{facts.join(" · ")}</p>}
        <p className="mt-1.5 text-[15px] text-brand-dark">
          {l.status === "terjual" && <span className="text-brand-gray">Terjual </span>}
          <span className="font-extrabold">{priceMain(price)}</span>
          {price.suffix && price.value !== null && <span className="text-brand-gray"> {price.suffix.replace("/", "/ ")}</span>}
        </p>
        {l.status === "terisi" && l.availableFrom ? (
          <p className="truncate text-[13px] font-semibold text-build">Tersedia lagi mulai {l.availableFrom}</p>
        ) : rto && l.category === "siap-berdaya" && l.status === "tersedia" ? (
          <p className="truncate text-[13px] font-semibold text-credit">Saldo DP {rp(dpPerMonth(l.sewaPerBulan))}/bln saat RTO</p>
        ) : null}
      </Link>
    </article>
  );
}

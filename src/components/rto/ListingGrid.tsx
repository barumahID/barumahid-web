"use client";

import Image from "next/image";
import Link from "@/i18n/Link";
import { useMemo, useState } from "react";
import { RTO_PATHS, RTO_RATE, type RtoCategory } from "@/data/rto";
import { STATUS_LABEL, listingPrice, type Listing } from "@/data/listings";

const rp = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));

function ListingCard({ l }: { l: Listing }) {
  const price = listingPrice(l);
  const path = RTO_PATHS.find((p) => p.id === l.category);
  const cover = l.photos[0];
  return (
    <Link
      href={`/layanan/rto/${l.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-dark/10 bg-white transition-shadow hover:shadow-[0_24px_50px_-28px_rgba(20,20,20,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream-warm">
        {cover && (
          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-dark">{path?.name}</span>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${
            l.status === "tersedia" ? "bg-credit text-white" : "bg-brand-dark/80 text-white"
          }`}
        >
          {STATUS_LABEL[l.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] text-brand-gray">
          {l.kelurahan}, {l.kecamatan}, {l.city}
        </p>
        <h3 className="mt-1 text-[17px] font-extrabold leading-snug text-brand-dark group-hover:text-brand-red">{l.title}</h3>
        <p className="mt-3 text-[20px] font-black text-brand-dark">
          {rp(price.value)}
          {price.suffix && <span className="text-[13px] font-semibold text-brand-gray">{price.suffix}</span>}
        </p>
        {l.category === "siap-berdaya" && (
          <p className="mt-1 text-[13px] font-semibold text-credit">Saldo DP {rp(l.sewaPerBulan * RTO_RATE)}/bulan</p>
        )}
      </div>
    </Link>
  );
}

export default function ListingGrid({ listings }: { listings: Listing[] }) {
  const [tab, setTab] = useState<"semua" | RtoCategory>("semua");
  const [city, setCity] = useState("semua");
  const cities = useMemo(() => Array.from(new Set(listings.map((l) => l.city))), [listings]);
  const shown = listings.filter((l) => (tab === "semua" || l.category === tab) && (city === "semua" || l.city === city));

  const tabs: { id: "semua" | RtoCategory; label: string; hint?: string }[] = [
    { id: "semua", label: "Semua" },
    ...RTO_PATHS.map((p) => ({ id: p.id, label: p.name, hint: p.explainer })),
  ];

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Kategori listing">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-left transition-colors ${
              tab === t.id ? "bg-brand-dark text-white" : "border border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"
            }`}
          >
            <span className="block text-[14px] font-bold">{t.label}</span>
            {t.hint && <span className={`block text-[11px] ${tab === t.id ? "text-white/65" : "text-brand-gray"}`}>{t.hint}</span>}
          </button>
        ))}
        {cities.length > 1 && (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Filter kota"
            className="shrink-0 rounded-full border border-brand-dark/15 bg-white px-4 py-2.5 text-[14px] font-semibold"
          >
            <option value="semua">Semua kota</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {shown.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l) => (
            <ListingCard key={l.slug} l={l} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-12 text-center md:py-16">
          <p className="text-[20px] font-extrabold text-brand-dark">Unit pertama sedang kami siapkan.</p>
          <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-brand-gray">
            Kami hanya menayangkan unit yang sudah kami cek langsung, lengkap dengan foto asli dan dokumennya. Daftar minat
            supaya kamu dikabari begitu unit {tab === "semua" ? "pertama" : RTO_PATHS.find((p) => p.id === tab)?.name} tayang.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#daftar" className="rounded-full bg-brand-red px-6 py-3 text-[14px] font-bold text-white hover:bg-brand-red-dark">
              Daftar minat
            </a>
            <Link
              href="/kemitraan#formulir-rto"
              className="rounded-full border border-brand-dark/20 px-6 py-3 text-[14px] font-bold text-brand-dark hover:border-brand-dark"
            >
              Punya unit? Jadi mitra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "@/i18n/Link";
import { UNIT_FACILITIES } from "@/lib/rto";
import { CLOSED_STATUS, listingKind, listingPlace, listingPrice, listingRto, listingStatusLabel, priceSortValue, type Listing } from "@/data/listings";
import ListingCard, { PhotoPlaceholder } from "./ListingCard";
import SearchPill, { type PillValue } from "./SearchPill";
import { useSaved } from "./useSaved";
import { KINDS, priceMain, rpShort, type KindFilter } from "./format";
import type { MapItem } from "./ListingMap";

// Halaman cari unit: kolom cari + filter (Program RTO, fasilitas, tersimpan, urutan), kartu di kiri dan peta pin
// harga di kanan (desktop). Di HP peta dibuka lewat tombol "Peta". Filter tersimpan di alamat halaman supaya
// hasil cari bisa dibagikan. Semua penyaringan di browser; data unit sudah dimuat server.

const ListingMap = dynamic(() => import("./ListingMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-brand-cream-warm" />,
});

type Sort = "baru" | "murah" | "mahal";
const SORTS: { value: Sort; label: string }[] = [
  { value: "baru", label: "Terbaru" },
  { value: "murah", label: "Harga terendah" },
  { value: "mahal", label: "Harga tertinggi" },
];

/** Teks pin peta: harga ringkas, atau status kalau unit tidak bisa dipesan */
function pinLabel(l: Listing): string {
  if (CLOSED_STATUS.includes(l.status)) return listingStatusLabel(l);
  const p = listingPrice(l);
  if (p.value === null) return listingStatusLabel(l);
  return p.max ? `${rpShort(p.value)}+` : rpShort(p.value);
}

function kindMatch(l: Listing, jenis: KindFilter) {
  if (!jenis) return true;
  if (jenis === "beli") return l.category === "siap-beli";
  if (jenis === "lahan") return l.category === "siap-bangun";
  if (jenis === "sewa") return l.category === "siap-berdaya";
  return l.category === "siap-berdaya" && (l.kind ?? "rumah") === jenis;
}

const chip = (on: boolean) =>
  `shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
    on ? "border-brand-dark bg-brand-dark text-white" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"
  }`;

export default function ListingSearch({ listings }: { listings: Listing[] }) {
  const params = useSearchParams();
  const { saved } = useSaved();
  const cities = useMemo(() => Array.from(new Set(listings.map((l) => l.city))).sort(), [listings]);

  const [pill, setPill] = useState<PillValue>(() => ({
    kota: params.get("kota") ?? "",
    jenis: (KINDS.some((k) => k.value === params.get("jenis")) ? params.get("jenis") : "") as KindFilter,
    maks: Number(params.get("maks")) || 0,
  }));
  const [rto, setRto] = useState(params.get("rto") === "1");
  const [fas, setFas] = useState<string[]>(() => (params.get("fas") ?? "").split(",").filter((f) => (UNIT_FACILITIES as readonly string[]).includes(f)));
  const [onlySaved, setOnlySaved] = useState(params.get("simpan") === "1");
  const [sort, setSort] = useState<Sort>(() => (SORTS.some((s) => s.value === params.get("urut")) ? (params.get("urut") as Sort) : "baru"));
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"daftar" | "peta">("daftar");

  // Simpan filter di alamat halaman (tanpa memuat ulang)
  useEffect(() => {
    const q = new URLSearchParams();
    if (pill.kota) q.set("kota", pill.kota);
    if (pill.jenis) q.set("jenis", pill.jenis);
    if (pill.maks) q.set("maks", String(pill.maks));
    if (rto) q.set("rto", "1");
    if (fas.length) q.set("fas", fas.join(","));
    if (onlySaved) q.set("simpan", "1");
    if (sort !== "baru") q.set("urut", sort);
    const qs = q.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [pill, rto, fas, onlySaved, sort]);

  const results = useMemo(() => {
    const list = listings.filter((l) => {
      if (pill.kota && l.city !== pill.kota) return false;
      if (!kindMatch(l, pill.jenis)) return false;
      if (pill.maks && (l.category !== "siap-berdaya" || l.sewaPerBulan > pill.maks)) return false;
      if (rto && !listingRto(l)) return false;
      if (fas.length && (l.category !== "siap-berdaya" || !fas.every((f) => (l.fasilitas ?? []).includes(f)))) return false;
      if (onlySaved && !saved.includes(l.slug)) return false;
      return true;
    });
    if (sort === "murah") list.sort((a, b) => priceSortValue(a) - priceSortValue(b));
    if (sort === "mahal") list.sort((a, b) => (listingPrice(b).value ?? -1) - (listingPrice(a).value ?? -1));
    // Unit penuh, terjual, dan yang sudah dibangun selalu di belakang
    const closed = (l: Listing) => Number(CLOSED_STATUS.includes(l.status));
    return list.sort((a, b) => closed(a) - closed(b));
  }, [listings, pill, rto, fas, onlySaved, saved, sort]);

  const points = useMemo<MapItem[]>(
    () =>
      results
        .filter((l) => l.approx)
        .map((l) => ({ slug: l.slug, lat: l.approx!.lat, lng: l.approx!.lng, label: pinLabel(l), title: l.title, rto: listingRto(l) && l.status === "tersedia" })),
    [results],
  );
  const noPoint = results.length - points.length;
  const picked = selected ? results.find((l) => l.slug === selected) : undefined;
  const filtered = Boolean(pill.kota || pill.jenis || pill.maks || rto || fas.length || onlySaved);
  const reset = () => {
    setPill({ kota: "", jenis: "", maks: 0 });
    setRto(false);
    setFas([]);
    setOnlySaved(false);
    setSort("baru");
  };

  return (
    <div className="mx-auto max-w-[1680px] px-5 md:px-8">
      {/* Kolom cari dan filter */}
      <div className="sticky top-[68px] z-30 -mx-5 border-b border-brand-dark/[0.07] bg-brand-cream px-5 pb-3 pt-4 md:-mx-8 md:px-8">
        <div className="flex justify-center">
          <SearchPill cities={cities} value={pill} onChange={setPill} compact />
        </div>
        <div className="no-scrollbar relative -mx-5 mt-3 flex items-center gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          <button type="button" onClick={() => setRto(!rto)} aria-pressed={rto} className={chip(rto)}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${rto ? "bg-white" : "bg-brand-red"}`} />
            Program RTO
          </button>
          <button type="button" onClick={() => setOnlySaved(!onlySaved)} aria-pressed={onlySaved} className={chip(onlySaved)}>
            Tersimpan{saved.length ? ` (${saved.length})` : ""}
          </button>
          <span className="h-6 w-px shrink-0 bg-brand-dark/10" aria-hidden />
          {UNIT_FACILITIES.filter((f) => f !== "Kamar mandi bersama").map((f) => {
            const on = fas.includes(f);
            return (
              <button key={f} type="button" aria-pressed={on} onClick={() => setFas(on ? fas.filter((x) => x !== f) : [...fas, f])} className={chip(on)}>
                {f}
              </button>
            );
          })}
          <span className="h-6 w-px shrink-0 bg-brand-dark/10" aria-hidden />
          <label className="shrink-0">
            <span className="sr-only">Urutkan</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="cursor-pointer rounded-full border border-brand-dark/15 bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-dark">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          {filtered && (
            <button type="button" onClick={reset} className="shrink-0 px-2 text-[13px] font-semibold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Hapus filter
            </button>
          )}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        {/* Hasil */}
        <section className={`pb-24 pt-6 lg:pb-16 ${view === "peta" ? "hidden lg:block" : ""}`} aria-live="polite">
          <h1 className="text-[15px] font-bold text-brand-dark">
            {results.length ? `${results.length} unit${pill.kota ? ` di ${pill.kota}` : ""}` : listings.length ? "Belum ada unit yang cocok" : "Belum ada unit tayang"}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-brand-gray">
            Harga sewa per bulan dari pemilik. Untuk peserta RTO, sewa program termasuk biaya program dan sebagian jadi saldo DP.
          </p>

          {results.length ? (
            <div className="mt-6 grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l) => (
                <ListingCard key={l.slug} l={l} active={l.slug === selected} onHover={setHover} sizes="(min-width: 1280px) 18vw, (min-width: 640px) 45vw, 90vw" />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-12 text-center">
              <p className="text-[18px] font-extrabold text-brand-dark">{listings.length ? "Coba longgarkan filternya." : "Unit pertama sedang kami siapkan."}</p>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-brand-gray">
                {listings.length
                  ? "Belum ada unit yang memenuhi semua filter yang kamu pilih."
                  : "Kami hanya menayangkan unit yang sudah kami cek langsung. Buat akun penyewa supaya kamu siap begitu unit pertama tayang."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {listings.length ? (
                  <button type="button" onClick={reset} className="rounded-full bg-brand-dark px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-brand-red">
                    Hapus semua filter
                  </button>
                ) : (
                  <Link href="/portal/daftar?akun=penyewa" className="rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-brand-red-dark">
                    Buat akun penyewa
                  </Link>
                )}
                <Link href="/portal/daftar?akun=mitra" className="rounded-full border border-brand-dark/20 px-5 py-2.5 text-[13.5px] font-bold text-brand-dark hover:border-brand-dark">
                  Punya kos? Daftarkan unit
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Peta */}
        <aside
          className={`${
            view === "peta" ? "fixed inset-x-0 bottom-0 top-[210px] z-20 block" : "hidden"
          } lg:sticky lg:top-[226px] lg:z-0 lg:mt-4 lg:block lg:h-[calc(100vh-246px)] lg:overflow-hidden lg:rounded-2xl`}
        >
          <div className="relative h-full w-full">
            <ListingMap items={points} active={hover} selected={selected} onSelect={setSelected} />
            {(noPoint > 0 || points.length === 0) && (
              <p className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[70%] rounded-xl bg-white/95 px-3 py-2 text-[12px] text-brand-gray shadow">
                {points.length === 0 ? "Titik unit muncul di sini setelah unit tayang." : `${noPoint} unit belum punya titik peta.`} Lokasi di peta adalah area perkiraan.
              </p>
            )}
            {picked && (
              <div className="absolute inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[500] mx-auto max-w-sm overflow-hidden rounded-2xl bg-white lg:bottom-3 shadow-[0_18px_40px_-12px_rgba(20,20,20,0.5)]">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Tutup"
                  className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-brand-dark shadow"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
                <Link href={`/layanan/rto/${picked.slug}`} className="flex gap-3">
                  <div className="relative h-24 w-28 shrink-0 bg-brand-cream-warm">
                    {picked.photos[0] ? <Image src={picked.photos[0].src} alt="" fill sizes="112px" className="object-cover" /> : <PhotoPlaceholder label="" />}
                  </div>
                  <div className="min-w-0 py-2.5 pr-9">
                    <p className="truncate text-[13.5px] font-bold text-brand-dark">
                      {listingKind(picked)} di {picked.kelurahan || picked.kecamatan || picked.city}
                    </p>
                    <p className="truncate text-[12.5px] text-brand-gray">{listingPlace(picked)}</p>
                    <p className="mt-1 text-[13.5px] font-extrabold text-brand-dark">
                      {priceMain(listingPrice(picked))}
                      {listingPrice(picked).suffix && listingPrice(picked).value !== null && (
                        <span className="font-medium text-brand-gray"> {listingPrice(picked).suffix}</span>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Tombol Peta / Daftar di HP */}
      <button
        type="button"
        onClick={() => setView(view === "peta" ? "daftar" : "peta")}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-dark px-5 py-3 text-[14px] font-bold text-white shadow-[0_12px_30px_-8px_rgba(20,20,20,0.6)] lg:hidden"
      >
        {view === "peta" ? "Daftar" : "Peta"}
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          {view === "peta" ? <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /> : <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" />}
        </svg>
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import Link from "@/i18n/Link";
import { localizePath } from "@/i18n/config";
import { useLang } from "@/i18n/LangProvider";
import { CLOSED_STATUS, listingRto, type Listing } from "@/data/listings";
import { RTO_PATHS } from "@/data/rto";
import ListingCard from "./ListingCard";
import SearchPill, { type PillValue } from "./SearchPill";

// Listing di halaman RTO: kolom cari lalu deretan kartu yang bisa digeser per kelompok (Program RTO, per kota,
// rumah dijual, lahan). "Lihat semua" membuka halaman cari dengan filter yang sesuai.

export function ListingRow({ title, sub, href, items }: { title: string; sub?: string; href?: string; items: Listing[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {href ? (
            <Link href={href} className="group inline-flex items-center gap-1.5 text-[19px] font-extrabold tracking-tight text-brand-dark md:text-[21px]">
              {title}
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <h3 className="text-[19px] font-extrabold tracking-tight text-brand-dark md:text-[21px]">{title}</h3>
          )}
          {sub && <p className="mt-0.5 text-[13.5px] text-brand-gray">{sub}</p>}
        </div>
        {items.length > 3 && (
          <div className="hidden shrink-0 gap-2 md:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d < 0 ? "Geser ke kiri" : "Geser ke kanan"}
                className="grid h-8 w-8 place-items-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-colors hover:border-brand-dark"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                  <path d={d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={track} className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0">
        {items.map((l) => (
          <div key={l.slug} className="w-[74%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]">
            <ListingCard l={l} sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 44vw, 74vw" />
          </div>
        ))}
      </div>
    </div>
  );
}

const PATH_ROW: Record<Listing["category"], { title: string; jenis: string }> = {
  "siap-berdaya": { title: "kos dan rumah sewa", jenis: "sewa" },
  "siap-beli": { title: "rumah dijual", jenis: "beli" },
  "siap-bangun": { title: "bangun di lahan sendiri", jenis: "lahan" },
};

export default function ListingRows({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const lang = useLang();
  const cities = useMemo(() => Array.from(new Set(listings.map((l) => l.city))).sort(), [listings]);
  const [pill, setPill] = useState<PillValue>({ kota: "", jenis: "", maks: 0 });

  const rows = useMemo(() => {
    const out: { key: string; title: string; sub?: string; href: string; items: Listing[] }[] = [];
    const rto = listings.filter((l) => listingRto(l) && l.status === "tersedia");
    if (rto.length) {
      out.push({
        key: "rto",
        title: "Siap ikut program RTO",
        sub: "Pemiliknya bersedia unit ini jadi jalan menuju rumah sendiri.",
        href: "/layanan/rto/cari?rto=1",
        items: rto,
      });
    }
    // Satu deretan per jalur RTO; unit yang masih bisa dipesan di depan
    const open = (l: Listing) => Number(CLOSED_STATUS.includes(l.status));
    for (const p of RTO_PATHS) {
      const items = listings.filter((l) => l.category === p.id).sort((a, b) => open(a) - open(b));
      if (!items.length) continue;
      const row = PATH_ROW[p.id];
      out.push({ key: p.id, title: `${p.name}: ${row.title}`, sub: p.explainer + ".", href: `/layanan/rto/cari?jenis=${row.jenis}`, items });
    }
    return out;
  }, [listings]);

  const submit = () => {
    const q = new URLSearchParams();
    if (pill.kota) q.set("kota", pill.kota);
    if (pill.jenis) q.set("jenis", pill.jenis);
    if (pill.maks) q.set("maks", String(pill.maks));
    const qs = q.toString();
    router.push(localizePath(lang, `/layanan/rto/cari${qs ? `?${qs}` : ""}`));
  };

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-12 text-center md:py-16">
        <p className="text-[20px] font-extrabold text-brand-dark">Unit pertama sedang kami siapkan.</p>
        <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-brand-gray">
          Kami hanya menayangkan unit yang sudah kami cek langsung, lengkap dengan foto asli. Buat akun penyewa supaya kamu siap begitu unit pertama tayang.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/portal/daftar?akun=penyewa" className="rounded-full bg-brand-red px-6 py-3 text-[14px] font-bold text-white hover:bg-brand-red-dark">
            Buat akun penyewa
          </Link>
          <Link
            href="/portal/daftar?akun=mitra"
            className="rounded-full border border-brand-dark/20 px-6 py-3 text-[14px] font-bold text-brand-dark hover:border-brand-dark"
          >
            Punya kos? Daftarkan unit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <SearchPill cities={cities} value={pill} onChange={setPill} onSubmit={submit} />
        <Link href="/layanan/rto/cari" className="text-[13.5px] font-semibold text-brand-dark underline underline-offset-4 hover:text-brand-red">
          Lihat semua {listings.length} unit di peta
        </Link>
      </div>
      <div className="mt-10 space-y-12">
        {rows.map((r) => (
          <ListingRow key={r.key} title={r.title} sub={r.sub} href={r.href} items={r.items} />
        ))}
      </div>
    </div>
  );
}

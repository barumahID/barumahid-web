"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/i18n/Link";
import LeadForm from "@/components/forms/LeadForm";
import {
  PATH_STEPS,
  RTO_CONVERT_OPTIONS,
  RTO_CONVERT_YEARS,
  RTO_PATHS,
  RTO_STEPS,
  RTO_UNLOCK_MONTHS,
  maxHomePrice,
  saldoAfter,
  type RtoCategory,
} from "@/data/rto";
import { CLOSED_STATUS, listingKind, listingPath, listingPlace, listingPrice, listingStatusLabel, type Listing } from "@/data/listings";
import { GFORMS } from "@/data/google-forms";
import { SITE, waLink } from "@/data/site";
import ListingCard, { PhotoPlaceholder } from "./ListingCard";
import UnitSimulator from "./UnitSimulator";
import { dpEstimate } from "./estimate";
import { priceMain, rpShort } from "./format";

// Platform listing di halaman RTO (arahan user Okt 2026): unit dikelompokkan per jalur (tab Siap Berdaya, Siap Bangun,
// Siap Beli). Model bisnis: Siap Berdaya dua sisi seperti marketplace (kos dari penyedia mitra untuk tempat tinggal,
// rumah tujuan dari developer mitra untuk saldo DP); Siap Bangun mengumpulkan saldo DP sampai 25% RAB lalu dibangun;
// Siap Beli listing jual beli di luar RTO (barumahID mempertemukan pembeli dan penjual). Model konversi: MoU rumah tujuan di
// awal, saldo dikonversi jadi DP setelah 2 sampai 4 tahun (garis waktu di tab Siap Berdaya dan Siap Bangun). Bagian yang
// belum ada datanya diisi hitungan, bukan contoh: rumah tujuan kosong -> tabel harga rumah yang terjangkau dari sewa kos mitra. Tiap tab menjelaskan jalurnya dan langkahnya; tab Siap Berdaya juga memuat level perjalanan dan Skor
// Siap Punya Rumah (dikirim dari server lewat `berdayaExtra`). Klik unit membuka panel: estimasi DP, simulasi sesuai
// jalur, dan formulir minat (form situs customer-rto, unit dan kota terisi otomatis).
// Anchor lama tetap jalan: #jalur, #siap-berdaya / #siap-bangun / #siap-beli (pilih tab), #level (buka level).

const PATH_IDS = RTO_PATHS.map((p) => p.id);
const open = (l: Listing) => Number(CLOSED_STATUS.includes(l.status));
/** Di tab Siap Berdaya: kos dan rumah sewa dulu, baru rumah tujuan developer */
const side = (l: Listing) => Number(l.category === "rumah-tujuan");

const SELLER_WA =
  "Halo barumahID, saya ingin mengiklankan properti untuk dijual.\nLokasi (kelurahan, kecamatan, kota): \nHarga: \nLuas tanah dan bangunan: \nSertifikat: ";
const BUYER_WA = "Halo barumahID, saya mencari rumah untuk dibeli.\nKota: \nBudget: \nJumlah kamar: ";
const LAHAN_WA =
  "Halo barumahID, saya tertarik jalur Siap Bangun.\nLokasi lahan (kelurahan, kecamatan, kota): \nLuas lahan: \nRencana bangunan: \nSekarang tinggal di: kos / kontrakan";

const { min: CONV_MIN, max: CONV_MAX } = RTO_CONVERT_YEARS;
const span = (m: number) => (m / 12).toLocaleString("id-ID", { maximumFractionDigits: 1 });
const linkCls = "font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red";

/** Garis waktu konversi: 6 bulan sewa biasa, 2-4 tahun RTO (MoU di awal), lalu konversi */
function ConversionTimeline({ lead, end, endBody }: { lead: string; end: string; endBody: string }) {
  const segs = [
    { k: `Bulan 1-${RTO_UNLOCK_MONTHS}`, t: "Sewa biasa", b: "Bayar tepat waktu dan penuhi syarat RTO.", bar: "bg-brand-dark/15" },
    { k: `${CONV_MIN}-${CONV_MAX} tahun`, t: "RTO berjalan", b: "MoU di awal. 25% sewa jadi saldo DP tiap bulan.", bar: "bg-brand-red" },
    { k: "Konversi", t: end, b: endBody, bar: "bg-brand-dark" },
  ];
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-4 sm:p-5">
      <p className="text-[14.5px] font-extrabold text-brand-dark">
        {lead}: sekitar {span(RTO_UNLOCK_MONTHS + CONV_MIN * 12)} sampai {span(RTO_UNLOCK_MONTHS + CONV_MAX * 12)} tahun
      </p>
      <ol className="mt-4 grid gap-4 sm:grid-cols-[1fr_2.2fr_1.3fr] sm:gap-2">
        {segs.map((s) => (
          <li key={s.k}>
            <span aria-hidden className={`block h-2 rounded-full ${s.bar}`} />
            <p className="mt-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand-red">{s.k}</p>
            <p className="text-[14px] font-extrabold text-brand-dark">{s.t}</p>
            <p className="text-[12.5px] leading-snug text-brand-gray">{s.b}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Rumah tujuan belum ada: harga rumah yang terjangkau dari sewa kos mitra di listing (hasil hitungan, bukan contoh) */
function TujuanGuide({ kos }: { kos: Listing[] }) {
  const fromListing = kos.flatMap((l) => (l.category === "siap-berdaya" ? [{ id: l.slug, name: `${listingKind(l)} di ${l.kelurahan || l.kecamatan || l.city}`, rent: l.sewaPerBulan }] : []));
  const rows = fromListing.length ? fromListing : [1_000_000, 1_500_000, 2_500_000].map((rent) => ({ id: String(rent), name: "Sewa kos", rent }));
  return (
    <div>
      <p className="text-[16px] font-extrabold text-brand-dark">Rumah tujuan DP dari developer mitra</p>
      <p className="mt-0.5 text-[13.5px] leading-snug text-brand-gray">
        Rumah developer mitra sedang kami kurasi. Sambil menunggu, ini harga rumah yang DP 10%-nya tertutup saldo dari sewa di kos mitra.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
        <div className="hidden grid-cols-[1.3fr_repeat(3,1fr)] gap-2 border-b border-brand-dark/10 bg-brand-cream px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand-gray sm:grid">
          <span>Sewa per bulan</span>
          {RTO_CONVERT_OPTIONS.map((y) => (
            <span key={y} className="text-right">
              Konversi {y} th
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid gap-2 border-b border-brand-dark/10 px-4 py-3 last:border-0 sm:grid-cols-[1.3fr_repeat(3,1fr)] sm:items-center">
            <span>
              <span className="block text-[13.5px] font-bold text-brand-dark">{r.name}</span>
              <span className="text-[12.5px] text-brand-gray">{rpShort(r.rent)}/bulan</span>
            </span>
            <span className="grid grid-cols-3 gap-2 sm:contents">
              {RTO_CONVERT_OPTIONS.map((y) => {
                const s = saldoAfter(r.rent, y);
                return (
                  <span key={y} className="sm:text-right">
                    <span className="block text-[11px] text-brand-mute sm:hidden">{y} tahun</span>
                    <span className="block text-[13.5px] font-extrabold text-brand-dark sm:text-[14px]">s.d. {rpShort(maxHomePrice(s, 10))}</span>
                    <span className="block text-[11.5px] text-credit">saldo {rpShort(s)}</span>
                  </span>
                );
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px]">
        <a href="#simulasi" className={linkCls}>
          Hitung dengan sewamu sendiri
        </a>
        <a href={GFORMS.F16} target="_blank" rel="noopener noreferrer" className={linkCls}>
          Developer? Daftarkan unitmu (F16)
        </a>
      </div>
    </div>
  );
}

function CardGroup({
  title,
  sub,
  items,
  selected,
  onSelect,
  empty,
  filler,
}: {
  title: string;
  sub: string;
  items: Listing[];
  selected?: string;
  onSelect: (slug: string) => void;
  empty: React.ReactNode;
  /** Isi slot kosong di grid dua kolom kalau jumlah kartu ganjil */
  filler?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[16px] font-extrabold text-brand-dark">{title}</p>
      <p className="mt-0.5 text-[13.5px] leading-snug text-brand-gray">{sub}</p>
      {items.length ? (
        <div className="mt-4 grid gap-x-5 gap-y-8 sm:grid-cols-2">
          {items.map((l) => (
            <ListingCard key={l.slug} l={l} active={l.slug === selected} onSelect={() => onSelect(l.slug)} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" />
          ))}
          {filler && items.length % 2 === 1 && filler}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-8 text-center">{empty}</div>
      )}
    </div>
  );
}

/** Dua sisi Siap Berdaya: penyedia kos, penyewa, developer mitra */
function MarketplaceFlow() {
  const sides = [
    { who: "Penyedia kos mitra", what: "Tempat tinggalmu selama menabung DP" },
    { who: "Kamu, penyewa", what: "Sewa tepat waktu, buka RTO, 25% sewa jadi saldo DP" },
    { who: "Developer mitra", what: `Rumah tujuan lewat MoU di awal, saldo jadi DP setelah ${CONV_MIN}-${CONV_MAX} tahun` },
  ];
  return (
    <ol className="grid gap-2 sm:grid-cols-3" aria-label="Alur Siap Berdaya">
      {sides.map((s, i) => (
        <li key={s.who} className={`relative rounded-2xl p-4 ${i === 1 ? "bg-brand-dark text-white" : "border border-brand-dark/10 bg-white"}`}>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-red">0{i + 1}</p>
          <p className={`mt-1 text-[15px] font-extrabold ${i === 1 ? "" : "text-brand-dark"}`}>{s.who}</p>
          <p className={`mt-0.5 text-[13px] leading-snug ${i === 1 ? "text-white/70" : "text-brand-gray"}`}>{s.what}</p>
          {i < 2 && (
            <span aria-hidden className="absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-brand-red text-[11px] font-black text-white sm:grid">
              ›
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Judul form di panel menyesuaikan status unit */
function formTitle(l: Listing): string {
  if (l.status === "terisi") return "Antre untuk unit ini";
  if (l.status === "terjual") return "Cari rumah serupa";
  if (l.status === "selesai") return "Konsultasi Siap Bangun";
  if (l.status === "segera") return "Kabari saya saat dibuka";
  if (l.category === "rumah-tujuan") return "Ajukan minat rumah tujuan ini";
  if (l.category === "siap-beli") return "Ajukan minat beli";
  return l.category === "siap-berdaya" ? "Ajukan minat dan jadwalkan survei" : "Ajukan minat untuk unit ini";
}

export default function RtoPlatform({ listings, berdayaExtra }: { listings: Listing[]; berdayaExtra?: React.ReactNode }) {
  const byPath = useMemo(() => {
    const m = new Map<RtoCategory, Listing[]>();
    for (const id of PATH_IDS) m.set(id, listings.filter((l) => listingPath(l) === id).sort((a, b) => side(a) - side(b) || open(a) - open(b)));
    return m;
  }, [listings]);

  const [tab, setTab] = useState<RtoCategory>("siap-berdaya");
  const [selected, setSelected] = useState<string | null>(() => byPath.get("siap-berdaya")?.[0]?.slug ?? null);
  const [levelOpen, setLevelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const choosePath = (id: RtoCategory) => {
    setTab(id);
    setSelected(byPath.get(id)?.[0]?.slug ?? null);
  };

  // Anchor dari halaman lain: #siap-bangun memilih tab, #level membuka level perjalanan
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.slice(1);
      if ((PATH_IDS as string[]).includes(hash)) {
        choosePath(hash as RtoCategory);
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (hash === "level") {
        choosePath("siap-berdaya");
        setLevelOpen(true);
        window.setTimeout(() => document.getElementById("level")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    };
    const id = window.requestAnimationFrame(apply);
    window.addEventListener("hashchange", apply);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("hashchange", apply);
    };
    // choosePath hanya bergantung pada byPath yang stabil selama halaman terbuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (slug: string) => {
    setSelected(slug);
    const el = panelRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight - 120) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const path = RTO_PATHS.find((p) => p.id === tab)!;
  const items = byPath.get(tab) ?? [];
  const steps = tab === "siap-berdaya" ? RTO_STEPS : PATH_STEPS[tab];
  const unit = items.find((l) => l.slug === selected) ?? items[0];
  const estimate = unit ? dpEstimate(unit) : null;
  const price = unit ? listingPrice(unit) : null;

  return (
    <div ref={rootRef} id="jalur" className="scroll-mt-24">
      {/* Tab jalur */}
      <div role="tablist" aria-label="Jalur kepemilikan" className="grid grid-cols-3 gap-2">
        {RTO_PATHS.map((p, i) => {
          const on = p.id === tab;
          const n = byPath.get(p.id)?.length ?? 0;
          return (
            <button
              key={p.id}
              id={p.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="jalur-panel"
              onClick={() => choosePath(p.id)}
              className={`scroll-mt-28 rounded-2xl p-3 text-left transition-colors sm:p-4 md:p-5 ${
                on ? "bg-brand-dark text-white" : "border border-brand-dark/10 bg-white text-brand-dark hover:border-brand-dark/40"
              }`}
            >
              <span className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-red sm:text-[11.5px]">
                  0{i + 1} · {n} unit
                </span>
                <span className={`hidden rounded-full px-2.5 py-0.5 text-[11px] font-bold sm:inline ${on ? "bg-white/15 text-white" : "bg-brand-cream text-brand-gray"}`}>
                  {p.status}
                </span>
              </span>
              <span className="mt-1.5 block text-[15px] font-extrabold leading-tight sm:text-[20px] md:text-[22px]">{p.name}</span>
              <span className={`mt-0.5 hidden text-[13.5px] sm:block ${on ? "text-white/70" : "text-brand-gray"}`}>{p.explainer}</span>
            </button>
          );
        })}
      </div>

      <div id="jalur-panel" role="tabpanel" aria-label={path.name} className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Penjelasan jalur dan langkahnya */}
        <aside className="order-2 lg:order-1 lg:col-span-4">
          <div className="rounded-3xl bg-white p-6 card-shadow">
            <p className="text-[15px] font-bold text-brand-dark">{path.forWho}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{path.how}</p>
            <ol className="mt-5 space-y-3 border-t border-brand-dark/10 pt-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-red text-[11.5px] font-extrabold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-[14px] font-bold text-brand-dark">{s.title}</span>
                    <span className="block text-[13px] leading-snug text-brand-gray">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            {tab === "siap-berdaya" && berdayaExtra && (
              <button
                type="button"
                onClick={() => setLevelOpen(!levelOpen)}
                aria-expanded={levelOpen}
                aria-controls="level"
                className="mt-5 w-full rounded-full border border-brand-dark/15 px-4 py-2.5 text-[13.5px] font-bold text-brand-dark transition-colors hover:border-brand-dark"
              >
                {levelOpen ? "Tutup level perjalanan" : "Lihat level perjalanan dan skor"}
              </button>
            )}
            {tab === "siap-bangun" && (
              <Link href="/layanan/contech" className="mt-5 inline-block text-[13.5px] font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
                Lihat Jasa Konstruksi barumahID
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 px-1 text-[13px]">
            <Link href="/layanan/rto/cari" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Lihat semua unit di peta
            </Link>
            <Link href="/portal/daftar?akun=mitra" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Punya kos? Daftarkan unit
            </Link>
          </div>
        </aside>

        {/* Kartu unit jalur ini */}
        <div className="order-1 space-y-10 lg:order-2 lg:col-span-8">
          {tab === "siap-berdaya" ? (
            <>
              <MarketplaceFlow />
              <ConversionTimeline lead="Dari ngekos sampai DP" end="Saldo jadi DP" endBody="Untuk rumah tujuan di MoU, lalu PPJB dan KPR." />
              <CardGroup
                title="Tempat tinggal: kos dan rumah sewa mitra"
                sub="Sewa tepat waktu di sini yang membuka RTO. Saldo DP-mu tidak dipakai untuk unit ini."
                items={items.filter((l) => l.category === "siap-berdaya")}
                selected={unit?.slug}
                onSelect={select}
                empty={<p className="text-[14px] text-brand-gray">Kos mitra pertama sedang kami siapkan.</p>}
              />
              {items.some((l) => l.category === "rumah-tujuan") ? (
                <CardGroup
                  title="Rumah tujuan DP dari developer mitra"
                  sub="Pilih satu lewat MoU di awal. Saldo DP dari sewa dikonversi jadi uang muka rumah itu."
                  items={items.filter((l) => l.category === "rumah-tujuan")}
                  selected={unit?.slug}
                  onSelect={select}
                  empty={null}
                />
              ) : (
                <TujuanGuide kos={items} />
              )}
            </>
          ) : tab === "siap-bangun" ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-dark p-5 text-white">
                <div className="max-w-md">
                  <p className="text-[16px] font-extrabold">Punya lahan atau aset?</p>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-white/70">Coba susun denah dan estimasi biayanya gratis di miniCAD, atau ceritakan lahanmu ke tim.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/layanan/contech#konsultasi" className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-dark transition-colors hover:bg-brand-cream">
                    Coba miniCAD
                  </Link>
                  <a
                    href={waLink(LAHAN_WA)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/30 px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:border-white"
                  >
                    Ceritakan lahanmu
                  </a>
                </div>
              </div>
              <ConversionTimeline lead="Dari ngekos sampai mulai bangun" end="Mulai bangun" endBody="Saldo ditambah tabunganmu sampai 25% RAB." />
              <CardGroup
                title="Proyek Siap Bangun"
                sub="Rencana dan rumah yang dibangun di lahan milik pemiliknya."
                items={items}
                selected={unit?.slug}
                onSelect={select}
                empty={<p className="text-[14px] text-brand-gray">Proyek Siap Bangun pertama sedang kami siapkan.</p>}
              />
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-dark p-5 text-white">
                <div className="max-w-md">
                  <p className="text-[16px] font-extrabold">Punya properti untuk dijual?</p>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-white/70">Iklankan lewat barumahID. Kami cek, tayangkan, lalu pertemukan dengan pembeli.</p>
                </div>
                <a
                  href={waLink(SELLER_WA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-dark transition-colors hover:bg-brand-cream"
                >
                  Pasang iklan properti
                </a>
              </div>
              <CardGroup
                title="Properti dijual"
                sub="Listing jual beli dari pemilik dan developer. barumahID mempertemukan pembeli dan penjual."
                items={items}
                selected={unit?.slug}
                onSelect={select}
                empty={<p className="text-[14px] text-brand-gray">Properti pertama sedang kami siapkan.</p>}
                filler={
                  <div className="flex flex-col justify-center rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white p-6">
                    <p className="text-[16px] font-extrabold text-brand-dark">Belum ketemu yang pas?</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-gray">
                      Ceritakan rumah yang kamu cari: kota, budget, dan jumlah kamar. Kami kabari begitu ada listing yang cocok.
                    </p>
                    <a
                      href={waLink(BUYER_WA)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 self-start rounded-full bg-brand-dark px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red"
                    >
                      Kabari saya
                    </a>
                  </div>
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Level perjalanan dan skor (khusus Siap Berdaya, dibuka dari tombol) */}
      {tab === "siap-berdaya" && berdayaExtra && (
        <div id="level" className={`scroll-mt-24 ${levelOpen ? "mt-6" : "hidden"}`}>
          {berdayaExtra}
        </div>
      )}

      {/* Panel unit terpilih: estimasi DP, simulasi, formulir */}
      <div ref={panelRef} className="mt-10 scroll-mt-24 rounded-3xl bg-white p-5 card-shadow md:p-8">
        {unit ? (
          <div className="flex flex-wrap items-center gap-4 border-b border-brand-dark/10 pb-5">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-cream-warm">
              {unit.photos[0] ? <Image src={unit.photos[0].src} alt="" fill sizes="80px" className="object-cover" /> : <PhotoPlaceholder label="" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-red">
                {unit.category === "rumah-tujuan" ? "Rumah tujuan RTO" : path.name} · {listingStatusLabel(unit)}
              </p>
              <p className="truncate text-[17px] font-extrabold text-brand-dark md:text-[19px]">{unit.title}</p>
              <p className="truncate text-[13.5px] text-brand-gray">{listingPlace(unit)}</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-black text-brand-dark">
                {price && priceMain(price)}
                {price?.suffix && price.value !== null && <span className="text-[13px] font-semibold text-brand-gray"> {price.suffix}</span>}
              </p>
              {estimate && (
                <p className="text-[13px] text-credit">
                  {estimate.label}: <span className="font-bold">{estimate.value}</span>
                </p>
              )}
              <Link href={`/layanan/rto/${unit.slug}`} className="text-[12.5px] font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
                Lihat detail unit
              </Link>
            </div>
          </div>
        ) : (
          <p className="border-b border-brand-dark/10 pb-5 text-[15px] font-bold text-brand-dark">Simulasi dan formulir minat {path.name}</p>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[15px] font-extrabold text-brand-dark">
              {unit?.category === "rumah-tujuan"
                ? "Simulasi DP untuk rumah ini"
                : tab === "siap-berdaya"
                  ? "Simulasi RTO dari sewa di unit ini"
                  : tab === "siap-bangun"
                    ? "Simulasi modal bangun dari sewa"
                    : "Simulasi DP dan KPR"}
            </p>
            {unit ? (
              <UnitSimulator key={unit.slug} l={unit} />
            ) : (
              <p className="text-[14px] text-brand-gray">Simulasi muncul begitu ada unit di jalur ini. Sementara itu, pakai simulasi DP di bagian bawah.</p>
            )}
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-brand-dark">{unit ? formTitle(unit) : `Daftar minat ${path.name}`}</p>
            <p className="mb-4 mt-1 text-[13px] text-brand-gray">Tim kami menghubungimu lewat WhatsApp. Data unit sudah terisi otomatis.</p>
            <LeadForm
              key={unit?.slug ?? tab}
              role="customer-rto"
              compact
              initial={
                unit
                  ? {
                      "Unit Diminati": `${unit.title} (${unit.category === "rumah-tujuan" ? "Rumah tujuan RTO" : path.name}) ${SITE.url.replace(/^https?:\/\//, "")}/layanan/rto/${unit.slug}`.slice(0, 200),
                      "Kota Tujuan": unit.city,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/i18n/Link";
import LeadForm from "@/components/forms/LeadForm";
import {
  PATH_STEPS,
  PRICE_EXAMPLE_DEAL,
  READINESS_ASPECTS,
  READINESS_BANDS,
  RTO_CONVERT_OPTIONS,
  RTO_CONVERT_YEARS,
  RTO_PATHS,
  RTO_STEPS,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
  dpPerMonth,
  maxHomePrice,
  programRent,
  regularRent,
  saldoAfter,
  type RtoCategory,
} from "@/data/rto";
import { CLOSED_STATUS, listingKind, listingPath, listingPlace, listingPrice, listingStatusLabel, type Listing } from "@/data/listings";
import { GFORMS } from "@/data/google-forms";
import { SITE, waLink } from "@/data/site";
import ListingCard, { PhotoPlaceholder } from "./ListingCard";
import UnitSimulator from "./UnitSimulator";
import { dpEstimate } from "./estimate";
import { priceMain, rp, rpShort } from "./format";

// Platform listing di halaman RTO. Tiga tab jalur (Rumah Berdaya, Rumah Bangun, Rumah Beli; id lama siap-* tetap dipakai
// untuk anchor dan database). Arahan user Okt 2026: tampilan ringkas dan proporsional, kalimat padat.
// - Tiap tab: kartu pengantar (untuk siapa, cara kerja, 4 langkah dalam grid), lalu deretan kartu unit 3 kolom. Slot kosong
//   di akhir grid diisi kartu ajakan (daftarkan kos, developer, lahan, jual/cari rumah), jadi tidak ada area kosong.
// - Rumah Berdaya: Skor Siap Punya Rumah (5 aspek, syarat buka RTO) dan contoh sewa program di samping garis waktu;
//   rumah tujuan dari developer mitra, atau tabel harga rumah yang terjangkau kalau belum ada (hasil hitungan, bukan contoh).
// - Pembagian sewa (pemilik, layanan barumahID) tidak ditampilkan publik; yang ditampilkan hanya yang dibayar penyewa.
// Klik unit membuka panel: estimasi DP, simulasi sesuai jalur, dan formulir minat. Anchor: #jalur, #siap-berdaya /
// #siap-bangun / #siap-beli (pilih tab), #level (buka level perjalanan).

const PATH_IDS = RTO_PATHS.map((p) => p.id);
const open = (l: Listing) => Number(CLOSED_STATUS.includes(l.status));
/** Di tab Rumah Berdaya: kos dan rumah sewa dulu, baru rumah tujuan developer */
const side = (l: Listing) => Number(l.category === "rumah-tujuan");

const SELLER_WA =
  "Halo barumahID, saya ingin mengiklankan properti untuk dijual.\nLokasi (kelurahan, kecamatan, kota): \nHarga: \nLuas tanah dan bangunan: \nSertifikat: ";
const BUYER_WA = "Halo barumahID, saya mencari rumah untuk dibeli.\nKota: \nBudget: \nJumlah kamar: ";
const LAHAN_WA =
  "Halo barumahID, saya tertarik jalur Rumah Bangun.\nLokasi lahan (kelurahan, kecamatan, kota): \nLuas lahan: \nRencana bangunan: \nSekarang tinggal di: kos / kontrakan";

const { min: CONV_MIN, max: CONV_MAX } = RTO_CONVERT_YEARS;
const span = (m: number) => (m / 12).toLocaleString("id-ID", { maximumFractionDigits: 1 });
const linkCls = "font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red";
const box = "rounded-2xl border border-brand-dark/10 bg-white p-4 sm:p-5";
const maxAspect = Math.max(...READINESS_ASPECTS.map((a) => a.max));
const EXAMPLE_RENT = regularRent(PRICE_EXAMPLE_DEAL);

interface Action {
  label: string;
  href: string;
  external?: boolean;
  primary?: boolean;
}

function ActionLink({ a }: { a: Action }) {
  const cls = `inline-flex items-center rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
    a.primary ? "bg-brand-dark text-white hover:bg-brand-red" : "border border-brand-dark/15 text-brand-dark hover:border-brand-dark"
  }`;
  if (a.external)
    return (
      <a href={a.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {a.label}
      </a>
    );
  return (
    <Link href={a.href} className={cls}>
      {a.label}
    </Link>
  );
}

/** Kartu pengantar jalur: untuk siapa dan cara kerja di kiri, 4 langkah dalam grid di kanan */
function Intro({ tab, extra }: { tab: RtoCategory; extra?: React.ReactNode }) {
  const path = RTO_PATHS.find((p) => p.id === tab)!;
  const steps = tab === "siap-berdaya" ? RTO_STEPS : PATH_STEPS[tab];
  return (
    <div className="grid gap-5 rounded-3xl bg-white p-5 card-shadow md:p-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <p className="text-[16px] font-extrabold leading-snug text-brand-dark">{path.forWho}</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-gray">{path.how}</p>
        {extra}
      </div>
      <ol className="grid gap-x-5 gap-y-3.5 sm:grid-cols-2 lg:col-span-7">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-red text-[11.5px] font-extrabold text-white">{i + 1}</span>
            <span>
              <span className="block text-[14px] font-bold leading-snug text-brand-dark">{s.title}</span>
              <span className="block text-[12.5px] leading-snug text-brand-gray">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Skor Siap Punya Rumah: lima aspek dan syarat membuka RTO (tab Rumah Berdaya) */
function ScoreCard({ levelsOpen, onLevels, hasLevels }: { levelsOpen: boolean; onLevels: () => void; hasLevels: boolean }) {
  return (
    <div className={`${box} h-full`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[14.5px] font-extrabold text-brand-dark">Skor Siap Punya Rumah</p>
        <p className="text-[12px] font-bold text-brand-red">Buka RTO: minimal {RTO_UNLOCK_SCORE}/100</p>
      </div>
      <p className="mt-0.5 text-[12.5px] leading-snug text-brand-gray">Diisi lewat asesmen di dashboard, dicek tim. Skor menentukan jalur, bukan untuk menolakmu.</p>
      <ul className="mt-3 space-y-1.5">
        {READINESS_ASPECTS.map((a) => (
          <li key={a.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 text-[12.5px]">
            <span className="font-semibold text-brand-dark">{a.name}</span>
            <span className="text-brand-gray">maks {a.max}</span>
            <span className="col-span-2 mt-0.5 h-1.5 rounded-full bg-brand-cream" aria-hidden="true">
              <span className="block h-1.5 rounded-full bg-brand-red" style={{ width: `${(a.max / maxAspect) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11.5px] leading-snug">
        {READINESS_BANDS.map((b, i) => (
          <p key={b.range} className={`rounded-lg px-2 py-1.5 ${i === 1 ? "bg-brand-red text-white" : "bg-brand-cream text-brand-dark"}`}>
            <span className="block font-extrabold">{b.range}</span>
            {b.title}
          </p>
        ))}
      </div>
      {hasLevels && (
        <button type="button" onClick={onLevels} aria-expanded={levelsOpen} aria-controls="level" className={`mt-3 text-[13px] ${linkCls}`}>
          {levelsOpen ? "Tutup level perjalanan" : "Lihat level perjalanan"}
        </button>
      )}
    </div>
  );
}

/** Garis waktu konversi: 6 bulan sewa biasa, 2-4 tahun RTO (harga terkunci di MoU), lalu konversi */
function ConversionTimeline({ lead, end, endBody }: { lead: string; end: string; endBody: string }) {
  const segs = [
    { k: `Bulan 1-${RTO_UNLOCK_MONTHS}`, t: "Sewa biasa", b: "Bayar tepat waktu, isi asesmen.", bar: "bg-brand-dark/15" },
    { k: `${CONV_MIN}-${CONV_MAX} tahun`, t: "RTO berjalan", b: "Harga rumah dikunci di MoU. 25% sewa program jadi saldo DP.", bar: "bg-brand-red" },
    { k: "Konversi", t: end, b: endBody, bar: "bg-brand-dark" },
  ];
  return (
    <div className={box}>
      <p className="text-[14.5px] font-extrabold text-brand-dark">
        {lead}: {span(RTO_UNLOCK_MONTHS + CONV_MIN * 12)}-{span(RTO_UNLOCK_MONTHS + CONV_MAX * 12)} tahun
      </p>
      <ol className="mt-3 grid gap-3 sm:grid-cols-[1fr_2.2fr_1.3fr] sm:gap-2">
        {segs.map((s) => (
          <li key={s.k}>
            <span aria-hidden className={`block h-2 rounded-full ${s.bar}`} />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-red">{s.k}</p>
            <p className="text-[13.5px] font-extrabold text-brand-dark">{s.t}</p>
            <p className="text-[12px] leading-snug text-brand-gray">{s.b}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Contoh yang dibayar penyewa: sewa biasa, sewa program, dan bagian yang jadi saldo DP */
function ProgramExample() {
  const cells = [
    { k: "Sewa biasa", v: rp(EXAMPLE_RENT), s: `bulan 1-${RTO_UNLOCK_MONTHS}` },
    { k: "Sewa program", v: rp(programRent(EXAMPLE_RENT)), s: "setelah RTO terbuka" },
    { k: "Jadi saldo DP", v: rp(dpPerMonth(EXAMPLE_RENT)), s: "per bulan, atas namamu", tone: true },
  ];
  return (
    <div className={box}>
      <p className="text-[14.5px] font-extrabold text-brand-dark">Contoh sewa program</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {cells.map((c) => (
          <div key={c.k} className={`rounded-xl px-3 py-2.5 ${c.tone ? "bg-brand-dark text-white" : "bg-brand-cream"}`}>
            <p className={`text-[11.5px] ${c.tone ? "text-white/60" : "text-brand-gray"}`}>{c.k}</p>
            <p className={`text-[14.5px] font-black leading-tight sm:text-[16px] ${c.tone ? "text-brand-red" : "text-brand-dark"}`}>{c.v}</p>
            <p className={`text-[11px] leading-snug ${c.tone ? "text-white/50" : "text-brand-mute"}`}>{c.s}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-snug text-brand-gray">Selisih sewa program dan sewa biasa adalah setoran DP. Tidak ada biaya tambahan lain.</p>
    </div>
  );
}

/** Rumah tujuan belum ada: harga rumah yang terjangkau dari sewa kos mitra di listing (hasil hitungan, bukan contoh) */
function TujuanGuide({ kos }: { kos: Listing[] }) {
  const fromListing = kos.flatMap((l) => (l.category === "siap-berdaya" ? [{ id: l.slug, name: `${listingKind(l)} di ${l.kelurahan || l.kecamatan || l.city}`, rent: l.sewaPerBulan }] : []));
  const rows = fromListing.length ? fromListing : [1_000_000, 1_500_000, 2_500_000].map((rent) => ({ id: String(rent), name: "Sewa kos", rent }));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <p className="text-[16px] font-extrabold text-brand-dark">Rumah tujuan dari developer mitra</p>
          <p className="mt-0.5 text-[13px] leading-snug text-brand-gray">Sedang dikurasi. Sambil menunggu: harga rumah yang DP 10%-nya tertutup saldo dari sewa di kos mitra.</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <a href="#simulasi" className={linkCls}>
            Hitung dengan sewamu
          </a>
          <Link href="/portal/daftar?akun=mitra" className={linkCls}>
            Developer? Daftar di sini
          </Link>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
        <div className="hidden grid-cols-[1.3fr_repeat(3,1fr)] gap-2 border-b border-brand-dark/10 bg-brand-cream px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-gray sm:grid">
          <span>Sewa biasa per bulan</span>
          {RTO_CONVERT_OPTIONS.map((y) => (
            <span key={y} className="text-right">
              Konversi {y} th
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid gap-2 border-b border-brand-dark/10 px-4 py-2.5 last:border-0 sm:grid-cols-[1.3fr_repeat(3,1fr)] sm:items-center">
            <span>
              <span className="block text-[13.5px] font-bold text-brand-dark">{r.name}</span>
              <span className="text-[12px] text-brand-gray">{rpShort(r.rent)}/bulan</span>
            </span>
            <span className="grid grid-cols-3 gap-2 sm:contents">
              {RTO_CONVERT_OPTIONS.map((y) => {
                const s = saldoAfter(r.rent, y);
                return (
                  <span key={y} className="sm:text-right">
                    <span className="block text-[11px] text-brand-mute sm:hidden">{y} tahun</span>
                    <span className="block text-[13.5px] font-extrabold text-brand-dark">s.d. {rpShort(maxHomePrice(s, 10))}</span>
                    <span className="block text-[11.5px] text-credit">saldo {rpShort(s)}</span>
                  </span>
                );
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LG_SPAN: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3" };
const SM_SPAN: Record<number, string> = { 1: "sm:col-span-1", 2: "sm:col-span-2" };

/** Kelompok kartu 3 kolom. Kartu ajakan mengisi sisa kolom di baris terakhir, jadi grid selalu penuh. */
function CardGroup({
  title,
  sub,
  items,
  selected,
  onSelect,
  cta,
}: {
  title: string;
  sub?: string;
  items: Listing[];
  selected?: string;
  onSelect: (slug: string) => void;
  cta: { title: string; body: string; actions: Action[] };
}) {
  const n = items.length;
  const wide = n % 3 === 0;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <p className="text-[16px] font-extrabold text-brand-dark">{title}</p>
        {sub && <p className="text-[13px] text-brand-gray">{sub}</p>}
      </div>
      <div className="mt-3 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => (
          <ListingCard key={l.slug} l={l} active={l.slug === selected} onSelect={() => onSelect(l.slug)} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw" />
        ))}
        <div
          className={`flex flex-col justify-center gap-3 rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white p-6 ${LG_SPAN[3 - (n % 3)]} ${SM_SPAN[2 - (n % 2)]} ${
            wide ? "lg:flex-row lg:items-center lg:justify-between" : ""
          }`}
        >
          <div className="max-w-md">
            <p className="text-[16px] font-extrabold text-brand-dark">{cta.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-brand-gray">{cta.body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cta.actions.map((a) => (
              <ActionLink key={a.label} a={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formTitle(l: Listing): string {
  if (l.status === "terisi") return "Antre untuk unit ini";
  if (l.status === "terjual") return "Cari rumah serupa";
  if (l.status === "selesai") return "Konsultasi Rumah Bangun";
  if (l.status === "segera") return "Kabari saya saat dibuka";
  if (l.category === "rumah-tujuan") return "Ajukan minat rumah tujuan ini";
  if (l.category === "siap-beli") return "Ajukan minat beli";
  return l.category === "siap-berdaya" ? "Ajukan minat dan jadwalkan survei" : "Ajukan minat untuk unit ini";
}

export default function RtoPlatform({ listings, levels }: { listings: Listing[]; levels?: React.ReactNode }) {
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
  const unit = items.find((l) => l.slug === selected) ?? items[0];
  const estimate = unit ? dpEstimate(unit) : null;
  const price = unit ? listingPrice(unit) : null;
  const kos = items.filter((l) => l.category === "siap-berdaya");
  const tujuan = items.filter((l) => l.category === "rumah-tujuan");

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
              className={`scroll-mt-28 rounded-2xl p-3 text-left transition-colors sm:p-4 ${
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
              <span className="mt-1 block text-[15px] font-extrabold leading-tight sm:text-[19px] md:text-[21px]">{p.name}</span>
              <span className={`mt-0.5 hidden text-[13px] sm:block ${on ? "text-white/70" : "text-brand-gray"}`}>{p.explainer}</span>
            </button>
          );
        })}
      </div>

      <div id="jalur-panel" role="tabpanel" aria-label={path.name} className="mt-4 space-y-8">
        <div className="space-y-4">
          <Intro
            tab={tab}
            extra={
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
                {tab === "siap-berdaya" && (
                  <span className="inline-flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-brand-dark">
                    <span className="rounded-full bg-brand-cream px-2.5 py-1">Penyedia kos</span>
                    <span aria-hidden>→</span>
                    <span className="rounded-full bg-brand-dark px-2.5 py-1 text-white">Kamu</span>
                    <span aria-hidden>→</span>
                    <span className="rounded-full bg-brand-cream px-2.5 py-1">Developer mitra</span>
                  </span>
                )}
                {tab !== "siap-beli" && (
                  <Link href="/layanan/rto/cari" className={linkCls}>
                    Lihat di peta
                  </Link>
                )}
                <Link href="/layanan/rto/panduan" className={linkCls}>
                  Panduan lengkap
                </Link>
              </div>
            }
          />

          {tab === "siap-berdaya" && (
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <ScoreCard hasLevels={Boolean(levels)} levelsOpen={levelOpen} onLevels={() => setLevelOpen(!levelOpen)} />
              </div>
              <div className="grid gap-4 lg:col-span-7">
                <ConversionTimeline lead="Dari ngekos sampai DP" end="Saldo jadi DP" endBody="Untuk rumah tujuan di MoU, lalu PPJB dan KPR." />
                <ProgramExample />
              </div>
            </div>
          )}
          {tab === "siap-berdaya" && levels && (
            <div id="level" className={`scroll-mt-24 ${levelOpen ? "" : "hidden"}`}>
              {levels}
            </div>
          )}
          {tab === "siap-bangun" && <ConversionTimeline lead="Dari ngekos sampai mulai bangun" end="Mulai bangun" endBody="Saldo ditambah tabunganmu sampai 25% RAB." />}
        </div>

        {tab === "siap-berdaya" ? (
          <>
            <CardGroup
              title="Tempat tinggal selama menabung"
              sub="Kos dan rumah sewa mitra. Saldo DP bukan untuk unit ini."
              items={kos}
              selected={unit?.slug}
              onSelect={select}
              cta={{
                title: "Punya kos atau rumah sewa?",
                body: "Listing gratis. Kamu terima harga yang disepakati, disetor tiap bulan.",
                actions: [
                  { label: "Daftarkan unit", href: "/portal/daftar?akun=mitra", primary: true },
                  { label: "Formulir F14", href: GFORMS.F14, external: true },
                ],
              }}
            />
            {tujuan.length ? (
              <CardGroup
                title="Rumah tujuan dari developer mitra"
                sub="Harga dikunci di MoU sampai konversi."
                items={tujuan}
                selected={unit?.slug}
                onSelect={select}
                cta={{
                  title: "Developer properti?",
                  body: "Dapat pasokan calon pembeli yang DP-nya sedang terkumpul.",
                  actions: [
                    { label: "Daftar developer", href: "/portal/daftar?akun=mitra", primary: true },
                    { label: "Formulir F16", href: GFORMS.F16, external: true },
                  ],
                }}
              />
            ) : (
              <TujuanGuide kos={kos} />
            )}
          </>
        ) : tab === "siap-bangun" ? (
          <CardGroup
            title="Proyek Rumah Bangun"
            sub="Rencana dan rumah yang dibangun di lahan milik pemiliknya."
            items={items}
            selected={unit?.slug}
            onSelect={select}
            cta={{
              title: "Punya lahan atau aset?",
              body: "Coba denah dan estimasi biaya gratis di miniCAD, atau ceritakan lahanmu ke tim.",
              actions: [
                { label: "Coba miniCAD", href: "/layanan/contech#konsultasi", primary: true },
                { label: "Ceritakan lahanmu", href: waLink(LAHAN_WA), external: true },
              ],
            }}
          />
        ) : (
          <CardGroup
            title="Properti dijual"
            sub="Listing jual beli dari pemilik dan developer."
            items={items}
            selected={unit?.slug}
            onSelect={select}
            cta={{
              title: "Mau jual atau cari rumah?",
              body: "Iklankan propertimu, atau ceritakan rumah yang kamu cari. Kami kabari begitu ada yang cocok.",
              actions: [
                { label: "Pasang iklan properti", href: waLink(SELLER_WA), external: true, primary: true },
                { label: "Kabari saya", href: waLink(BUYER_WA), external: true },
              ],
            }}
          />
        )}
      </div>

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

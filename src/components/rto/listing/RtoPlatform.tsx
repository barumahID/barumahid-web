"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/i18n/Link";
import LeadForm from "@/components/forms/LeadForm";
import { PATH_STEPS, RTO_PATHS, RTO_STEPS, type RtoCategory } from "@/data/rto";
import { CLOSED_STATUS, listingPlace, listingPrice, listingStatusLabel, type Listing } from "@/data/listings";
import { SITE } from "@/data/site";
import ListingCard, { PhotoPlaceholder } from "./ListingCard";
import UnitSimulator from "./UnitSimulator";
import { dpEstimate } from "./estimate";
import { priceMain } from "./format";

// Platform listing di halaman RTO (arahan user Okt 2026): unit dikelompokkan per jalur (tab Siap Berdaya, Siap Bangun,
// Siap Beli). Tiap tab menjelaskan jalurnya dan langkahnya; tab Siap Berdaya juga memuat level perjalanan dan Skor
// Siap Punya Rumah (dikirim dari server lewat `berdayaExtra`). Klik unit membuka panel: estimasi DP, simulasi sesuai
// jalur, dan formulir minat (form situs customer-rto, unit dan kota terisi otomatis).
// Anchor lama tetap jalan: #jalur, #siap-berdaya / #siap-bangun / #siap-beli (pilih tab), #level (buka level).

const PATH_IDS = RTO_PATHS.map((p) => p.id);
const open = (l: Listing) => Number(CLOSED_STATUS.includes(l.status));

/** Judul form di panel menyesuaikan status unit */
function formTitle(l: Listing): string {
  if (l.status === "terisi") return "Antre untuk unit ini";
  if (l.status === "terjual") return "Cari rumah serupa";
  if (l.status === "selesai") return "Konsultasi Siap Bangun";
  if (l.status === "segera") return "Kabari saya saat dibuka";
  return l.category === "siap-berdaya" ? "Ajukan minat dan jadwalkan survei" : "Ajukan minat untuk unit ini";
}

export default function RtoPlatform({ listings, berdayaExtra }: { listings: Listing[]; berdayaExtra?: React.ReactNode }) {
  const byPath = useMemo(() => {
    const m = new Map<RtoCategory, Listing[]>();
    for (const id of PATH_IDS) m.set(id, listings.filter((l) => l.category === id).sort((a, b) => open(a) - open(b)));
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
        <div className="order-1 lg:order-2 lg:col-span-8">
          {items.length ? (
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
              {items.map((l) => (
                <ListingCard key={l.slug} l={l} active={l.slug === unit?.slug} onSelect={() => select(l.slug)} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-12 text-center">
              <p className="text-[18px] font-extrabold text-brand-dark">Unit {path.name} pertama sedang kami siapkan.</p>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-brand-gray">Isi formulir minat di bawah supaya kamu dikabari begitu unitnya tayang.</p>
            </div>
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
                {path.name} · {listingStatusLabel(unit)}
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
            <p className="mb-3 text-[15px] font-extrabold text-brand-dark">{tab === "siap-berdaya" ? "Simulasi DP dari unit ini" : tab === "siap-bangun" ? "Simulasi modal bangun" : "Simulasi DP dan KPR"}</p>
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
                      "Unit Diminati": `${unit.title} (${path.name}) ${SITE.url.replace(/^https?:\/\//, "")}/layanan/rto/${unit.slug}`.slice(0, 200),
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

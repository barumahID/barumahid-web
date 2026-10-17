"use client";

import dynamic from "next/dynamic";
import type { MutableRefObject, ReactNode } from "react";
import { BIAYA_PER_M2, ESTIMASI_CATATAN } from "@/data/estimasi";
import { rupiahSingkat, type Estimate } from "@/lib/denah/estimate";
import { floorArea } from "@/lib/denah/layout";
import { ROOF_LABEL, type Plan } from "@/lib/denah/types";
import type { Translate } from "./draw";
import ElevationSvg from "./ElevationSvg";
import PlanSvg from "./PlanSvg";
import View3D from "./View3D";
import type { Viewer3DApi } from "./Viewer3D";

// Board presentasi (acuan board barumahID "Seri Mahaksa" dan "Adaptive Hive"): denah tiap lantai, 3D,
// tampak depan, spesifikasi, serta estimasi biaya dan durasi dalam satu tampilan.

export const Viewer3DLazy = dynamic(() => import("./Viewer3D"), { ssr: false, loading: () => null });

/** Spesifikasi acuan dari board "Seri Mahaksa" barumahID (disesuaikan saat survei) */
export const SPEK_ACUAN = [
  "Pondasi batu kali dan sloof beton",
  "Struktur beton bertulang",
  "Dinding bata ringan, plester, aci, cat",
  "Atap rangka baja ringan, genteng beton",
  "Lantai granit 60×60",
  "Kusen aluminium",
  "Plafon gypsum",
];

export type BoardView = "denah" | "tampak" | "3d";

function Panel({ title, className = "", children, onOpen, openLabel }: { title: string; className?: string; children: ReactNode; onOpen?: () => void; openLabel?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-brand-dark/[0.07] px-3 py-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-dark">{title}</p>
        {onOpen && (
          <button type="button" onClick={onOpen} className="rounded-full px-2 py-0.5 text-[11.5px] font-bold text-brand-red hover:bg-brand-red/10">
            {openLabel} ↗
          </button>
        )}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function specRows(plan: Plan, t: Translate) {
  const b = plan.brief;
  const fl = plan.floors.map((_, i) => floorArea(plan, i));
  const extras = [b.mushola && t("Mushola"), b.workRoom && t("Ruang kerja"), b.storage && t("Gudang"), b.laundry && t("Cuci & jemur")].filter(Boolean).join(", ");
  const num = (n: number) => String(n).replace(".", ",");
  return [
    [t("Luas lahan"), `${num(b.landW)} × ${num(b.landD)} m (${Math.round(b.landW * b.landD)} m²)`],
    [t("Luas bangunan"), fl.length > 1 ? `${t("Lt 1")} ${fl[0]} m² + ${t("Lt 2")} ${fl[1]} m² = ${fl[0] + fl[1]} m²` : `${fl[0]} m²`],
    [t("Jumlah lantai"), String(plan.floors.length)],
    [t("Jumlah kamar tidur"), String(b.bedrooms)],
    [t("Jumlah kamar mandi"), String(b.bathrooms)],
    [t("Carport"), b.carport ? t("{n} mobil", { n: b.carport }) : t("Tanpa")],
    [t("Atap"), t(ROOF_LABEL[b.roof])],
    [t("Tambahan"), extras || "-"],
  ] as [string, string][];
}

export function EstimateBox({ est, budget, t, lang, dark = false }: { est: Estimate; budget: number | null; t: Translate; lang: string; dark?: boolean }) {
  // Masuk: estimasi bawah tidak melewati budget. Sedikit di atas: sampai 20% di atasnya.
  const status = budget === null ? null : est.min <= budget ? "masuk" : est.min <= budget * 1.2 ? "sedikit" : "lewat";
  const within = status === "masuk";
  const muted = dark ? "text-white/60" : "text-brand-gray";
  const jt = (n: number) => Math.round(n / 1_000_000);
  return (
    <div>
      <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${muted}`}>{t("Estimasi biaya bangun")}</p>
      <p className={`mt-1 text-[22px] font-extrabold leading-tight ${dark ? "text-white" : "text-brand-dark"}`}>
        {rupiahSingkat(est.min, lang)} – {rupiahSingkat(est.max, lang)}
      </p>
      <p className={`mt-0.5 text-[12px] ${muted}`}>{t("± Rp{a}–{b} juta/m² × {m} m², termasuk upah, alat, dan biaya lain", { a: jt(BIAYA_PER_M2.min), b: jt(BIAYA_PER_M2.max), m: est.area })}</p>
      <div className={`mt-3 flex items-baseline justify-between gap-2 border-t pt-2.5 ${dark ? "border-white/15" : "border-brand-dark/10"}`}>
        <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${muted}`}>{t("Durasi pengerjaan")}</span>
        <span className={`text-[16px] font-extrabold ${dark ? "text-white" : "text-brand-dark"}`}>{t("± {a}–{b} bulan", { a: est.months[0], b: est.months[1] })}</span>
      </div>
      {budget !== null && (
        <p className={`mt-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold ${within ? "bg-[#2D7A4F]/12 text-[#2D7A4F]" : "bg-[#C25E20]/12 text-[#C25E20]"}`}>
          {status === "masuk"
            ? t("Masuk target budget {b}.", { b: rupiahSingkat(budget, lang) })
            : status === "sedikit"
              ? t("Sedikit di atas target budget {b}. Coba kurangi luas atau jumlah ruang.", { b: rupiahSingkat(budget, lang) })
              : t("Di atas target budget {b}. Kurangi jumlah ruang atau lantai, atau sesuaikan budgetnya.", { b: rupiahSingkat(budget, lang) })}
        </p>
      )}
    </div>
  );
}

export default function Board({
  plan,
  t,
  lang,
  est,
  budget,
  sample,
  s3,
  roofOn,
  upperOn,
  webglFailed,
  onWebglError,
  viewerApi,
  onOpen,
}: {
  plan: Plan;
  t: Translate;
  lang: string;
  est: Estimate;
  budget: number | null;
  sample: boolean;
  s3: number;
  roofOn: boolean;
  upperOn: boolean;
  webglFailed: boolean;
  onWebglError: () => void;
  viewerApi: MutableRefObject<Viewer3DApi | null>;
  onOpen: (v: BoardView, floor?: number) => void;
}) {
  const two = plan.floors.length > 1;
  const b = plan.brief;
  const title = t("Rumah {n} lantai · LB {a} m²", { n: plan.floors.length, a: est.area });
  return (
    <div className="grid gap-3 bg-[#f7f5f1] p-3 sm:p-4 md:grid-cols-6">
      <div className="flex flex-wrap items-end justify-between gap-3 md:col-span-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-red">{sample ? t("Contoh awal, ubah sesuai kebutuhanmu") : t("Konsep rumahmu")}</p>
          <h3 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.01em] text-brand-dark sm:text-[24px]">{title}</h3>
          <p className="mt-0.5 text-[12.5px] text-brand-gray">
            {t("Lahan {w} × {d} m · {kt} KT · {km} KM · Atap {atap}", {
              w: String(b.landW).replace(".", ","),
              d: String(b.landD).replace(".", ","),
              kt: b.bedrooms,
              km: b.bathrooms,
              atap: t(ROOF_LABEL[b.roof]).toLowerCase(),
            })}
          </p>
        </div>
        <p className="text-[18px] font-extrabold text-brand-dark">
          barumah<span className="text-brand-red">ID</span>
          <span className="ml-1.5 text-[11px] font-semibold text-brand-mute">miniCAD</span>
        </p>
      </div>

      {plan.floors.map((_, f) => (
        <Panel key={f} title={t(`DENAH LANTAI ${f + 1}`)} className="h-[300px] sm:h-[360px] md:col-span-2" onOpen={() => onOpen("denah", f)} openLabel={t("Buka")}>
          <PlanSvg plan={plan} floor={f} layers={{ dims: false, furniture: true, labels: true }} t={t} lang={lang} idPrefix={`bd${f}`} className="absolute inset-0 h-full w-full p-1" />
        </Panel>
      ))}
      <Panel title={t("3D ISOMETRIK")} className={`h-[300px] sm:h-[360px] ${two ? "md:col-span-2" : "md:col-span-4"}`} onOpen={() => onOpen("3d")} openLabel={t("Buka")}>
        <div className="absolute inset-0">
          {webglFailed ? (
            <View3D plan={plan} s={s3} showRoof={roofOn} showUpper={upperOn} t={t} />
          ) : (
            <Viewer3DLazy plan={plan} s={s3} roof={roofOn} upper={upperOn} autoRotate apiRef={viewerApi} onError={onWebglError} label={t("Visual 3D rumah konsep")} />
          )}
        </div>
        <p className="pointer-events-none absolute bottom-2 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-brand-gray">{t("Geser untuk memutar")}</p>
      </Panel>

      <Panel title={t("TAMPAK DEPAN")} className="h-[260px] md:col-span-2" onOpen={() => onOpen("tampak")} openLabel={t("Buka")}>
        <ElevationSvg plan={plan} t={t} lang={lang} dims={false} idPrefix="bde" className="absolute inset-0 h-full w-full p-1" />
      </Panel>
      <Panel title={t("Spesifikasi")} className="md:col-span-2">
        <dl className="divide-y divide-brand-dark/[0.06] px-3 py-1 text-[12.5px]">
          {specRows(plan, t).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-1.5">
              <dt className="text-brand-gray">{k}</dt>
              <dd className="text-right font-semibold text-brand-dark">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="px-3 pb-3 pt-1 text-[11.5px] leading-relaxed text-brand-gray">
          <span className="font-bold text-brand-dark">{t("Spesifikasi acuan")}:</span> {SPEK_ACUAN.map((s) => t(s)).join(", ")}. {t("Disesuaikan saat survei.")}
        </p>
      </Panel>
      <Panel title={t("Estimasi biaya & durasi")} className="md:col-span-2">
        <div className="p-3">
          <EstimateBox est={est} budget={budget} t={t} lang={lang} />
          <p className="mt-3 text-[11.5px] leading-relaxed text-brand-gray">{t(ESTIMASI_CATATAN)}</p>
        </div>
      </Panel>
    </div>
  );
}

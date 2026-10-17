"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useLang, useT } from "@/i18n/LangProvider";
import { JURURANCANG, waLink } from "@/data/site";
import { setDenahAttachment, useDenahAttachment } from "@/lib/denah/attach";
import { planToDxf } from "@/lib/denah/dxf";
import { bandOffsets } from "@/lib/denah/geometry";
import { buildPlan, clamp, floorArea, normalizeBrief, r2, totalArea } from "@/lib/denah/layout";
import { decodePlan, encodePlan, parseStory, planSummary } from "@/lib/denah/parse";
import { DEFAULT_BRIEF, EDITABLE_TYPES, LIMITS, ROOM_META, type Brief, type Plan, type Roof, type RoomType } from "@/lib/denah/types";
import ElevationSvg from "./ElevationSvg";
import PlanSvg, { PLAN_M, type Handle } from "./PlanSvg";
import View3D, { drawScene } from "./View3D";
import { S, type Translate } from "./draw";

// miniCAD barumahID (arahan user Okt 2026, acuan rasa: alur "lookahead planning -> 2D -> 3D" situs Specter).
// 01 Cerita: tulis bebas (AI menafsirkan, cadangan pembaca kata kunci lokal) atau atur angka langsung.
// 02 Denah 2D: gambar ala CAD per lantai; klik ruang untuk ganti fungsi, geser dinding untuk ubah ukuran.
// 03 Tampak depan. 04 3D: denah naik jadi visual awal 3D (bisa diputar dan digeser 2D <-> 3D).
// Unduh PNG, PDF (cetak), DXF (AutoCAD). Denah bisa dilampirkan ke form konsultasi (ringkasan + tautan).
// Gambar konsep gratis; untuk gambar kerja detail diarahkan ke paket Jururancang.

type View = "cerita" | "denah" | "tampak" | "3d";
type Zoom = { k: number; x: number; y: number };
const FIT: Zoom = { k: 1, x: 0, y: 0 };

const STEPS: { id: View; label: string }[] = [
  { id: "cerita", label: "Cerita" },
  { id: "denah", label: "Denah 2D" },
  { id: "tampak", label: "Tampak" },
  { id: "3d", label: "3D" },
];

const EXTRAS: { key: "mushola" | "workRoom" | "storage" | "laundry"; label: string }[] = [
  { key: "mushola", label: "Mushola" },
  { key: "workRoom", label: "Ruang kerja" },
  { key: "storage", label: "Gudang" },
  { key: "laundry", label: "Cuci & jemur" },
];

const ROOFS: { v: Roof; label: string }[] = [
  { v: "pelana", label: "Pelana" },
  { v: "perisai", label: "Perisai" },
  { v: "datar", label: "Dak datar" },
];

function displaySummary(p: Plan, t: Translate) {
  return t("Lahan {w} × {d} m · {f} lantai · {kt} KT · {km} KM · ± {a} m²", {
    w: String(p.brief.landW).replace(".", ","),
    d: String(p.brief.landD).replace(".", ","),
    f: p.floors.length,
    kt: p.brief.bedrooms,
    km: p.brief.bathrooms,
    a: totalArea(p),
  });
}

function attachmentFor(p: Plan, t: Translate) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.barumahid.com";
  return {
    summary: displaySummary(p, t),
    value: `Denah konsep miniCAD: ${planSummary(p)} Buka denah: ${origin}/layanan/contech?denah=${encodePlan(p)}#konsultasi`,
  };
}

/** Geser dinding: batas sel dalam satu pita (lantai ini) atau batas pita (semua lantai). */
function applyDrag(base: Plan, h: Handle, floor: number, p: { x: number; y: number }): Plan {
  const snap = (v: number) => Math.round(v / 0.05) * 0.05;
  if (h.kind === "v") {
    const cells = base.floors[floor][h.band];
    const start = cells.slice(0, h.index - 1).reduce((s, c) => s + c.w, 0);
    const end = start + cells[h.index - 1].w + cells[h.index].w;
    const x = clamp(snap(p.x), start + 0.8, end - 0.8);
    const next = cells.map((c, i) => (i === h.index - 1 ? { ...c, w: r2(x - start) } : i === h.index ? { ...c, w: r2(end - x) } : c));
    return { ...base, floors: base.floors.map((f, fi) => (fi === floor ? f.map((b, bi) => (bi === h.band ? next : b)) : f)) };
  }
  const ys = bandOffsets(base);
  const y0 = ys[h.band - 1];
  const y1 = ys[h.band] + base.bands[h.band].d;
  const y = clamp(snap(p.y), y0 + 0.8, y1 - 0.8);
  return { ...base, bands: base.bands.map((b, i) => (i === h.band - 1 ? { ...b, d: r2(y - y0) } : i === h.band ? { ...b, d: r2(y1 - y) } : b)) };
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function svgToPng(svg: SVGSVGElement, maxSide = 2600): Promise<Blob | null> {
  const vb = svg.viewBox.baseVal;
  const k = Math.min(2, maxSide / Math.max(vb.width, vb.height));
  const xml = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = Math.round(vb.width * k);
  c.height = Math.round(vb.height * k);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

function render3d(plan: Plan, roof: boolean, upper: boolean, t: Translate, w = 1600, h = 1100) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) drawScene(ctx, plan, 1, 0, roof, upper, w, h, t);
  return c;
}

const iconBtn = "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[12.5px] font-semibold transition-colors disabled:opacity-30";

export default function MiniCad({ initialCode }: { initialCode?: string | null }) {
  const t = useT() as Translate;
  const lang = useLang();
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF);
  const [plan, setPlan] = useState<Plan>(() => buildPlan(DEFAULT_BRIEF));
  const [hist, setHist] = useState<{ past: Plan[]; future: Plan[] }>({ past: [], future: [] });
  const [view, setView] = useState<View>("cerita");
  const [floor, setFloor] = useState(0);
  const [layers, setLayers] = useState({ dims: true, furniture: true, labels: true });
  const [selected, setSelected] = useState<string | null>(null);
  const [story, setStory] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "ai" | "local"; text: string } | null>(null);
  const [s3, setS3] = useState(1);
  const [roofOn, setRoofOn] = useState(true);
  const [upperOn, setUpperOn] = useState(true);
  const [zoom, setZoom] = useState<Zoom>(FIT);
  const [touched, setTouched] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const exportRefs = useRef<(SVGSVGElement | null)[]>([]);
  const elevRef = useRef<SVGSVGElement>(null);
  const canvas3d = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ h: Handle; base: Plan } | null>(null);
  const pan = useRef<{ x: number; y: number; zx: number; zy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number; cx: number; cy: number; zx: number; zy: number } | null>(null);
  const raf = useRef(0);

  // Denah dari tautan (?denah=...): langsung dibuka di langkah Denah 2D
  if (initialCode && initialCode !== appliedCode) {
    setAppliedCode(initialCode);
    const shared = decodePlan(initialCode);
    if (shared) {
      setPlan(shared);
      setBrief(shared.brief);
      setView("denah");
      setTouched(true);
    }
  }

  // Lampiran ke form konsultasi mengikuti denah terbaru
  const attached = useDenahAttachment();
  useEffect(() => {
    if (!attached) return;
    const next = attachmentFor(plan, t);
    if (next.value !== attached.value || next.summary !== attached.summary) setDenahAttachment(next);
  }, [plan, attached, t]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const commit = (next: Plan) => {
    setHist((h) => ({ past: [...h.past.slice(-40), plan], future: [] }));
    setPlan(next);
  };

  const play3d = () => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setS3(1);
      return;
    }
    let start = -1;
    const tick = (now: number) => {
      if (start < 0) start = now;
      const k = Math.min(1, (now - start) / 2800);
      setS3(k);
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    setS3(0);
    raf.current = requestAnimationFrame(tick);
  };

  const go = (v: View) => {
    setView(v);
    setSelected(null);
    setZoom(FIT);
    if (v === "3d") play3d();
  };

  const drawFrom = (b: Brief, msg?: { kind: "ai" | "local"; text: string }) => {
    const p = buildPlan(b);
    commit(p);
    setBrief(p.brief);
    setFloor(0);
    setNote(msg ?? null);
    go("denah");
    if (!touched) {
      setTouched(true);
      setDenahAttachment(attachmentFor(p, t));
    }
  };

  const fromStory = async () => {
    const text = story.trim();
    if (text.length < 8 || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/denah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, current: brief }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; brief?: Brief; notes?: string };
      if (res.ok && data.ok && data.brief) {
        drawFrom(normalizeBrief(data.brief), { kind: "ai", text: data.notes || t("Denah disusun AI dari ceritamu.") });
        return;
      }
      throw new Error("fallback");
    } catch {
      // AI belum aktif atau sibuk: baca kata kunci di cerita
      const { brief: b, found } = parseStory(text, brief);
      drawFrom(b, {
        kind: "local",
        text: found.length
          ? t("Disusun dari kata kunci di ceritamu: {list}. Sisanya pakai pengaturan di bawah.", { list: found.map((f) => t(f)).join(", ") })
          : t("Belum ada ukuran atau jumlah ruang yang terbaca. Denah memakai pengaturan di bawah, silakan ubah angkanya."),
      });
    } finally {
      setBusy(false);
    }
  };

  const undo = () => {
    if (!hist.past.length) return;
    setHist({ past: hist.past.slice(0, -1), future: [plan, ...hist.future] });
    setPlan(hist.past[hist.past.length - 1]);
  };
  const redo = () => {
    if (!hist.future.length) return;
    setHist({ past: [...hist.past, plan], future: hist.future.slice(1) });
    setPlan(hist.future[0]);
  };

  const setType = (id: string, type: RoomType) => {
    commit({
      ...plan,
      floors: plan.floors.map((f) => f.map((cells) => cells.map((c) => (c.id === id ? { ...c, type } : c)))),
    });
  };

  // ---- Pan, zoom, dan geser dinding ----
  const toPlan = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return { x: 0, y: 0 };
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: (pt.x - PLAN_M.L) / S, y: plan.brief.landD - (pt.y - PLAN_M.T) / S };
  };
  const zoomAt = (factor: number, px?: number, py?: number) => {
    const box = boxRef.current?.getBoundingClientRect();
    const cx = px ?? (box ? box.width / 2 : 0);
    const cy = py ?? (box ? box.height / 2 : 0);
    setZoom((z) => {
      const k = clamp(z.k * factor, 0.6, 6);
      return { k, x: cx - (cx - z.x) * (k / z.k), y: cy - (cy - z.y) * (k / z.k) };
    });
  };
  const onHandleDown = (h: Handle, e: ReactPointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { h, base: plan };
    setHist((hs) => ({ past: [...hs.past.slice(-40), plan], future: [] }));
    setSelected(null);
  };
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    pointers.current.set(e.pointerId, { x: e.clientX - box.left, y: e.clientY - box.top });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: zoom.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, zx: zoom.x, zy: zoom.y };
      pan.current = null;
      return;
    }
    if (e.pointerType !== "touch" && !drag.current) pan.current = { x: e.clientX, y: e.clientY, zx: zoom.x, zy: zoom.y };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current) {
      const { h, base } = drag.current;
      setPlan(applyDrag(base, h, floor, toPlan(e)));
      return;
    }
    const box = e.currentTarget.getBoundingClientRect();
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX - box.left, y: e.clientY - box.top });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const p0 = pinch.current;
      const k = clamp((p0.k * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, p0.d), 0.6, 6);
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      setZoom({ k, x: cx - (p0.cx - p0.zx) * (k / p0.k), y: cy - (p0.cy - p0.zy) * (k / p0.k) });
      return;
    }
    if (pan.current && e.buttons) {
      setZoom((z) => ({ ...z, x: pan.current!.zx + e.clientX - pan.current!.x, y: pan.current!.zy + e.clientY - pan.current!.y }));
    }
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    drag.current = null;
    pan.current = null;
  };

  // Ctrl/⌘ + roda = zoom (roda biasa tetap menggulir halaman)
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const box = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - box.left, e.clientY - box.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [view]);

  // ---- Unduh ----
  const sheetName = view === "tampak" ? "tampak-depan" : `denah-lt${floor + 1}`;
  const exportPng = async () => {
    if (view === "3d") {
      render3d(plan, roofOn, upperOn, t).toBlob((b) => b && download("barumahid-3d.png", b), "image/png");
      return;
    }
    const svg = view === "tampak" ? elevRef.current : exportRefs.current[floor];
    if (!svg) return;
    const blob = await svgToPng(svg);
    if (blob) download(`barumahid-${sheetName}.png`, blob);
  };
  const exportDxf = () => download("barumahid-denah-konsep.dxf", new Blob([planToDxf(plan, (s) => t(s))], { type: "application/dxf" }));
  const exportPdf = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const fit = (svg: SVGSVGElement | null) => (svg ? svg.outerHTML.replace(/ width="[\d.]+" height="[\d.]+"/, ' width="100%" height="100%"') : "");
    const sheets = [...plan.floors.map((_, i) => fit(exportRefs.current[i])), fit(elevRef.current), `<img src="${render3d(plan, true, true, t).toDataURL("image/png")}" alt="3D" />`];
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>barumahID miniCAD</title><style>@page{size:A4 landscape;margin:10mm}body{margin:0;font-family:Arial,sans-serif}.s{height:185mm;display:flex;align-items:center;justify-content:center;page-break-after:always}.s img{max-width:100%;max-height:100%}</style></head><body>${sheets.map((x) => `<div class="s">${x}</div>`).join("")}</body></html>`,
    );
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  // Gambar tersembunyi untuk ekspor (tanpa elemen bantu edit), dihitung ulang hanya saat denah berubah
  const exportSheets = useMemo(
    () => (
      <div className="hidden" aria-hidden="true">
        {plan.floors.map((_, i) => (
          <PlanSvg
            key={i}
            plan={plan}
            floor={i}
            layers={{ dims: true, furniture: true, labels: true }}
            t={t}
            lang={lang}
            idPrefix={`ex${i}`}
            svgRef={(el) => {
              exportRefs.current[i] = el;
            }}
          />
        ))}
        <ElevationSvg plan={plan} t={t} lang={lang} svgRef={elevRef} />
      </div>
    ),
    [plan, t, lang],
  );

  const selRoom = selected ? plan.floors[floor].flat().find((c) => c.id === selected) : null;
  const selBand = selRoom ? plan.floors[floor].findIndex((cells) => cells.some((c) => c.id === selRoom.id)) : -1;
  const twoFloors = plan.floors.length > 1;
  const jururancangMsg = t("Halo admin Jururancang, saya sudah coba denah konsep di website barumahID ({ringkasan}). Saya mau pesan gambar kerja detailnya.", { ringkasan: planSummary(plan) });

  const tog = (on: boolean) => (on ? "bg-brand-dark text-white" : "text-brand-dark hover:bg-brand-dark/10");
  const seg = (on: boolean) => `rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${on ? "bg-brand-dark text-white" : "bg-white text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40"}`;

  return (
    <div
      className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (e.key === "Escape") setSelected(null);
      }}
    >
      {/* Langkah 01-04 */}
      <div className="grid grid-cols-4 border-b border-brand-dark/10 bg-brand-cream" role="tablist" aria-label={t("Langkah miniCAD")}>
        {STEPS.map((st, i) => {
          const on = view === st.id;
          const locked = st.id !== "cerita" && !touched;
          return (
            <button
              key={st.id}
              type="button"
              role="tab"
              aria-selected={on}
              disabled={locked}
              onClick={() => go(st.id)}
              className={`relative flex flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors sm:px-4 ${on ? "bg-white" : "hover:bg-white/60"} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span className={`text-[11px] font-black ${on ? "text-brand-red" : "text-brand-mute"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[12.5px] font-bold text-brand-dark sm:text-[13.5px]">{t(st.label)}</span>
              {on && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-red" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {view === "cerita" && (
        <div className="p-4 sm:p-6">
          <label htmlFor="minicad-cerita" className="block text-[16px] font-extrabold text-brand-dark">
            {t("Ceritakan rumah yang kamu mau")}
          </label>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-gray">{t("Tulis bebas, nanti kami susun jadi denah, tampak, dan visual 3D. Atau atur angkanya langsung di bawah.")}</p>
          <textarea
            id="minicad-cerita"
            rows={3}
            maxLength={900}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={t("Contoh: lahan 8x15, rumah 2 lantai, 4 kamar tidur, 3 kamar mandi, carport 1 mobil, ada mushola dan tempat jemur, atap pelana.")}
            className="mt-3 w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3 text-[14.5px] text-brand-dark placeholder:text-brand-mute focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/10"
          />
          <button
            type="button"
            onClick={fromStory}
            disabled={busy || story.trim().length < 8}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t("Sedang membaca ceritamu...") : t("Susun denah dari cerita")}
            {!busy && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
              </svg>
            )}
          </button>

          <div className="mt-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-mute">
            <span className="h-px flex-1 bg-brand-dark/10" />
            {t("atau atur langsung")}
            <span className="h-px flex-1 bg-brand-dark/10" />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              {(["landW", "landD"] as const).map((k) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-[12.5px] font-semibold text-brand-dark">{k === "landW" ? t("Lebar lahan (m)") : t("Panjang lahan (m)")}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step={0.5}
                    min={LIMITS[k][0]}
                    max={LIMITS[k][1]}
                    value={brief[k]}
                    onChange={(e) => setBrief({ ...brief, [k]: Number(e.target.value) })}
                    className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-[14px] text-brand-dark focus:border-brand-red focus:outline-none"
                  />
                </label>
              ))}
            </div>
            <Field label={t("Jumlah lantai")}>
              {[1, 2].map((n) => (
                <button key={n} type="button" className={seg(brief.floors === n)} onClick={() => setBrief({ ...brief, floors: n as 1 | 2 })}>
                  {t("{n} lantai", { n })}
                </button>
              ))}
            </Field>
            <Stepper label={t("Jumlah kamar tidur")} value={brief.bedrooms} min={LIMITS.bedrooms[0]} max={LIMITS.bedrooms[1]} onChange={(v) => setBrief({ ...brief, bedrooms: v })} t={t} />
            <Stepper label={t("Jumlah kamar mandi")} value={brief.bathrooms} min={LIMITS.bathrooms[0]} max={LIMITS.bathrooms[1]} onChange={(v) => setBrief({ ...brief, bathrooms: v })} t={t} />
            <Field label={t("Carport")}>
              {[0, 1, 2].map((n) => (
                <button key={n} type="button" className={seg(brief.carport === n)} onClick={() => setBrief({ ...brief, carport: n as 0 | 1 | 2 })}>
                  {n === 0 ? t("Tanpa") : t("{n} mobil", { n })}
                </button>
              ))}
            </Field>
            <Field label={t("Atap")}>
              {ROOFS.map((r) => (
                <button key={r.v} type="button" className={seg(brief.roof === r.v)} onClick={() => setBrief({ ...brief, roof: r.v })}>
                  {t(r.label)}
                </button>
              ))}
            </Field>
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-[12.5px] font-semibold text-brand-dark">{t("Tambahan")}</span>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((x) => (
                  <button key={x.key} type="button" aria-pressed={brief[x.key]} className={seg(brief[x.key])} onClick={() => setBrief({ ...brief, [x.key]: !brief[x.key] })}>
                    {t(x.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => drawFrom(normalizeBrief(brief))}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-dark px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red"
          >
            {touched ? t("Gambar ulang denah") : t("Gambar denah")}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          {touched && <p className="mt-2 text-[12px] text-brand-mute">{t("Menggambar ulang akan mengganti perubahan dinding yang sudah kamu buat.")}</p>}
        </div>
      )}

      {(view === "denah" || view === "tampak") && (
        <>
          <div className="flex flex-wrap items-center gap-1 border-b border-brand-dark/10 px-2 py-2 sm:px-3" role="toolbar" aria-label={t("Alat denah")}>
            {view === "denah" && twoFloors && (
              <>
                {[0, 1].map((f) => (
                  <button key={f} type="button" className={`${iconBtn} ${tog(floor === f)}`} onClick={() => {
                      setFloor(f);
                      setSelected(null);
                    }}>
                    {t("Lt {n}", { n: f + 1 })}
                  </button>
                ))}
                <span className="mx-1 h-6 w-px bg-brand-dark/15" aria-hidden="true" />
              </>
            )}
            {view === "denah" &&
              (
                [
                  ["dims", "Ukuran"],
                  ["furniture", "Perabot"],
                  ["labels", "Label"],
                ] as const
              ).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={layers[k]} className={`${iconBtn} ${tog(layers[k])}`} onClick={() => setLayers({ ...layers, [k]: !layers[k] })}>
                  {t(label)}
                </button>
              ))}
            <div className="ml-auto flex items-center gap-0.5">
              {view === "denah" && (
                <>
                  <button type="button" title={t("Urungkan (Ctrl+Z)")} aria-label={t("Urungkan")} disabled={!hist.past.length} onClick={undo} className={`${iconBtn} text-brand-dark hover:bg-brand-dark/10`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-3" />
                    </svg>
                  </button>
                  <button type="button" title={t("Ulangi (Ctrl+Shift+Z)")} aria-label={t("Ulangi")} disabled={!hist.future.length} onClick={redo} className={`${iconBtn} text-brand-dark hover:bg-brand-dark/10`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M15 14l5-5-5-5M20 9H9a5 5 0 000 10h3" />
                    </svg>
                  </button>
                </>
              )}
              <button type="button" aria-label={t("Perkecil")} onClick={() => zoomAt(1 / 1.25)} className={`${iconBtn} text-brand-dark hover:bg-brand-dark/10`}>
                −
              </button>
              <button type="button" aria-label={t("Perbesar")} onClick={() => zoomAt(1.25)} className={`${iconBtn} text-brand-dark hover:bg-brand-dark/10`}>
                +
              </button>
              <button type="button" onClick={() => setZoom(FIT)} className={`${iconBtn} text-brand-dark hover:bg-brand-dark/10`}>
                {t("Pas")}
              </button>
            </div>
          </div>

          <div
            ref={boxRef}
            className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden bg-[#f7f5f1] select-none sm:aspect-square"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={(e) => e.buttons === 0 && onUp(e)}
          >
            <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.k})` }}>
              {view === "denah" ? (
                <PlanSvg
                  plan={plan}
                  floor={floor}
                  layers={layers}
                  t={t}
                  lang={lang}
                  selectedId={selected}
                  interactive
                  idPrefix="live"
                  svgRef={svgRef}
                  className="h-full w-full"
                  onRoomDown={(id) => setSelected(id)}
                  onHandleDown={onHandleDown}
                />
              ) : (
                <ElevationSvg plan={plan} t={t} lang={lang} className="h-full w-full" />
              )}
            </div>

            {note && view === "denah" && (
              <div className="absolute inset-x-2 top-2 flex items-start gap-2 rounded-xl bg-white/95 p-2.5 text-[12.5px] leading-snug text-brand-dark shadow-md ring-1 ring-brand-dark/10 sm:inset-x-3">
                <span className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-black ${note.kind === "ai" ? "bg-brand-red text-white" : "bg-brand-dark/10 text-brand-dark"}`}>{note.kind === "ai" ? "AI" : t("Otomatis")}</span>
                <span className="flex-1">{note.text}</span>
                <button type="button" aria-label={t("Tutup")} onClick={() => setNote(null)} className="shrink-0 px-1 text-brand-mute hover:text-brand-dark">
                  ×
                </button>
              </div>
            )}

            {selRoom && view === "denah" && (
              <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-brand-dark/10 sm:inset-x-auto sm:left-3 sm:w-72" onPointerDown={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-extrabold text-brand-dark">{t(ROOM_META[selRoom.type].label) || t("Ruang")}</p>
                    <p className="text-[12px] text-brand-gray">
                      {String(selRoom.w).replace(".", ",")} × {String(plan.bands[selBand]?.d ?? 0).replace(".", ",")} m · {String(Math.round(selRoom.w * (plan.bands[selBand]?.d ?? 0) * 10) / 10).replace(".", ",")} m²
                    </p>
                  </div>
                  <button type="button" aria-label={t("Tutup")} onClick={() => setSelected(null)} className="px-1 text-[18px] leading-none text-brand-mute hover:text-brand-dark">
                    ×
                  </button>
                </div>
                {selRoom.type !== "tangga" && selRoom.type !== "void" && (
                  <label className="mt-2 block">
                    <span className="mb-1 block text-[11.5px] font-semibold text-brand-gray">{t("Ganti fungsi ruang")}</span>
                    <select
                      value={selRoom.type}
                      onChange={(e) => setType(selRoom.id, e.target.value as RoomType)}
                      className="w-full rounded-lg border border-brand-dark/15 bg-white px-2 py-1.5 text-[13px] text-brand-dark"
                    >
                      {[...new Set([selRoom.type, ...EDITABLE_TYPES])].map((ty) => (
                        <option key={ty} value={ty}>
                          {t(ROOM_META[ty].label)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}
          </div>

          {view === "denah" && (
            <div className="border-t border-brand-dark/10 px-3 py-2.5 text-[12px] leading-relaxed text-brand-gray sm:px-4">
              <p>{t("Klik ruang untuk ganti fungsinya. Geser garis dinding untuk ubah ukuran. Ctrl + scroll atau dua jari untuk zoom.")}</p>
              {[...plan.warnings].map((w, i) => (
                <p key={i} className="mt-1 font-semibold text-build">
                  {t(w.msg, Object.fromEntries(Object.entries(w.vars ?? {}).map(([k, v]) => [k, typeof v === "string" ? t(v) : v])))}
                </p>
              ))}
              <p className="mt-1 font-semibold text-brand-dark">
                {displaySummary(plan, t)}
                {twoFloors && ` · ${t("Lt {n}", { n: floor + 1 })}: ± ${floorArea(plan, floor)} m²`}
              </p>
            </div>
          )}
        </>
      )}

      {view === "3d" && (
        <>
          <div className="relative aspect-[4/5] w-full bg-[#f7f4ef] sm:aspect-[4/3]">
            <View3D plan={plan} s={s3} showRoof={roofOn} showUpper={upperOn} t={t} canvasRef={canvas3d} />
            <p className="pointer-events-none absolute bottom-2 left-3 text-[11.5px] font-semibold text-brand-mute">{t("Geser untuk memutar")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-brand-dark/10 px-3 py-3 sm:px-4">
            <button type="button" onClick={play3d} className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-brand-red">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 1l9 5-9 5z" />
              </svg>
              {t("Putar")}
            </button>
            <label className="flex min-w-[180px] flex-1 items-center gap-2 text-[12px] font-semibold text-brand-gray">
              {t("2D")}
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(s3 * 1000)}
                onChange={(e) => {
                  cancelAnimationFrame(raf.current);
                  setS3(Number(e.target.value) / 1000);
                }}
                className="flex-1 accent-[#C53B3B]"
                aria-label={t("Dari denah 2D ke 3D")}
              />
              {t("3D")}
            </label>
            <div className="flex gap-1.5">
              <button type="button" aria-pressed={roofOn} className={`${iconBtn} ${tog(roofOn)}`} onClick={() => setRoofOn(!roofOn)}>
                {t("Atap")}
              </button>
              {twoFloors && (
                <button type="button" aria-pressed={upperOn} className={`${iconBtn} ${tog(upperOn)}`} onClick={() => setUpperOn(!upperOn)}>
                  {t("Lantai 2")}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Unduh, lampirkan, dan ajakan ke Jururancang */}
      {touched && (
        <div className="border-t border-brand-dark/10 bg-brand-cream px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-brand-gray">{t("Unduh")}</span>
            {view !== "cerita" && (
              <button type="button" onClick={exportPng} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40">
                PNG
              </button>
            )}
            <button type="button" onClick={exportPdf} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40">
              PDF
            </button>
            <button type="button" onClick={exportDxf} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40" title={t("Bisa dibuka di AutoCAD")}>
              DXF
            </button>
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-brand-dark">
              <input type="checkbox" checked={Boolean(attached)} onChange={(e) => setDenahAttachment(e.target.checked ? attachmentFor(plan, t) : null)} className="h-4 w-4 accent-[#C53B3B]" />
              {t("Lampirkan ke form konsultasi")}
            </label>
          </div>
          <div className="mt-3 rounded-2xl bg-white p-3.5 ring-1 ring-brand-dark/10">
            <p className="text-[13px] font-bold text-brand-dark">{t("Ini gambar konsep gratis.")}</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-brand-gray">
              {t("Untuk gambar kerja lengkap (denah detail, tampak empat sisi, potongan, detail, dan struktur), pesan paket gambar bersama partner kami, Jururancang.")}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <a href="#harga" className="rounded-full bg-brand-red px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-brand-red-dark">
                {t("Lihat paket gambar")}
              </a>
              <a href={waLink(jururancangMsg, JURURANCANG.wa)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#1f9d55] px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-[#188a49]">
                {t("Chat admin Jururancang")}
              </a>
            </div>
          </div>
        </div>
      )}

      {exportSheets}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-brand-dark">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange, t }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; t: Translate }) {
  return (
    <div>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-brand-dark">{label}</span>
      <div className="inline-flex items-center rounded-lg ring-1 ring-brand-dark/15">
        <button type="button" aria-label={t("Kurangi")} disabled={value <= min} onClick={() => onChange(value - 1)} className="h-9 w-9 text-[16px] font-bold text-brand-dark disabled:opacity-30">
          −
        </button>
        <span className="w-8 text-center text-[14px] font-bold text-brand-dark">{value}</span>
        <button type="button" aria-label={t("Tambah")} disabled={value >= max} onClick={() => onChange(value + 1)} className="h-9 w-9 text-[16px] font-bold text-brand-dark disabled:opacity-30">
          +
        </button>
      </div>
    </div>
  );
}

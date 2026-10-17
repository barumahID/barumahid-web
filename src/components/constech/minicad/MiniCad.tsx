"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang, useT } from "@/i18n/LangProvider";
import { BIAYA_PER_M2, ESTIMASI_CATATAN } from "@/data/estimasi";
import { JURURANCANG, waLink } from "@/data/site";
import { planToDxf } from "@/lib/denah/dxf";
import { briefFromBudget, estimate, rupiahSingkat, type Estimate } from "@/lib/denah/estimate";
import { buildPlan, floorArea, normalizeBrief } from "@/lib/denah/layout";
import { decodePlan, parseStory, planSummary } from "@/lib/denah/parse";
import { f01LinkFor, setSharedDenah } from "@/lib/denah/shared";
import { DEFAULT_BRIEF, EDITABLE_TYPES, LIMITS, ROOM_META, type Brief, type Plan, type Roof, type RoomType } from "@/lib/denah/types";
import Board, { EstimateBox, SPEK_ACUAN, Viewer3DLazy, specRows, type BoardView } from "./Board";
import ElevationSvg from "./ElevationSvg";
import PlanEditor from "./PlanEditor";
import PlanSvg from "./PlanSvg";
import View3D, { drawScene } from "./View3D";
import type { Viewer3DApi } from "./Viewer3D";
import type { Translate } from "./draw";

// miniCAD barumahID, versi board (arahan user Okt 2026; acuan tampilan: board "Seri Mahaksa" dan "Adaptive Hive").
// Kiri: input (cerita bebas dengan AI, atur sendiri, atau dari target budget) dan ringkasan estimasi + tombol kirim.
// Kanan: Board (denah, 3D, tampak, spesifikasi, estimasi), Denah 2D (bisa diedit), Tampak, dan 3D (three.js).
// Gambar konsep gratis; detail diarahkan ke paket gambar Jururancang. Kirim lewat form F01 yang sudah terisi.

type View = "board" | BoardView;
type Mode = "cerita" | "atur" | "budget";

const VIEWS: { id: View; label: string }[] = [
  { id: "board", label: "Board" },
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

async function svgImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  await img.decode();
  return img;
}

async function svgToPng(svg: SVGSVGElement, maxSide = 2600): Promise<Blob | null> {
  const vb = svg.viewBox.baseVal;
  const k = Math.min(2, maxSide / Math.max(vb.width, vb.height));
  const img = await svgImage(svg);
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

function fallback3d(plan: Plan, t: Translate, w = 1600, h = 1100) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) drawScene(ctx, plan, 1, 0, true, true, w, h, t);
  return c.toDataURL("image/png");
}

/** Satu gambar board (PNG) untuk diunduh atau dicetak */
async function composeBoard(o: { plan: Plan; t: Translate; lang: string; est: Estimate; budget: number | null; sheets: (SVGSVGElement | null)[]; elev: SVGSVGElement | null; shot: string | null }) {
  const { plan, t, lang, est, budget } = o;
  const Wc = 2400;
  const Hc = 1500;
  const c = document.createElement("canvas");
  c.width = Wc;
  c.height = Hc;
  const x = c.getContext("2d")!;
  x.fillStyle = "#f7f5f0";
  x.fillRect(0, 0, Wc, Hc);
  const panel = (px: number, py: number, pw: number, ph: number, title: string) => {
    x.fillStyle = "#ffffff";
    x.strokeStyle = "#dedad3";
    x.lineWidth = 2;
    x.beginPath();
    x.roundRect(px, py, pw, ph, 18);
    x.fill();
    x.stroke();
    x.fillStyle = "#141414";
    x.font = "800 22px Arial";
    x.fillText(title, px + 20, py + 38);
  };
  const fit = (img: CanvasImageSource, iw: number, ih: number, px: number, py: number, pw: number, ph: number) => {
    const k = Math.min(pw / iw, ph / ih);
    x.drawImage(img, px + (pw - iw * k) / 2, py + (ph - ih * k) / 2, iw * k, ih * k);
  };
  const wrap = (text: string, px: number, py: number, maxW: number, lh: number) => {
    let line = "";
    let y = py;
    text.split(" ").forEach((w) => {
      const test = line ? `${line} ${w}` : w;
      if (x.measureText(test).width > maxW && line) {
        x.fillText(line, px, y);
        line = w;
        y += lh;
      } else line = test;
    });
    if (line) x.fillText(line, px, y);
    return y + lh;
  };

  // Kolom kiri: identitas, spesifikasi, estimasi
  x.fillStyle = "#141414";
  x.font = "800 64px Arial";
  x.fillText("barumah", 60, 110);
  x.fillStyle = "#C53B3B";
  x.fillText("ID", 60 + x.measureText("barumah").width, 110);
  x.fillStyle = "#6B6B6B";
  x.font = "26px Arial";
  x.fillText(t("miniCAD · gambar konsep"), 62, 150);
  x.fillStyle = "#141414";
  x.font = "800 40px Arial";
  let y = wrap(t("Rumah {n} lantai · LB {a} m²", { n: plan.floors.length, a: est.area }).toUpperCase(), 60, 230, 560, 48);
  x.font = "24px Arial";
  y += 10;
  specRows(plan, t).forEach(([k, v]) => {
    x.fillStyle = "#6B6B6B";
    x.fillText(k, 60, y);
    x.fillStyle = "#141414";
    x.font = "700 24px Arial";
    y = wrap(v, 300, y, 330, 30);
    x.font = "24px Arial";
    y += 8;
  });
  const jt = (n: number) => Math.round(n / 1_000_000);
  x.fillStyle = "#141414";
  x.beginPath();
  x.roundRect(50, y + 10, 600, 300, 20);
  x.fill();
  x.fillStyle = "rgba(255,255,255,0.65)";
  x.font = "700 22px Arial";
  x.fillText(t("Estimasi biaya bangun").toUpperCase(), 80, y + 60);
  x.fillStyle = "#ffffff";
  x.font = "800 46px Arial";
  x.fillText(`${rupiahSingkat(est.min, lang)} – ${rupiahSingkat(est.max, lang)}`, 80, y + 120);
  x.font = "22px Arial";
  x.fillStyle = "rgba(255,255,255,0.7)";
  wrap(t("± Rp{a}–{b} juta/m² × {m} m², termasuk upah, alat, dan biaya lain", { a: jt(BIAYA_PER_M2.min), b: jt(BIAYA_PER_M2.max), m: est.area }), 80, y + 160, 540, 28);
  x.fillStyle = "#ffffff";
  x.font = "800 30px Arial";
  x.fillText(`${t("Durasi pengerjaan")}: ${t("± {a}–{b} bulan", { a: est.months[0], b: est.months[1] })}`, 80, y + 260);
  y += 350;
  if (budget) {
    x.fillStyle = "#141414";
    x.font = "700 24px Arial";
    x.fillText(`${t("Target budget")}: ${rupiahSingkat(budget, lang)}`, 60, y);
    y += 40;
  }
  x.fillStyle = "#6B6B6B";
  x.font = "20px Arial";
  y = wrap(t(ESTIMASI_CATATAN), 60, y, 580, 26);
  wrap(`${t("Spesifikasi acuan")}: ${SPEK_ACUAN.map((s) => t(s)).join(", ")}.`, 60, y + 10, 580, 26);
  x.fillStyle = "#C53B3B";
  x.font = "700 22px Arial";
  x.fillText(t("Gambar kerja detail: Jururancang Engineering Mahaksa"), 60, Hc - 50);

  // Kolom kanan: denah, 3D, tampak
  const gx = 700;
  const top = 50;
  const colW = plan.floors.length > 1 ? 520 : 620;
  for (let f = 0; f < plan.floors.length; f++) {
    const px = gx + f * (colW + 20);
    panel(px, top, colW, Hc - 100, t(`DENAH LANTAI ${f + 1}`));
    const svg = o.sheets[f];
    if (svg) {
      const img = await svgImage(svg);
      fit(img, img.width, img.height, px + 10, top + 60, colW - 20, Hc - 180);
    }
  }
  const rx = gx + plan.floors.length * (colW + 20);
  const rw = Wc - 50 - rx;
  panel(rx, top, rw, 680, t("3D ISOMETRIK"));
  if (o.shot) {
    const img = new Image();
    img.src = o.shot;
    await img.decode();
    fit(img, img.width, img.height, rx + 10, top + 55, rw - 20, 615);
  }
  panel(rx, top + 700, rw, Hc - 150 - 700, t("TAMPAK DEPAN"));
  if (o.elev) {
    const img = await svgImage(o.elev);
    fit(img, img.width, img.height, rx + 10, top + 755, rw - 20, Hc - 150 - 770);
  }
  return c;
}

export default function MiniCad({ initialCode }: { initialCode?: string | null }) {
  const t = useT() as Translate;
  const lang = useLang();
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF);
  const [plan, setPlan] = useState<Plan>(() => buildPlan(DEFAULT_BRIEF));
  const [hist, setHist] = useState<{ past: Plan[]; future: Plan[] }>({ past: [], future: [] });
  const [view, setView] = useState<View>("board");
  const [mode, setMode] = useState<Mode>("cerita");
  const [floor, setFloor] = useState(0);
  const [layers, setLayers] = useState({ dims: true, furniture: true, labels: true });
  const [selected, setSelected] = useState<string | null>(null);
  const [story, setStory] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "ai" | "local" | "budget"; text: string } | null>(null);
  const [s3, setS3] = useState(1);
  const [roofOn, setRoofOn] = useState(true);
  const [upperOn, setUpperOn] = useState(true);
  const [webglFailed, setWebglFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [budgetText, setBudgetText] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const exportRefs = useRef<(SVGSVGElement | null)[]>([]);
  const elevRef = useRef<SVGSVGElement>(null);
  const viewerApi = useRef<Viewer3DApi | null>(null);
  const raf = useRef(0);
  const budgetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onWebglError = useMemo(() => () => setWebglFailed(true), []);

  // Denah dari tautan (?denah=...)
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

  const est = useMemo(() => estimate(plan), [plan]);

  // Denah terbaru dibagikan ke tombol F01 di halaman (hanya setelah pengunjung membuat denahnya sendiri)
  useEffect(() => {
    setSharedDenah(touched ? { plan, city, budget } : null);
  }, [plan, city, budget, touched]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(budgetTimer.current);
    },
    [],
  );

  const play3d = () => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setS3(1);
      return;
    }
    let start = -1;
    const tick = (now: number) => {
      if (start < 0) start = now;
      const k = Math.min(1, (now - start) / 3200);
      setS3(k);
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    setS3(0);
    raf.current = requestAnimationFrame(tick);
  };

  const commit = (next: Plan) => {
    setHist((h) => ({ past: [...h.past.slice(-40), plan], future: [] }));
    setPlan(next);
    setTouched(true);
  };

  const drawFrom = (b: Brief, msg?: { kind: "ai" | "local" | "budget"; text: string }) => {
    const p = buildPlan(b);
    commit(p);
    setBrief(p.brief);
    setFloor(0);
    setSelected(null);
    setNote(msg ?? null);
    setView("board");
    play3d();
  };

  const fromStory = async () => {
    const text = story.trim();
    if (text.length < 8 || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/denah", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, current: brief }) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; brief?: Brief; notes?: string };
      if (res.ok && data.ok && data.brief) {
        drawFrom(normalizeBrief(data.brief), { kind: "ai", text: data.notes || t("Denah disusun AI dari ceritamu.") });
        return;
      }
      throw new Error("fallback");
    } catch {
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

  // Target budget: luas dan jumlah ruang langsung dihitung, denah digambar ulang otomatis
  const onBudget = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "").slice(0, 13);
    setBudgetText(digits ? new Intl.NumberFormat("id-ID").format(Number(digits)) : "");
    const n = Number(digits);
    const value = n >= 50_000_000 ? n : null;
    setBudget(value);
    clearTimeout(budgetTimer.current);
    if (!value) return;
    budgetTimer.current = setTimeout(() => {
      const b = briefFromBudget(value, { ...brief, targetArea: undefined });
      const p = buildPlan(b);
      drawFrom(b, {
        kind: "budget",
        text: t("Budget {b} cukup untuk rumah ± {a} m²: {kt} kamar tidur, {km} kamar mandi, {f} lantai.", {
          b: rupiahSingkat(value, lang),
          a: Math.round(p.floors.reduce((s, _, i) => s + floorArea(p, i), 0)),
          kt: b.bedrooms,
          km: b.bathrooms,
          f: b.floors,
        }),
      });
    }, 650);
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
  const setType = (id: string, type: RoomType) =>
    commit({ ...plan, floors: plan.floors.map((f) => f.map((cells) => cells.map((c) => (c.id === id ? { ...c, type } : c)))) });

  const open = (v: View, f?: number) => {
    setView(v);
    setSelected(null);
    if (f !== undefined) setFloor(f);
    if (v === "3d") play3d();
  };

  // ---- Unduh ----
  const shot3d = () => (webglFailed ? fallback3d(plan, t) : (viewerApi.current?.snapshot(1600, 1100) ?? fallback3d(plan, t)));
  const boardPng = async () => composeBoard({ plan, t, lang, est, budget, sheets: exportRefs.current, elev: elevRef.current, shot: shot3d() });
  const exportPng = async () => {
    if (view === "board") {
      (await boardPng()).toBlob((b) => b && download("barumahid-board-konsep.png", b), "image/png");
      return;
    }
    if (view === "3d") {
      const res = await fetch(shot3d());
      download("barumahid-3d.png", await res.blob());
      return;
    }
    const svg = view === "tampak" ? elevRef.current : exportRefs.current[floor];
    if (!svg) return;
    const blob = await svgToPng(svg);
    if (blob) download(`barumahid-${view === "tampak" ? "tampak-depan" : `denah-lt${floor + 1}`}.png`, blob);
  };
  const exportDxf = () => download("barumahid-denah-konsep.dxf", new Blob([planToDxf(plan, (s) => t(s))], { type: "application/dxf" }));
  const exportPdf = async () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const board = (await boardPng()).toDataURL("image/png");
    const fitSvg = (svg: SVGSVGElement | null) => (svg ? svg.outerHTML.replace(/ width="[\d.]+" height="[\d.]+"/, ' width="100%" height="100%"') : "");
    const sheets = [`<img src="${board}" alt="Board" />`, ...plan.floors.map((_, i) => fitSvg(exportRefs.current[i])), fitSvg(elevRef.current)];
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>barumahID miniCAD</title><style>@page{size:A4 landscape;margin:8mm}body{margin:0;font-family:Arial,sans-serif}.s{height:190mm;display:flex;align-items:center;justify-content:center;page-break-after:always}.s img{max-width:100%;max-height:100%}</style></head><body>${sheets.map((x) => `<div class="s">${x}</div>`).join("")}</body></html>`,
    );
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // Gambar tersembunyi untuk unduhan (tanpa elemen bantu edit)
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
        <ElevationSvg plan={plan} t={t} lang={lang} svgRef={elevRef} idPrefix="exe" />
      </div>
    ),
    [plan, t, lang],
  );

  const selRoom = selected ? plan.floors[floor]?.flat().find((c) => c.id === selected) : null;
  const selBand = selRoom ? plan.floors[floor].findIndex((cells) => cells.some((c) => c.id === selRoom.id)) : -1;
  const twoFloors = plan.floors.length > 1;
  const f01 = f01LinkFor(touched ? { plan, city, budget } : null);
  const jururancangMsg = t("Halo admin Jururancang, saya sudah coba denah konsep di website barumahID ({ringkasan}). Saya mau pesan gambar kerja detailnya.", { ringkasan: planSummary(plan) });

  const seg = (on: boolean) => `rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${on ? "bg-brand-dark text-white" : "bg-white text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40"}`;
  const tog = (on: boolean) => `flex h-9 items-center rounded-lg px-2.5 text-[12.5px] font-semibold transition-colors ${on ? "bg-brand-dark text-white" : "text-brand-dark hover:bg-brand-dark/10"}`;
  const dl = "rounded-full bg-white px-3 py-1 text-[12px] font-bold text-brand-dark ring-1 ring-brand-dark/15 hover:ring-brand-dark/40";
  const input = "w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-[14px] text-brand-dark placeholder:text-brand-mute focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/10";

  const landFields = (
    <div className="grid grid-cols-2 gap-3">
      {(["landW", "landD"] as const).map((k) => (
        <label key={k} className="block">
          <span className="mb-1 block text-[12.5px] font-semibold text-brand-dark">{k === "landW" ? t("Lebar lahan (m)") : t("Panjang lahan (m)")}</span>
          <input type="number" inputMode="decimal" step={0.5} min={LIMITS[k][0]} max={LIMITS[k][1]} value={brief[k]} onChange={(e) => setBrief({ ...brief, [k]: Number(e.target.value) })} className={input} />
        </label>
      ))}
    </div>
  );

  return (
    <div
      className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
      onKeyDown={(e) => {
        if (view !== "denah") return;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (e.key === "Escape") setSelected(null);
      }}
    >
      <div className="grid lg:grid-cols-[minmax(320px,380px)_1fr]">
        {/* ---------- Kiri: input ---------- */}
        <aside className="border-b border-brand-dark/10 bg-brand-cream p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-red">miniCAD barumahID</p>
          <h3 className="mt-1 text-[19px] font-extrabold leading-tight text-brand-dark">{t("Rancang rumahmu, lihat hasilnya langsung")}</h3>
          <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-white p-1 ring-1 ring-brand-dark/10" role="tablist" aria-label={t("Cara mengisi")}>
            {(
              [
                ["cerita", "Cerita"],
                ["atur", "Atur sendiri"],
                ["budget", "Dari budget"],
              ] as const
            ).map(([m, label]) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`rounded-lg px-2 py-2 text-[12.5px] font-bold transition-colors ${mode === m ? "bg-brand-dark text-white" : "text-brand-dark hover:bg-brand-dark/5"}`}>
                {t(label)}
              </button>
            ))}
          </div>

          {mode === "cerita" && (
            <div className="mt-4">
              <label htmlFor="minicad-cerita" className="block text-[13px] font-semibold text-brand-dark">
                {t("Ceritakan rumah yang kamu mau")}
              </label>
              <textarea
                id="minicad-cerita"
                rows={4}
                maxLength={900}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder={t("Contoh: lahan 8x15, rumah 2 lantai, 4 kamar tidur, 3 kamar mandi, carport 1 mobil, ada mushola dan tempat jemur, atap pelana.")}
                className={`mt-1.5 ${input} py-2.5`}
              />
              <button
                type="button"
                onClick={fromStory}
                disabled={busy || story.trim().length < 8}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? t("Sedang membaca ceritamu...") : t("Susun denah dari cerita")}
              </button>
            </div>
          )}

          {mode === "atur" && (
            <div className="mt-4 space-y-4">
              {landFields}
              <Field label={t("Jumlah lantai")}>
                {[1, 2].map((n) => (
                  <button key={n} type="button" className={seg(brief.floors === n)} onClick={() => setBrief({ ...brief, floors: n as 1 | 2 })}>
                    {t("{n} lantai", { n })}
                  </button>
                ))}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Stepper label={t("Jumlah kamar tidur")} value={brief.bedrooms} min={LIMITS.bedrooms[0]} max={LIMITS.bedrooms[1]} onChange={(v) => setBrief({ ...brief, bedrooms: v })} t={t} />
                <Stepper label={t("Jumlah kamar mandi")} value={brief.bathrooms} min={LIMITS.bathrooms[0]} max={LIMITS.bathrooms[1]} onChange={(v) => setBrief({ ...brief, bathrooms: v })} t={t} />
              </div>
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
              <Field label={t("Tambahan")}>
                {EXTRAS.map((x) => (
                  <button key={x.key} type="button" aria-pressed={brief[x.key]} className={seg(brief[x.key])} onClick={() => setBrief({ ...brief, [x.key]: !brief[x.key] })}>
                    {t(x.label)}
                  </button>
                ))}
              </Field>
              <button type="button" onClick={() => drawFrom(normalizeBrief({ ...brief, targetArea: undefined }))} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-brand-red">
                {touched ? t("Gambar ulang denah") : t("Gambar denah")}
              </button>
            </div>
          )}

          {mode === "budget" && (
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold text-brand-dark">{t("Target budget bangun (Rp)")}</span>
                <input type="text" inputMode="numeric" value={budgetText} onChange={(e) => onBudget(e.target.value)} placeholder="300.000.000" className={`${input} text-[16px] font-bold`} />
                <span className="mt-1 block text-[11.5px] text-brand-gray">{t("Luas rumah, kamar, dan lantai langsung disesuaikan. Di luar beli tanah.")}</span>
              </label>
              {landFields}
              <Field label={t("Carport")}>
                {[0, 1, 2].map((n) => (
                  <button key={n} type="button" className={seg(brief.carport === n)} onClick={() => setBrief({ ...brief, carport: n as 0 | 1 | 2 })}>
                    {n === 0 ? t("Tanpa") : t("{n} mobil", { n })}
                  </button>
                ))}
              </Field>
            </div>
          )}

          <label className="mt-4 block">
            <span className="mb-1 block text-[12.5px] font-semibold text-brand-dark">{t("Lokasi proyek (kota)")}</span>
            <input type="text" value={city} maxLength={80} onChange={(e) => setCity(e.target.value)} placeholder={t("Contoh: Padang")} className={input} />
          </label>

          <div className="mt-5 rounded-2xl bg-brand-dark p-4">
            <EstimateBox est={est} budget={budget} t={t} lang={lang} dark />
            <a href={f01} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-center text-[13px] font-bold text-white hover:bg-brand-red-dark">
              {t("Kirim ke tim lewat Survei Kebutuhan")} ↗
            </a>
            <p className="mt-2 text-center text-[11px] leading-snug text-white/55">{touched ? t("Isian proyek di form sudah terisi dari denah ini.") : t("Buat denahmu dulu supaya isian form ikut terisi.")}</p>
          </div>
        </aside>

        {/* ---------- Kanan: hasil ---------- */}
        <section className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-brand-dark/10 px-3 py-2 sm:px-4">
            <div className="flex gap-1" role="tablist" aria-label={t("Tampilan hasil")}>
              {VIEWS.map((v) => (
                <button key={v.id} type="button" role="tab" aria-selected={view === v.id} onClick={() => open(v.id)} className={tog(view === v.id)}>
                  {t(v.label)}
                </button>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              <span className="text-[11.5px] font-semibold text-brand-gray">{t("Unduh")}</span>
              <button type="button" onClick={() => void exportPng()} className={dl}>
                PNG
              </button>
              <button type="button" onClick={() => void exportPdf()} className={dl}>
                PDF
              </button>
              <button type="button" onClick={exportDxf} title={t("Bisa dibuka di AutoCAD")} className={dl}>
                DXF
              </button>
            </div>
          </div>

          {note && (
            <div className="flex items-start gap-2 border-b border-brand-dark/10 bg-[#fbfaf7] px-3 py-2 text-[12.5px] leading-snug text-brand-dark sm:px-4">
              <span className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-black ${note.kind === "ai" ? "bg-brand-red text-white" : "bg-brand-dark/10 text-brand-dark"}`}>
                {note.kind === "ai" ? "AI" : note.kind === "budget" ? t("Budget") : t("Otomatis")}
              </span>
              <span className="flex-1">{note.text}</span>
              <button type="button" aria-label={t("Tutup")} onClick={() => setNote(null)} className="shrink-0 px-1 text-brand-mute hover:text-brand-dark">
                ×
              </button>
            </div>
          )}

          {view === "board" && (
            <Board
              plan={plan}
              t={t}
              lang={lang}
              est={est}
              budget={budget}
              sample={!touched}
              s3={s3}
              roofOn={roofOn}
              upperOn={upperOn}
              webglFailed={webglFailed}
              onWebglError={onWebglError}
              viewerApi={viewerApi}
              onOpen={open}
            />
          )}

          {(view === "denah" || view === "tampak") && (
            <div className="h-[560px] sm:h-[680px]">
              <PlanEditor
                plan={plan}
                floor={floor}
                layers={layers}
                t={t}
                lang={lang}
                mode={view}
                selected={selected}
                onSelect={setSelected}
                onBeginEdit={() => {
                  setHist((h) => ({ past: [...h.past.slice(-40), plan], future: [] }));
                  setTouched(true);
                }}
                onLive={setPlan}
                toolbar={
                  view === "denah" ? (
                    <>
                      {twoFloors &&
                        [0, 1].map((f) => (
                          <button
                            key={f}
                            type="button"
                            className={tog(floor === f)}
                            onClick={() => {
                              setFloor(f);
                              setSelected(null);
                            }}
                          >
                            {t("Lt {n}", { n: f + 1 })}
                          </button>
                        ))}
                      {(
                        [
                          ["dims", "Ukuran"],
                          ["furniture", "Perabot"],
                          ["labels", "Label"],
                        ] as const
                      ).map(([k, label]) => (
                        <button key={k} type="button" aria-pressed={layers[k]} className={tog(layers[k])} onClick={() => setLayers({ ...layers, [k]: !layers[k] })}>
                          {t(label)}
                        </button>
                      ))}
                      <button type="button" title={t("Urungkan (Ctrl+Z)")} aria-label={t("Urungkan")} disabled={!hist.past.length} onClick={undo} className={`${tog(false)} disabled:opacity-30`}>
                        ↶
                      </button>
                      <button type="button" title={t("Ulangi (Ctrl+Shift+Z)")} aria-label={t("Ulangi")} disabled={!hist.future.length} onClick={redo} className={`${tog(false)} disabled:opacity-30`}>
                        ↷
                      </button>
                    </>
                  ) : null
                }
                overlay={
                  selRoom && view === "denah" ? (
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
                          <select value={selRoom.type} onChange={(e) => setType(selRoom.id, e.target.value as RoomType)} className="w-full rounded-lg border border-brand-dark/15 bg-white px-2 py-1.5 text-[13px] text-brand-dark">
                            {[...new Set([selRoom.type, ...EDITABLE_TYPES])].map((ty) => (
                              <option key={ty} value={ty}>
                                {t(ROOM_META[ty].label)}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </div>
                  ) : null
                }
              />
            </div>
          )}

          {view === "3d" && (
            <>
              <div className="relative h-[480px] w-full bg-[#eef0ec] sm:h-[600px]">
                {webglFailed ? (
                  <View3D plan={plan} s={s3} showRoof={roofOn} showUpper={upperOn} t={t} />
                ) : (
                  <Viewer3DLazy plan={plan} s={s3} roof={roofOn} upper={upperOn} apiRef={viewerApi} onError={onWebglError} label={t("Visual 3D rumah konsep")} />
                )}
                <p className="pointer-events-none absolute bottom-2 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[11.5px] font-semibold text-brand-gray">{t("Geser untuk memutar")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-brand-dark/10 px-3 py-3 sm:px-4">
                <button type="button" onClick={play3d} className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-brand-red">
                  ▶ {t("Putar")}
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
                  <button type="button" aria-pressed={roofOn} className={tog(roofOn)} onClick={() => setRoofOn(!roofOn)}>
                    {t("Atap")}
                  </button>
                  {twoFloors && (
                    <button type="button" aria-pressed={upperOn} className={tog(upperOn)} onClick={() => setUpperOn(!upperOn)}>
                      {t("Lantai 2")}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {(view === "denah" || view === "tampak") && (
            <div className="border-t border-brand-dark/10 px-3 py-2.5 text-[12px] leading-relaxed text-brand-gray sm:px-4">
              {view === "denah" && <p>{t("Klik ruang untuk ganti fungsinya. Geser garis dinding untuk ubah ukuran. Ctrl + scroll atau dua jari untuk zoom.")}</p>}
              {plan.warnings.map((w, i) => (
                <p key={i} className="mt-1 font-semibold text-build">
                  {t(w.msg, Object.fromEntries(Object.entries(w.vars ?? {}).map(([k, v]) => [k, typeof v === "string" ? t(v) : v])))}
                </p>
              ))}
            </div>
          )}

          {/* Ajakan ke Jururancang */}
          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-brand-dark/10 bg-brand-cream px-3 py-3 sm:px-4">
            <p className="min-w-[200px] flex-1 text-[12.5px] leading-snug text-brand-gray">
              <span className="font-bold text-brand-dark">{t("Ini gambar konsep gratis.")}</span>{" "}
              {t("Untuk gambar kerja lengkap (denah detail, tampak empat sisi, potongan, detail, dan struktur), pesan paket gambar bersama partner kami, Jururancang.")}
            </p>
            <a href="#harga" className="rounded-full bg-brand-dark px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-brand-red">
              {t("Lihat paket gambar")}
            </a>
            <a href={waLink(jururancangMsg, JURURANCANG.wa)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#1f9d55] px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-[#188a49]">
              {t("Chat admin Jururancang")}
            </a>
          </div>
        </section>
      </div>
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
      <div className="inline-flex items-center rounded-lg bg-white ring-1 ring-brand-dark/15">
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

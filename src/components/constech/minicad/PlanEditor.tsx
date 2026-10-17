"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { bandOffsets } from "@/lib/denah/geometry";
import { clamp, r2 } from "@/lib/denah/layout";
import type { Plan } from "@/lib/denah/types";
import { S, type Layers, type Translate } from "./draw";
import ElevationSvg from "./ElevationSvg";
import PlanSvg, { PLAN_M, type Handle } from "./PlanSvg";

// Area gambar yang bisa digeser, di-zoom (tombol, Ctrl/⌘ + scroll, dua jari), dan diedit (klik ruang, geser dinding).

type Zoom = { k: number; x: number; y: number };
const FIT: Zoom = { k: 1, x: 0, y: 0 };

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

export default function PlanEditor({
  plan,
  floor,
  layers,
  t,
  lang,
  mode,
  selected,
  onSelect,
  onBeginEdit,
  onLive,
  toolbar,
  overlay,
}: {
  plan: Plan;
  floor: number;
  layers: Layers;
  t: Translate;
  lang: string;
  mode: "denah" | "tampak";
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** Sebelum dinding mulai digeser (simpan riwayat untuk urungkan) */
  onBeginEdit: () => void;
  /** Denah berubah saat dinding digeser */
  onLive: (p: Plan) => void;
  toolbar?: ReactNode;
  overlay?: ReactNode;
}) {
  const [zoom, setZoom] = useState<Zoom>(FIT);
  const [prevMode, setPrevMode] = useState(mode);
  if (prevMode !== mode) {
    setPrevMode(mode);
    setZoom(FIT);
  }
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ h: Handle; base: Plan } | null>(null);
  const pan = useRef<{ x: number; y: number; zx: number; zy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number; cx: number; cy: number; zx: number; zy: number } | null>(null);

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

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const box = el.getBoundingClientRect();
      const k = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const cx = e.clientX - box.left;
      const cy = e.clientY - box.top;
      setZoom((z) => {
        const nk = clamp(z.k * k, 0.6, 6);
        return { k: nk, x: cx - (cx - z.x) * (nk / z.k), y: cy - (cy - z.y) * (nk / z.k) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onHandleDown = (h: Handle, e: ReactPointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { h, base: plan };
    onBeginEdit();
    onSelect(null);
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
      onLive(applyDrag(base, h, floor, toPlan(e)));
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
    const p = pan.current;
    if (p && e.buttons) setZoom((z) => ({ ...z, x: p.zx + e.clientX - p.x, y: p.zy + e.clientY - p.y }));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    drag.current = null;
    pan.current = null;
  };

  const btn = "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[12.5px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/10";

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-dark/10 px-2 py-2 sm:px-3" role="toolbar" aria-label={t("Alat denah")}>
        {toolbar}
        <div className="ml-auto flex items-center gap-0.5">
          <button type="button" aria-label={t("Perkecil")} onClick={() => zoomAt(1 / 1.25)} className={btn}>
            −
          </button>
          <button type="button" aria-label={t("Perbesar")} onClick={() => zoomAt(1.25)} className={btn}>
            +
          </button>
          <button type="button" onClick={() => setZoom(FIT)} className={btn}>
            {t("Pas")}
          </button>
        </div>
      </div>
      <div
        ref={boxRef}
        className="relative min-h-0 flex-1 touch-pan-y overflow-hidden bg-[#f7f5f1] select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={(e) => e.buttons === 0 && onUp(e)}
      >
        <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.k})` }}>
          {mode === "denah" ? (
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
              onRoomDown={(id) => onSelect(id)}
              onHandleDown={onHandleDown}
            />
          ) : (
            <ElevationSvg plan={plan} t={t} lang={lang} className="h-full w-full" idPrefix="live-e" />
          )}
        </div>
        {overlay}
      </div>
    </div>
  );
}

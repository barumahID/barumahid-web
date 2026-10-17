import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { floorGeometry, solidWallPieces, WALL_T, type FloorGeom, type Opening, type RoomRect } from "@/lib/denah/geometry";
import { floorArea } from "@/lib/denah/layout";
import { ROOM_META, isOpen, type Plan } from "@/lib/denah/types";
import { FONT, INK, RED, S, THIN, fmt, tanggal, type Layers, type Translate } from "./draw";

// Denah konsep satu lantai sebagai SVG bergaya gambar CAD: dinding tebal, pintu dengan ayunan, jendela tiga garis,
// tangga, perabot sederhana, ukuran, dan kop gambar. Elemen bantu edit (pegangan dinding, sorotan) diberi
// data-ui supaya dibuang saat diekspor.

export type Handle = { kind: "v"; band: number; index: number } | { kind: "h"; band: number };

export const PLAN_M = { L: 170, R: 70, T: 170, road: 110, title: 160 };

export function planSize(plan: Plan) {
  return {
    w: PLAN_M.L + plan.brief.landW * S + PLAN_M.R,
    h: PLAN_M.T + plan.brief.landD * S + PLAN_M.road + PLAN_M.title,
  };
}

const FURN = "#8d8a85";

export default function PlanSvg({
  plan,
  floor,
  layers,
  t,
  lang,
  selectedId,
  interactive = false,
  onRoomDown,
  onHandleDown,
  svgRef,
  idPrefix = "p",
  className,
}: {
  plan: Plan;
  floor: number;
  layers: Layers;
  t: Translate;
  lang: string;
  selectedId?: string | null;
  interactive?: boolean;
  onRoomDown?: (id: string, e: ReactPointerEvent) => void;
  onHandleDown?: (h: Handle, e: ReactPointerEvent) => void;
  svgRef?: React.Ref<SVGSVGElement>;
  /** Awalan id pola SVG, unik per gambar di halaman */
  idPrefix?: string;
  className?: string;
}) {
  const rumput = `${idPrefix}-rumput`;
  const dak = `${idPrefix}-dak`;
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const g = floorGeometry(plan, floor);
  const size = planSize(plan);
  const X = (x: number) => PLAN_M.L + x * S;
  const Y = (y: number) => PLAN_M.T + (D - y) * S;
  /** Persegi dalam koordinat denah (x, y = sudut depan kiri) */
  const box = (x: number, y: number, w: number, d: number) => ({ x: X(x), y: Y(y + d), width: w * S, height: d * S });

  const rooms = g.rooms;
  const doorsOf = (r: RoomRect) => g.openings.filter((o) => o.room === r.id && o.kind !== "window");

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size.w} ${size.h}`}
      width={size.w}
      height={size.h}
      fontFamily={FONT}
      className={className}
      style={{ background: "#ffffff" }}
    >
      <rect x={0} y={0} width={size.w} height={size.h} fill="#ffffff" />

      {/* Batas lahan */}
      <rect {...box(0, 0, W, D)} fill="none" stroke={THIN} strokeWidth={2} strokeDasharray="28 8 4 8" />

      {/* Isi ruang dan halaman */}
      {rooms.map((r) => {
        if (r.type === "void") {
          return floor > 0 && r.kind !== "front" && r.kind !== "back" ? (
            <g key={r.id}>
              <rect {...box(r.x, r.y, r.w, r.d)} fill={`url(#${dak})`} stroke="none" />
            </g>
          ) : null;
        }
        if (r.type === "balkon") {
          const d = Math.min(1.2, r.d);
          return (
            <g key={r.id}>
              <rect {...box(r.x, r.y + r.d - d, r.w, d)} fill={ROOM_META.balkon.fill} />
              <line x1={X(r.x)} y1={Y(r.y + r.d - d) - 4} x2={X(r.x + r.w)} y2={Y(r.y + r.d - d) - 4} stroke={INK} strokeWidth={3} />
              <line x1={X(r.x)} y1={Y(r.y + r.d - d)} x2={X(r.x + r.w)} y2={Y(r.y + r.d - d)} stroke={INK} strokeWidth={3} />
              <line x1={X(r.x)} y1={Y(r.y + r.d - d)} x2={X(r.x)} y2={Y(r.y + r.d)} stroke={INK} strokeWidth={3} />
              <line x1={X(r.x + r.w)} y1={Y(r.y + r.d - d)} x2={X(r.x + r.w)} y2={Y(r.y + r.d)} stroke={INK} strokeWidth={3} />
            </g>
          );
        }
        return <rect key={r.id} {...box(r.x, r.y, r.w, r.d)} fill={r.type === "taman" ? `url(#${rumput})` : ROOM_META[r.type].fill} />;
      })}

      <defs>
        <pattern id={rumput} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={ROOM_META.taman.fill} />
          <path d="M4 18l3-6 3 6M14 10l3-6 3 6" fill="none" stroke="#9fb48e" strokeWidth="1.2" />
        </pattern>
        <pattern id={dak} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="#d8d4cd" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Perabot */}
      {layers.furniture && rooms.map((r) => <g key={`f-${r.id}`}>{furniture(r, doorsOf(r), box, X, Y, floor, dak)}</g>)}

      {/* Tangga */}
      {rooms
        .filter((r) => r.type === "tangga")
        .map((r) => (
          <g key={`s-${r.id}`}>{stairs(r, X, Y, floor === 0 ? t("NAIK") : t("TURUN"))}</g>
        ))}

      {/* Dinding padat */}
      {solidWallPieces(g).map((w, i) => (
        <line
          key={`w${i}`}
          x1={X(w.x1)}
          y1={Y(w.y1)}
          x2={X(w.x2)}
          y2={Y(w.y2)}
          stroke={INK}
          strokeWidth={(w.ext ? WALL_T.ext : WALL_T.int) * S}
          strokeLinecap="square"
        />
      ))}

      {/* Pintu dan jendela */}
      {g.openings.map((o, i) => (
        <g key={`o${i}`}>{openingShape(o, X, Y)}</g>
      ))}

      {/* Label ruang */}
      {layers.labels &&
        rooms.map((r) => {
          if (r.type === "void" || r.type === "tangga") return null;
          const meta = ROOM_META[r.type];
          const vis = r.type === "balkon" ? { y: r.y + r.d - Math.min(1.2, r.d), d: Math.min(1.2, r.d) } : { y: r.y, d: r.d };
          const fs = Math.max(11, Math.min(17, (r.w * S) / (t(meta.label).length * 0.62)));
          const cx = X(r.x + r.w / 2);
          const cy = Y(vis.y + vis.d / 2);
          return (
            <g key={`l-${r.id}`} textAnchor="middle" pointerEvents="none">
              <text x={cx} y={cy - 2} fontSize={fs} fontWeight={700} fill={INK} letterSpacing={0.6}>
                {t(meta.label).toUpperCase()}
              </text>
              {!isOpen(r.type) || r.type === "carport" || r.type === "teras" ? (
                <text x={cx} y={cy + fs + 2} fontSize={Math.max(10, fs - 3)} fill={THIN}>
                  {fmt(r.w)} × {fmt(vis.d)}
                </text>
              ) : null}
            </g>
          );
        })}

      {/* Sorotan ruang terpilih */}
      {selectedId &&
        rooms
          .filter((r) => r.id === selectedId)
          .map((r) => <rect key="sel" data-ui="1" {...box(r.x, r.y, r.w, r.d)} fill="rgba(197,59,59,0.12)" stroke={RED} strokeWidth={4} strokeDasharray="14 8" pointerEvents="none" />)}

      {/* Ukuran */}
      {layers.dims && dimensions(plan, g, X, Y, floor)}

      {/* Jalan */}
      <line x1={X(-0.8)} y1={Y(0) + 34} x2={X(W + 0.4)} y2={Y(0) + 34} stroke={THIN} strokeWidth={2} />
      <text x={X(W / 2)} y={Y(0) + 74} textAnchor="middle" fontSize={20} letterSpacing={6} fill={THIN} fontWeight={700}>
        {t("JALAN")}
      </text>

      {titleBlock(size, t(`DENAH LANTAI ${floor + 1}`), `${t("Lahan {w} × {d} m", { w: fmt(W), d: fmt(D) })} · ${t("Luas lantai ± {a} m²", { a: floorArea(plan, floor) })}`, t, lang)}

      {/* Bantu edit: klik ruang dan geser dinding */}
      {interactive && (
        <g data-ui="1">
          {rooms
            .filter((r) => r.type !== "void")
            .map((r) => (
              <rect
                key={`hit-${r.id}`}
                {...box(r.x, r.y, r.w, r.d)}
                fill="transparent"
                onPointerDown={(e) => onRoomDown?.(r.id, e)}
                style={{ cursor: "pointer" }}
              />
            ))}
          {handles(plan, floor).map((h, i) => {
            const line =
              h.kind === "h"
                ? { x1: X(0), y1: Y(g.bandY[h.band]), x2: X(W), y2: Y(g.bandY[h.band]) }
                : (() => {
                    const r = rooms.filter((x) => x.band === h.band).sort((a, b) => a.x - b.x)[h.index];
                    return { x1: X(r.x), y1: Y(r.y), x2: X(r.x), y2: Y(r.y + r.d) };
                  })();
            return (
              <line
                key={`h${i}`}
                {...line}
                stroke="rgba(197,59,59,0)"
                strokeWidth={34}
                className="transition-[stroke] hover:stroke-[rgba(197,59,59,0.35)]"
                style={{ cursor: h.kind === "h" ? "row-resize" : "col-resize", touchAction: "none" }}
                onPointerDown={(e) => onHandleDown?.(h, e)}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}

/** Dinding yang boleh digeser: batas antar pita (berlaku semua lantai) dan batas antar sel dalam satu pita. */
export function handles(plan: Plan, floor: number): Handle[] {
  const out: Handle[] = [];
  for (let k = 1; k < plan.bands.length; k++) out.push({ kind: "h", band: k });
  plan.floors[floor]?.forEach((cells, bi) => {
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1].type;
      const b = cells[i].type;
      if (a === "tangga" || b === "tangga") continue;
      out.push({ kind: "v", band: bi, index: i });
    }
  });
  return out;
}

function arcPath(hx: number, hy: number, lx: number, ly: number, ox: number, oy: number, r: number) {
  const cross = (lx - hx) * (oy - hy) - (ly - hy) * (ox - hx);
  return `M${lx} ${ly}A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${ox} ${oy}`;
}

function openingShape(o: Opening, X: (x: number) => number, Y: (y: number) => number): ReactNode {
  const pt = (along: number, off: number) => (o.dir === "h" ? [X(along), Y(o.at + off)] : [X(o.at + off), Y(along)]);
  if (o.kind === "open") {
    const [x1, y1] = pt(o.s, 0);
    const [x2, y2] = pt(o.e, 0);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={FURN} strokeWidth={1.5} strokeDasharray="6 6" />;
  }
  if (o.kind === "window") {
    const t = WALL_T.ext / 2;
    return (
      <g stroke={INK} strokeWidth={1.6}>
        {[-t, 0, t].map((off) => {
          const [x1, y1] = pt(o.s, off);
          const [x2, y2] = pt(o.e, off);
          return <line key={off} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {[o.s, o.e].map((a) => {
          const [x1, y1] = pt(a, -t);
          const [x2, y2] = pt(a, t);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2.5} />;
        })}
      </g>
    );
  }
  const width = o.e - o.s;
  const leaf = (hinge: number, other: number, len: number, k: string) => {
    const [hx, hy] = pt(hinge, 0);
    const [lx, ly] = pt(hinge, o.side * len);
    const [ox, oy] = pt(hinge + Math.sign(other - hinge) * len, 0);
    return (
      <g key={k}>
        <line x1={hx} y1={hy} x2={lx} y2={ly} stroke={INK} strokeWidth={3} />
        <path d={arcPath(hx, hy, lx, ly, ox, oy, len * S)} fill="none" stroke={THIN} strokeWidth={1.4} />
      </g>
    );
  };
  if (o.kind === "main" && width >= 1.1) return <g>{[leaf(o.s, o.e, width / 2, "a"), leaf(o.e, o.s, width / 2, "b")]}</g>;
  return o.hingeStart ? leaf(o.s, o.e, width, "a") : leaf(o.e, o.s, width, "a");
}

function stairs(r: RoomRect, X: (x: number) => number, Y: (y: number) => number, label: string) {
  const mid = r.x + r.w / 2;
  const lines: ReactNode[] = [];
  const step = 0.27;
  const y0 = r.y + 0.9;
  const y1 = r.y + r.d - 0.1;
  for (let y = y0; y <= y1 + 1e-6; y += step) {
    lines.push(<line key={y} x1={X(r.x + 0.08)} y1={Y(y)} x2={X(r.x + r.w - 0.08)} y2={Y(y)} stroke={THIN} strokeWidth={1.4} />);
  }
  const arrow = `M${X(r.x + r.w / 4)} ${Y(r.y + 0.6)}L${X(r.x + r.w / 4)} ${Y(r.y + r.d - 0.45)}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + r.d - 0.45)}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + 0.9)}`;
  return (
    <>
      <rect x={X(r.x)} y={Y(r.y + r.d)} width={r.w * S} height={r.d * S} fill={ROOM_META.tangga.fill} />
      {lines}
      <line x1={X(mid)} y1={Y(y0)} x2={X(mid)} y2={Y(y1)} stroke={THIN} strokeWidth={2} />
      <path d={arrow} fill="none" stroke={INK} strokeWidth={2} />
      <path d={`M${X(r.x + (3 * r.w) / 4) - 9} ${Y(r.y + 0.9) - 16}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + 0.9)}L${X(r.x + (3 * r.w) / 4) + 9} ${Y(r.y + 0.9) - 16}`} fill="none" stroke={INK} strokeWidth={2} />
      <text x={X(mid)} y={Y(r.y + 0.35)} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK} letterSpacing={1}>
        {label}
      </text>
    </>
  );
}

type Box = (x: number, y: number, w: number, d: number) => { x: number; y: number; width: number; height: number };

function furniture(r: RoomRect, doors: Opening[], box: Box, X: (x: number) => number, Y: (y: number) => number, floor: number, dak: string): ReactNode {
  const p = { fill: "#ffffff", stroke: FURN, strokeWidth: 1.6 } as const;
  const line = { stroke: FURN, strokeWidth: 1.4 } as const;
  // Sisi jauh dari pintu: perabot ditempel ke dinding yang tidak berpintu
  const onWall = (y: number) => doors.filter((o) => o.dir === "h" && Math.abs(o.at - y) < 1e-6);
  const doorBack = onWall(r.y + r.d).length > 0 && onWall(r.y).length === 0;
  const farY = (depth: number) => (doorBack ? r.y + 0.05 : r.y + r.d - depth - 0.05);
  switch (r.type) {
    case "kamar_utama":
    case "kamar": {
      const bw = Math.min(r.type === "kamar_utama" ? 1.6 : 1.2, r.w - 0.6);
      const bd = Math.min(2, r.d - 0.7);
      if (bw < 0.8 || bd < 1.4) return null;
      // Geser kasur menjauhi pintu di dinding yang sama
      const sameWall = onWall(doorBack ? r.y : r.y + r.d).map((o) => (o.s + o.e) / 2);
      const center = r.x + r.w / 2;
      const away = sameWall.length ? (sameWall[0] > center ? -1 : 1) : 0;
      const bx = Math.min(r.x + r.w - bw - 0.1, Math.max(r.x + 0.1, center - bw / 2 + away * Math.max(0, (r.w - bw) / 2 - 0.1)));
      const by = farY(bd);
      const headTop = !doorBack;
      const py = headTop ? by + bd - 0.38 : by + 0.08;
      return (
        <>
          <rect {...box(bx, by, bw, bd)} {...p} rx={4} />
          <rect {...box(bx + 0.08, py, bw / 2 - 0.12, 0.3)} {...p} rx={6} />
          <rect {...box(bx + bw / 2 + 0.04, py, bw / 2 - 0.12, 0.3)} {...p} rx={6} />
          <line x1={X(bx)} y1={Y(headTop ? by + bd - 0.6 : by + 0.6)} x2={X(bx + bw)} y2={Y(headTop ? by + bd - 0.6 : by + 0.6)} {...line} />
          {r.w - bw >= 1.3 && <rect {...box(r.x + 0.05, headTop ? r.y + r.d - 0.6 : r.y + 0.05, 0.55, 0.55)} {...p} />}
        </>
      );
    }
    case "km": {
      if (r.w < 1 || r.d < 1.4) return null;
      const ty = farY(0.7);
      const tx = r.x + 0.15;
      return (
        <>
          <rect {...box(tx, doorBack ? ty : ty + 0.5, 0.42, 0.2)} {...p} rx={3} />
          <ellipse cx={X(tx + 0.21)} cy={Y(doorBack ? ty + 0.45 : ty + 0.25)} rx={16} ry={22} {...p} />
          {r.w >= 1.6 && r.d >= 2 && (
            <>
              <rect {...box(r.x + r.w - 0.95, doorBack ? r.y + 0.05 : r.y + r.d - 0.95, 0.9, 0.9)} fill="none" stroke={FURN} strokeWidth={1.4} />
              <circle cx={X(r.x + r.w - 0.5)} cy={Y(doorBack ? r.y + 0.5 : r.y + r.d - 0.5)} r={5} {...p} />
            </>
          )}
        </>
      );
    }
    case "dapur": {
      const cy = farY(0.6);
      return (
        <>
          <rect {...box(r.x + 0.05, cy, r.w - 0.1, 0.6)} {...p} />
          <rect {...box(r.x + 0.25, cy + 0.12, 0.5, 0.36)} {...p} rx={6} />
          {r.w >= 1.8 && (
            <>
              <circle cx={X(r.x + r.w - 0.45)} cy={Y(cy + 0.3)} r={11} {...p} />
              <circle cx={X(r.x + r.w - 0.85)} cy={Y(cy + 0.3)} r={11} {...p} />
            </>
          )}
        </>
      );
    }
    case "keluarga":
    case "santai":
    case "tamu_keluarga": {
      if (r.w < 2.6 || r.d < 2.6) return null;
      const sw = Math.min(2.2, r.w * 0.45);
      const sx = r.x + 0.3;
      const sy = r.y + r.d / 2 - 0.4;
      const dining = r.type === "keluarga" && r.w >= 4.4;
      return (
        <>
          <rect {...box(sx, sy - 0.45, 0.8, sw)} {...p} rx={8} />
          <rect {...box(sx + 1.15, sy - 0.15, 0.55, 1)} {...p} rx={4} />
          {dining && (
            <>
              <rect {...box(r.x + r.w - 1.7, r.y + r.d / 2 - 0.45, 1.2, 0.9)} {...p} rx={4} />
              {[-0.35, 0.35].map((dx) =>
                [0.62, -0.62].map((dy) => <rect key={`${dx}${dy}`} {...box(r.x + r.w - 1.1 + dx - 0.2, r.y + r.d / 2 + dy - 0.17, 0.4, 0.34)} {...p} rx={4} />),
              )}
            </>
          )}
        </>
      );
    }
    case "tamu": {
      if (r.w < 2.4 || r.d < 2.4) return null;
      const cx = r.x + r.w / 2;
      const cy = r.y + r.d / 2;
      return (
        <>
          <rect {...box(cx - 0.8, cy + 0.45, 1.6, 0.7)} {...p} rx={8} />
          <rect {...box(cx - 0.4, cy - 0.15, 0.8, 0.45)} {...p} rx={4} />
          <rect {...box(cx - 0.7, cy - 0.95, 0.65, 0.65)} {...p} rx={8} />
          <rect {...box(cx + 0.05, cy - 0.95, 0.65, 0.65)} {...p} rx={8} />
        </>
      );
    }
    case "mushola":
      return [0, 1]
        .filter((i) => r.w >= 0.75 * (i + 1) + 0.2)
        .map((i) => (
          <g key={i}>
            <rect {...box(r.x + 0.2 + i * 0.75, r.y + r.d / 2 - 0.55, 0.6, 1.1)} {...p} rx={3} />
            <path d={`M${X(r.x + 0.3 + i * 0.75)} ${Y(r.y + r.d / 2 + 0.4)}Q${X(r.x + 0.5 + i * 0.75)} ${Y(r.y + r.d / 2 + 0.55)} ${X(r.x + 0.7 + i * 0.75)} ${Y(r.y + r.d / 2 + 0.4)}`} fill="none" {...line} />
          </g>
        ));
    case "kerja": {
      const dy = farY(0.6);
      return (
        <>
          <rect {...box(r.x + 0.2, dy, Math.min(1.4, r.w - 0.4), 0.6)} {...p} />
          <rect {...box(r.x + 0.55, doorBack ? dy + 0.75 : dy - 0.55, 0.45, 0.45)} {...p} rx={8} />
        </>
      );
    }
    case "gudang":
      return (
        <>
          <rect {...box(r.x + 0.05, farY(0.4), r.w - 0.1, 0.4)} fill={`url(#${dak})`} stroke={FURN} strokeWidth={1.4} />
        </>
      );
    case "carport": {
      if (r.w < 2 || r.d < 4.3) return null;
      const cars = r.w >= 5 ? 2 : 1;
      return Array.from({ length: cars }, (_, i) => {
        const cx = r.x + ((i + 0.5) * r.w) / cars - 0.9;
        const cy = r.y + (r.d - 4.3) / 2;
        return (
          <g key={i}>
            <rect {...box(cx, cy, 1.8, 4.3)} fill="none" stroke={FURN} strokeWidth={1.6} rx={30} />
            <rect {...box(cx + 0.18, cy + 1.3, 1.44, 0.6)} fill="none" stroke={FURN} strokeWidth={1.2} rx={10} />
            <rect {...box(cx + 0.18, cy + 2.9, 1.44, 0.5)} fill="none" stroke={FURN} strokeWidth={1.2} rx={10} />
          </g>
        );
      });
    }
    case "taman": {
      if (floor > 0 || r.w < 1.2 || r.d < 1) return null;
      const n = Math.max(1, Math.min(3, Math.floor(r.w / 2.5)));
      return Array.from({ length: n }, (_, i) => {
        const cx = X(r.x + ((i + 0.5) * r.w) / n);
        const cy = Y(r.y + r.d / 2);
        const rr = Math.min(55, (Math.min(r.w / n, r.d) * S) / 2.6);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={rr} fill="none" stroke="#7d9a6b" strokeWidth={1.6} strokeDasharray="7 5" />
            <circle cx={cx} cy={cy} r={4} fill="#7d9a6b" />
          </g>
        );
      });
    }
    case "jemur":
      return [0.3, 0.6].map((k) => (
        <line key={k} x1={X(r.x + 0.2)} y1={Y(r.y + r.d * k)} x2={X(r.x + r.w - 0.2)} y2={Y(r.y + r.d * k)} stroke={FURN} strokeWidth={1.4} strokeDasharray="10 6" />
      ));
    default:
      return null;
  }
}

function dimLine(x1: number, y1: number, x2: number, y2: number, label: string, key: string, vertical = false) {
  const tick = (x: number, y: number) => <line x1={x - 7} y1={y + 7} x2={x + 7} y2={y - 7} stroke={INK} strokeWidth={1.6} />;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g key={key}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={THIN} strokeWidth={1.2} />
      {tick(x1, y1)}
      {tick(x2, y2)}
      {vertical ? (
        <text x={mx - 8} y={my} fontSize={14} fill={INK} textAnchor="middle" transform={`rotate(-90 ${mx - 8} ${my})`}>
          {label}
        </text>
      ) : (
        <text x={mx} y={my - 8} fontSize={14} fill={INK} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

function dimensions(plan: Plan, g: FloorGeom, X: (x: number) => number, Y: (y: number) => number, floor: number) {
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const out: ReactNode[] = [];
  // Rantai lebar di atas: sel baris paling belakang di lantai ini (atau lantai 1 kalau kosong)
  const backBand = plan.bands.length - 2;
  const cellsTop = plan.floors[floor][backBand].some((c) => c.type !== "void") ? plan.floors[floor][backBand] : plan.floors[0][backBand];
  let x = 0;
  const yChain = Y(D) - 60;
  cellsTop.forEach((c, i) => {
    out.push(dimLine(X(x), yChain, X(x + c.w), yChain, fmt(c.w), `t${i}`));
    x += c.w;
  });
  out.push(dimLine(X(0), Y(D) - 120, X(W), Y(D) - 120, fmt(W), "tw"));
  // Rantai kedalaman di kiri
  const xChain = X(0) - 60;
  plan.bands.forEach((b, i) => {
    out.push(dimLine(xChain, Y(g.bandY[i]), xChain, Y(g.bandY[i] + b.d), fmt(b.d), `l${i}`, true));
  });
  out.push(dimLine(X(0) - 120, Y(0), X(0) - 120, Y(D), fmt(D), "ld", true));
  // Garis bantu tipis dari tepi ke rantai
  out.push(
    <g key="ext" stroke="#b9b5ae" strokeWidth={1}>
      <line x1={X(0)} y1={Y(D)} x2={X(0)} y2={Y(D) - 130} />
      <line x1={X(W)} y1={Y(D)} x2={X(W)} y2={Y(D) - 130} />
      <line x1={X(0)} y1={Y(0)} x2={X(0) - 130} y2={Y(0)} />
      <line x1={X(0)} y1={Y(D)} x2={X(0) - 130} y2={Y(D)} />
    </g>,
  );
  return out;
}

export function titleBlock(size: { w: number; h: number }, title: string, info: string, t: Translate, lang: string) {
  const top = size.h - PLAN_M.title + 18;
  const right = size.w - 30;
  return (
    <g>
      <rect x={30} y={top} width={size.w - 60} height={PLAN_M.title - 40} fill="#ffffff" stroke={INK} strokeWidth={2} />
      <text x={52} y={top + 46} fontSize={32} fontWeight={800} fill={INK}>
        barumah<tspan fill={RED}>ID</tspan>
      </text>
      <text x={52} y={top + 74} fontSize={13} fill={THIN}>
        {t("miniCAD · gambar konsep")}
      </text>
      <text x={right - 20} y={top + 38} fontSize={24} fontWeight={800} fill={INK} textAnchor="end" letterSpacing={1}>
        {title}
      </text>
      <text x={right - 20} y={top + 62} fontSize={13} fill={INK} textAnchor="end">
        {info}
      </text>
      <text x={right - 20} y={top + 84} fontSize={11.5} fill={THIN} textAnchor="end">
        {t("Bukan gambar kerja. Gambar kerja detail: Jururancang.")} {tanggal(lang)}
      </text>
    </g>
  );
}

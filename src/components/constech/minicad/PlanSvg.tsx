import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { furnishFloor, type Item } from "@/lib/denah/furniture";
import { floorGeometry, solidWallPieces, WALL_T, type FloorGeom, type Opening, type RoomRect } from "@/lib/denah/geometry";
import { floorArea } from "@/lib/denah/layout";
import { ROOM_META, isOpen, type Plan, type RoomType } from "@/lib/denah/types";
import { FONT, INK, RED, S, THIN, fmt, tanggal, type Layers, type Translate } from "./draw";

// Denah konsep satu lantai bergaya gambar presentasi (acuan board barumahID "Seri Mahaksa" dan "Adaptive Hive"):
// lantai bertekstur (kayu, keramik, paving, rumput), perabot berwarna, mobil tampak atas, pohon, bayangan lembut
// di dinding, plus garis CAD (pintu berayun, jendela, ukuran, kop gambar). Elemen bantu edit diberi data-ui
// supaya dibuang saat diekspor.

export type Handle = { kind: "v"; band: number; index: number } | { kind: "h"; band: number };

export const PLAN_M = { L: 170, R: 70, T: 170, road: 110, title: 160 };

export function planSize(plan: Plan) {
  return {
    w: PLAN_M.L + plan.brief.landW * S + PLAN_M.R,
    h: PLAN_M.T + plan.brief.landD * S + PLAN_M.road + PLAN_M.title,
  };
}

const WALL = "#26292c";
const LINE = "#6f6a63";

/** Pola lantai per jenis ruang */
const FLOOR_PATTERN: Partial<Record<RoomType, string>> = {
  kamar: "kayu",
  kamar_utama: "kayu",
  keluarga: "kayu",
  santai: "kayu",
  tamu_keluarga: "kayu",
  tamu: "kayu",
  kerja: "kayu",
  mushola: "kayu",
  balkon: "kayu",
  tangga: "keramik",
  dapur: "keramik",
  gudang: "keramik",
  km: "km",
  carport: "paving",
  teras: "paving",
  jemur: "paving",
  taman: "rumput",
};

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
  const id = (n: string) => `${idPrefix}-${n}`;
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const g = floorGeometry(plan, floor);
  const size = planSize(plan);
  const X = (x: number) => PLAN_M.L + x * S;
  const Y = (y: number) => PLAN_M.T + (D - y) * S;
  /** Persegi dalam koordinat denah (x, y = sudut depan kiri) */
  const box = (x: number, y: number, w: number, d: number) => ({ x: X(x), y: Y(y + d), width: w * S, height: d * S });
  const rooms = g.rooms;
  const items = layers.furniture ? furnishFloor(g) : [];

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
      <defs>
        <pattern id={id("kayu")} width="120" height="40" patternUnits="userSpaceOnUse">
          <rect width="120" height="20" fill="#dcc19c" />
          <rect y="20" width="120" height="20" fill="#d4b68e" />
          <path d="M0 20H120M0 40H120M70 0V20M20 20V40M110 20V40" stroke="#b8956a" strokeWidth="1.1" />
          <path d="M8 7H52M80 13H112M30 28H64M90 33H104" stroke="#c8a77d" strokeWidth="0.8" />
        </pattern>
        <pattern id={id("keramik")} width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#efebe4" />
          <path d="M0 0H60V60" fill="none" stroke="#d3cdc2" strokeWidth="1.4" />
        </pattern>
        <pattern id={id("km")} width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#e2eaee" />
          <path d="M0 0H30V30" fill="none" stroke="#c3d0d6" strokeWidth="1.1" />
        </pattern>
        <pattern id={id("paving")} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#d8d3ca" />
          <path d="M0 0H40M0 20H40M0 0V20M20 20V40" stroke="#c0b9ad" strokeWidth="1.2" />
        </pattern>
        <pattern id={id("rumput")} width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="#a7c38a" />
          <path d="M4 20l2-6 2 6M15 9l2-6 2 6M22 24l2-5 2 5" fill="none" stroke="#86a868" strokeWidth="1.2" />
          <circle cx="11" cy="22" r="1.4" fill="#93b475" />
        </pattern>
        <pattern id={id("dak")} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="30" height="30" fill="#f2f0ec" />
          <line x1="0" y1="0" x2="0" y2="30" stroke="#dcd7cf" strokeWidth="2" />
        </pattern>
        <radialGradient id={id("daun")} cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#8fbf63" />
          <stop offset="70%" stopColor="#5f9142" />
          <stop offset="100%" stopColor="#4a7834" />
        </radialGradient>
        <filter id={id("bayang")} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="4" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.22" />
        </filter>
        <filter id={id("bayang-kecil")} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect x={0} y={0} width={size.w} height={size.h} fill="#ffffff" />

      {/* Lantai bertekstur */}
      {rooms.map((r) => {
        if (r.type === "void") {
          return floor > 0 && r.kind !== "front" && r.kind !== "back" ? <rect key={r.id} {...box(r.x, r.y, r.w, r.d)} fill={`url(#${id("dak")})`} /> : null;
        }
        const pat = FLOOR_PATTERN[r.type];
        const vis = r.type === "balkon" ? { y: r.y + r.d - Math.min(1.2, r.d), d: Math.min(1.2, r.d) } : { y: r.y, d: r.d };
        return <rect key={r.id} {...box(r.x, vis.y, r.w, vis.d)} fill={pat ? `url(#${id(pat)})` : ROOM_META[r.type].fill} />;
      })}

      {/* Batas lahan */}
      <rect {...box(0, 0, W, D)} fill="none" stroke={THIN} strokeWidth={2} strokeDasharray="28 8 4 8" />

      {/* Perabot, mobil, pohon */}
      <g filter={`url(#${id("bayang-kecil")})`}>{items.map((it, i) => <g key={i}>{drawItem(it, box, X, Y, id)}</g>)}</g>
      {/* Tali jemuran */}
      {layers.furniture &&
        rooms
          .filter((r) => r.type === "jemur" && r.w >= 1.4)
          .map((r) =>
            [0.35, 0.65].map((k) => (
              <line key={`${r.id}${k}`} x1={X(r.x + 0.25)} y1={Y(r.y + r.d * k)} x2={X(r.x + r.w - 0.25)} y2={Y(r.y + r.d * k)} stroke={LINE} strokeWidth={1.4} strokeDasharray="10 6" />
            )),
          )}

      {/* Tangga */}
      {rooms
        .filter((r) => r.type === "tangga")
        .map((r) => (
          <g key={`s-${r.id}`}>{stairs(r, X, Y, floor === 0 ? t("NAIK") : t("TURUN"))}</g>
        ))}

      {/* Balkon: railing */}
      {rooms
        .filter((r) => r.type === "balkon")
        .map((r) => {
          const d = Math.min(1.2, r.d);
          const y0 = r.y + r.d - d;
          return (
            <path
              key={`bk-${r.id}`}
              d={`M${X(r.x)} ${Y(r.y + r.d)}V${Y(y0)}H${X(r.x + r.w)}V${Y(r.y + r.d)}`}
              fill="none"
              stroke={WALL}
              strokeWidth={4}
            />
          );
        })}

      {/* Dinding padat dengan bayangan lembut */}
      <g filter={`url(#${id("bayang")})`}>
        {solidWallPieces(g).map((w, i) => (
          <line
            key={`w${i}`}
            x1={X(w.x1)}
            y1={Y(w.y1)}
            x2={X(w.x2)}
            y2={Y(w.y2)}
            stroke={WALL}
            strokeWidth={(w.ext ? WALL_T.ext : WALL_T.int) * S}
            strokeLinecap="square"
          />
        ))}
      </g>

      {/* Pintu dan jendela */}
      {g.openings.map((o, i) => (
        <g key={`o${i}`}>{openingShape(o, X, Y)}</g>
      ))}

      {/* Label ruang (huruf dengan pinggiran putih supaya terbaca di atas tekstur) */}
      {layers.labels &&
        rooms.map((r) => {
          if (r.type === "void" || r.type === "tangga") return null;
          const meta = ROOM_META[r.type];
          const vis = r.type === "balkon" ? { y: r.y + r.d - Math.min(1.2, r.d), d: Math.min(1.2, r.d) } : { y: r.y, d: r.d };
          const fs = Math.max(11, Math.min(16, (r.w * S) / (t(meta.label).length * 0.64)));
          const cx = X(r.x + r.w / 2);
          const cy = Y(vis.y + vis.d / 2);
          const halo = { stroke: "#ffffff", strokeWidth: 4, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };
          return (
            <g key={`l-${r.id}`} textAnchor="middle" pointerEvents="none">
              <text x={cx} y={cy - 2} fontSize={fs} fontWeight={800} fill={INK} letterSpacing={0.6} {...halo}>
                {t(meta.label).toUpperCase()}
              </text>
              {!isOpen(r.type) || r.type === "carport" || r.type === "teras" ? (
                <text x={cx} y={cy + fs + 2} fontSize={Math.max(10, fs - 3)} fill="#4d4943" {...halo}>
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
          .map((r) => <rect key="sel" data-ui="1" {...box(r.x, r.y, r.w, r.d)} fill="rgba(197,59,59,0.14)" stroke={RED} strokeWidth={4} strokeDasharray="14 8" pointerEvents="none" />)}

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
              <rect key={`hit-${r.id}`} {...box(r.x, r.y, r.w, r.d)} fill="transparent" onPointerDown={(e) => onRoomDown?.(r.id, e)} style={{ cursor: "pointer" }} />
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

type Box = (x: number, y: number, w: number, d: number) => { x: number; y: number; width: number; height: number };

/** Simbol perabot tampak atas, berwarna seperti gambar presentasi */
function drawItem(it: Item, box: Box, X: (x: number) => number, Y: (y: number) => number, id: (n: string) => string): ReactNode {
  const { x, y, w, d } = it;
  const tone = it.tone ?? "#8aa39b";
  const edge = { stroke: "#7a7268", strokeWidth: 1.3 } as const;
  switch (it.kind) {
    case "bed": {
      const headBack = it.face === "back";
      const blanketY = headBack ? y : y + d * 0.38;
      const py = headBack ? y + d - 0.36 : y + 0.06;
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#9b7a58" rx={4} {...edge} />
          <rect {...box(x + 0.04, y + 0.04, w - 0.08, d - 0.08)} fill="#fbfaf7" rx={6} />
          <rect {...box(x + 0.02, blanketY, w - 0.04, d * 0.62)} fill={tone} rx={6} opacity={0.92} />
          <line x1={X(x + 0.02)} y1={Y(headBack ? blanketY + d * 0.62 : blanketY)} x2={X(x + w - 0.02)} y2={Y(headBack ? blanketY + d * 0.62 : blanketY)} stroke="#ffffff" strokeWidth={3} opacity={0.7} />
          <rect {...box(x + 0.08, py, w / 2 - 0.12, 0.3)} fill="#ffffff" rx={8} {...edge} />
          <rect {...box(x + w / 2 + 0.04, py, w / 2 - 0.12, 0.3)} fill="#ffffff" rx={8} {...edge} />
        </>
      );
    }
    case "nightstand":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#a98460" rx={3} {...edge} />
          <circle cx={X(x + w / 2)} cy={Y(y + d / 2)} r={8} fill="#f4e7c8" stroke="#c9b48a" />
        </>
      );
    case "wardrobe":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#efe8dd" {...edge} />
          <line x1={X(x)} y1={Y(y)} x2={X(x + w)} y2={Y(y + d)} stroke="#cbbfae" strokeWidth={1} />
        </>
      );
    case "toilet": {
      const back = it.face === "back";
      return (
        <>
          <rect {...box(x, back ? y + d - 0.2 : y, w, 0.2)} fill="#ffffff" rx={3} {...edge} />
          <ellipse cx={X(x + w / 2)} cy={Y(back ? y + d - 0.45 : y + 0.45)} rx={(w / 2) * S * 0.8} ry={0.26 * S} fill="#ffffff" {...edge} />
        </>
      );
    }
    case "shower":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#cfe0e8" {...edge} />
          <line x1={X(x)} y1={Y(y)} x2={X(x + w)} y2={Y(y + d)} stroke="#9fb6c2" strokeWidth={1} />
          <line x1={X(x + w)} y1={Y(y)} x2={X(x)} y2={Y(y + d)} stroke="#9fb6c2" strokeWidth={1} />
          <circle cx={X(x + w / 2)} cy={Y(y + d / 2)} r={5} fill="#ffffff" stroke="#9fb6c2" />
        </>
      );
    case "sink":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#ffffff" rx={4} {...edge} />
          <ellipse cx={X(x + w / 2)} cy={Y(y + d / 2)} rx={(w / 2) * S * 0.62} ry={(d / 2) * S * 0.55} fill="#e9eff2" stroke="#9fb6c2" />
        </>
      );
    case "counter":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#f6f3ee" {...edge} />
          <rect {...box(x + 0.04, y + 0.04, w - 0.08, d - 0.08)} fill="none" stroke="#d8d1c6" />
          {w > 1.4 && (
            <>
              <circle cx={X(x + w - 0.42)} cy={Y(y + d / 2)} r={10} fill="#3b3d40" />
              <circle cx={X(x + w - 0.82)} cy={Y(y + d / 2)} r={10} fill="#3b3d40" />
              <rect {...box(x + 0.2, y + 0.12, 0.5, 0.36)} fill="#dfe7ea" rx={6} stroke="#9fb6c2" />
            </>
          )}
        </>
      );
    case "fridge":
      return <rect {...box(x, y, w, d)} fill="#cdd1d6" rx={3} {...edge} />;
    case "sofa":
    case "armchair": {
      const f = it.face ?? "back";
      const back = f === "left" ? box(x, y, 0.22, d) : f === "right" ? box(x + w - 0.22, y, 0.22, d) : f === "back" ? box(x, y + d - 0.22, w, 0.22) : box(x, y, w, 0.22);
      return (
        <>
          <rect {...box(x, y, w, d)} fill={tone} rx={10} {...edge} />
          <rect {...back} fill="#000" opacity={0.14} rx={8} />
          {it.kind === "sofa" &&
            (f === "left" || f === "right"
              ? [1, 2].map((k) => <line key={k} x1={X(x + 0.22)} y1={Y(y + (d * k) / 3)} x2={X(x + w)} y2={Y(y + (d * k) / 3)} stroke="#ffffff" strokeWidth={1.4} opacity={0.6} />)
              : [1, 2].map((k) => <line key={k} x1={X(x + (w * k) / 3)} y1={Y(y)} x2={X(x + (w * k) / 3)} y2={Y(y + d)} stroke="#ffffff" strokeWidth={1.4} opacity={0.6} />))}
        </>
      );
    }
    case "coffee":
      return <rect {...box(x, y, w, d)} fill="#9b7653" rx={6} {...edge} />;
    case "rug":
      return <rect {...box(x, y, w, d)} fill={tone} opacity={0.28} rx={4} stroke={tone} strokeWidth={2} />;
    case "tv":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#a98460" rx={3} {...edge} />
          <rect {...box(x + w / 2 - 0.03, y + 0.1, 0.06, d - 0.2)} fill="#1d1f22" />
        </>
      );
    case "dining":
      return <rect {...box(x, y, w, d)} fill="#a98460" rx={6} {...edge} />;
    case "chair":
      return <rect {...box(x, y, w, d)} fill="#c9ab86" rx={5} {...edge} />;
    case "sajadah":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#8a3a36" rx={3} />
          <rect {...box(x + 0.06, y + 0.06, w - 0.12, d - 0.12)} fill="none" stroke="#d9b46a" strokeWidth={1.4} />
        </>
      );
    case "desk":
      return <rect {...box(x, y, w, d)} fill="#efe8dd" {...edge} />;
    case "shelf":
      return (
        <>
          <rect {...box(x, y, w, d)} fill="#b08a62" {...edge} />
          <line x1={X(x)} y1={Y(y + d / 2)} x2={X(x + w)} y2={Y(y + d / 2)} stroke="#7a5d40" />
        </>
      );
    case "car": {
      const r = 0.35 * S;
      return (
        <>
          <rect {...box(x, y, w, d)} fill={tone} rx={r} stroke="#55595e" strokeWidth={1.6} />
          <path
            d={`M${X(x + 0.2)} ${Y(y + d * 0.66)}L${X(x + w - 0.2)} ${Y(y + d * 0.66)}L${X(x + w - 0.32)} ${Y(y + d * 0.56)}L${X(x + 0.32)} ${Y(y + d * 0.56)}Z`}
            fill="#2c3943"
          />
          <rect {...box(x + 0.3, y + d * 0.33, w - 0.6, d * 0.23)} fill="#ffffff" opacity={0.45} rx={8} />
          <path d={`M${X(x + 0.26)} ${Y(y + d * 0.24)}L${X(x + w - 0.26)} ${Y(y + d * 0.24)}L${X(x + w - 0.36)} ${Y(y + d * 0.32)}L${X(x + 0.36)} ${Y(y + d * 0.32)}Z`} fill="#2c3943" />
          <rect {...box(x - 0.08, y + d * 0.64, 0.1, 0.16)} fill={tone} stroke="#55595e" />
          <rect {...box(x + w - 0.02, y + d * 0.64, 0.1, 0.16)} fill={tone} stroke="#55595e" />
        </>
      );
    }
    case "tree": {
      const cx = X(x + w / 2);
      const cy = Y(y + d / 2);
      const rr = (w / 2) * S;
      return (
        <>
          <ellipse cx={cx + rr * 0.25} cy={cy + rr * 0.3} rx={rr} ry={rr * 0.85} fill="#000" opacity={0.12} />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const a = (k / 6) * Math.PI * 2;
            return <circle key={k} cx={cx + Math.cos(a) * rr * 0.45} cy={cy + Math.sin(a) * rr * 0.45} r={rr * 0.58} fill={`url(#${id("daun")})`} />;
          })}
          <circle cx={cx} cy={cy} r={rr * 0.55} fill={`url(#${id("daun")})`} />
          <circle cx={cx} cy={cy} r={3} fill="#5c4330" />
        </>
      );
    }
    case "shrub": {
      const cx = X(x + w / 2);
      const cy = Y(y + d / 2);
      const rr = (w / 2) * S * 0.7;
      return (
        <>
          {[0, 1, 2, 3].map((k) => {
            const a = (k / 4) * Math.PI * 2 + 0.4;
            return <circle key={k} cx={cx + Math.cos(a) * rr * 0.4} cy={cy + Math.sin(a) * rr * 0.4} r={rr * 0.6} fill="#79a556" />;
          })}
        </>
      );
    }
    case "pot":
      return (
        <>
          <circle cx={X(x + w / 2)} cy={Y(y + d / 2)} r={(w / 2) * S} fill="#b5754f" />
          <circle cx={X(x + w / 2)} cy={Y(y + d / 2)} r={(w / 2) * S * 0.75} fill={`url(#${id("daun")})`} />
        </>
      );
    case "pole":
      return <circle cx={X(x + w / 2)} cy={Y(y + d / 2)} r={5} fill="#8a8f94" />;
    default:
      return null;
  }
}

function arcPath(hx: number, hy: number, lx: number, ly: number, ox: number, oy: number, r: number) {
  const cross = (lx - hx) * (oy - hy) - (ly - hy) * (ox - hx);
  return `M${lx} ${ly}A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${ox} ${oy}`;
}

function openingShape(o: Opening, X: (x: number) => number, Y: (y: number) => number): ReactNode {
  const pt = (along: number, off: number) => (o.dir === "h" ? [X(along), Y(o.at + off)] : [X(o.at + off), Y(along)]);
  if (o.kind === "open") return null;
  if (o.kind === "window") {
    const t = WALL_T.ext / 2;
    const [ax, ay] = pt(o.s, -t);
    const [bx, by] = pt(o.e, t);
    return (
      <g>
        <rect x={Math.min(ax, bx)} y={Math.min(ay, by)} width={Math.abs(bx - ax)} height={Math.abs(by - ay)} fill="#dcebf2" />
        <g stroke={WALL} strokeWidth={1.6}>
          {[-t, t].map((off) => {
            const [x1, y1] = pt(o.s, off);
            const [x2, y2] = pt(o.e, off);
            return <line key={off} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          {(() => {
            const [x1, y1] = pt(o.s, 0);
            const [x2, y2] = pt(o.e, 0);
            return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7aa3b8" strokeWidth={2} />;
          })()}
        </g>
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
        <path d={`M${hx} ${hy}L${lx} ${ly}${arcPath(hx, hy, lx, ly, ox, oy, len * S).replace("M", "L")}Z`} fill="#c9a77f" opacity={0.18} />
        <line x1={hx} y1={hy} x2={lx} y2={ly} stroke="#7a5236" strokeWidth={3.5} />
        <path d={arcPath(hx, hy, lx, ly, ox, oy, len * S)} fill="none" stroke={LINE} strokeWidth={1.3} strokeDasharray="5 4" />
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
    lines.push(<line key={y} x1={X(r.x + 0.08)} y1={Y(y)} x2={X(r.x + r.w - 0.08)} y2={Y(y)} stroke="#a88a66" strokeWidth={1.6} />);
  }
  const arrow = `M${X(r.x + r.w / 4)} ${Y(r.y + 0.6)}L${X(r.x + r.w / 4)} ${Y(r.y + r.d - 0.45)}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + r.d - 0.45)}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + 0.9)}`;
  return (
    <>
      <rect x={X(r.x)} y={Y(r.y + r.d)} width={r.w * S} height={r.d * S} fill="#d9bf9c" />
      {lines}
      <line x1={X(mid)} y1={Y(y0)} x2={X(mid)} y2={Y(y1)} stroke="#8a6c4c" strokeWidth={2.4} />
      <path d={arrow} fill="none" stroke={INK} strokeWidth={2} />
      <path d={`M${X(r.x + (3 * r.w) / 4) - 9} ${Y(r.y + 0.9) - 16}L${X(r.x + (3 * r.w) / 4)} ${Y(r.y + 0.9)}L${X(r.x + (3 * r.w) / 4) + 9} ${Y(r.y + 0.9) - 16}`} fill="none" stroke={INK} strokeWidth={2} />
      <text x={X(mid)} y={Y(r.y + 0.35)} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK} letterSpacing={1}>
        {label}
      </text>
    </>
  );
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
  const backBand = plan.bands.length - 2;
  const cellsTop = plan.floors[floor][backBand].some((c) => c.type !== "void") ? plan.floors[floor][backBand] : plan.floors[0][backBand];
  let x = 0;
  const yChain = Y(D) - 60;
  cellsTop.forEach((c, i) => {
    out.push(dimLine(X(x), yChain, X(x + c.w), yChain, fmt(c.w), `t${i}`));
    x += c.w;
  });
  out.push(dimLine(X(0), Y(D) - 120, X(W), Y(D) - 120, fmt(W), "tw"));
  const xChain = X(0) - 60;
  plan.bands.forEach((b, i) => {
    out.push(dimLine(xChain, Y(g.bandY[i]), xChain, Y(g.bandY[i] + b.d), fmt(b.d), `l${i}`, true));
  });
  out.push(dimLine(X(0) - 120, Y(0), X(0) - 120, Y(D), fmt(D), "ld", true));
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

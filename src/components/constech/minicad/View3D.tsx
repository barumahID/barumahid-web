"use client";

import { useEffect, useRef, useState } from "react";
import { floorGeometry, solidWallPieces, WALL_T, type FloorGeom } from "@/lib/denah/geometry";
import { FLOOR_H, PEIL, ROOM_META, isOpen, type Plan } from "@/lib/denah/types";
import type { Translate } from "./draw";

// Visual awal 3D tanpa library: proyeksi ortografis di canvas 2D dengan urutan gambar dari jauh ke dekat.
// Satu nilai `s` (0..1) menggerakkan cerita seperti acuan Specter: denah 2D dilihat dari atas -> kamera miring ->
// dinding naik dari garis denah -> lantai 2 turun ke tempatnya -> atap terpasang. Geser untuk memutar.

type V3 = [number, number, number];
interface Face {
  pts: V3[];
  color: string;
  stroke?: string;
  alpha: number;
  layer: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => 1 - Math.pow(1 - clamp01(n), 3);
const WALL_H = 3.3;
const BASE_YAW = 32;

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

const FLOOR3D: Record<string, string> = {
  carport: "#d9d6d0",
  teras: "#e6d8c3",
  taman: "#c9dbb9",
  jemur: "#d6e2e8",
  balkon: "#e6d8c3",
  km: "#cfdde5",
  dapur: "#ecdcc4",
  tangga: "#e5ded4",
};

export default function View3D({
  plan,
  s,
  showRoof,
  showUpper,
  t,
  canvasRef,
}: {
  plan: Plan;
  s: number;
  showRoof: boolean;
  showUpper: boolean;
  t: Translate;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}) {
  const localRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef ?? localRef;
  const [yaw, setYaw] = useState(0);
  const [size, setSize] = useState({ w: 600, h: 420 });
  const drag = useRef<{ x: number; yaw: number } | null>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScene(ctx, plan, s, yaw, showRoof, showUpper, size.w, size.h, t);
  }, [plan, s, yaw, showRoof, showUpper, size, ref, t]);

  return (
    <canvas
      ref={ref}
      className="block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      role="img"
      aria-label={t("Visual 3D rumah konsep")}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") return;
        drag.current = { x: e.clientX, yaw };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setYaw(Math.max(-80, Math.min(80, drag.current.yaw + (e.clientX - drag.current.x) * 0.35)));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    />
  );
}

/** Gambar adegan 3D. Dipisah supaya bisa dipakai untuk ekspor PNG ukuran besar. */
export function drawScene(ctx: CanvasRenderingContext2D, plan: Plan, s: number, yaw: number, showRoof: boolean, showUpper: boolean, w: number, h: number, t: Translate) {
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const nF = plan.floors.length;
  const geoms = plan.floors.map((_, f) => floorGeometry(plan, f));

  const cam = ease(s / 0.35);
  const phi = ((90 - 55 * cam) * Math.PI) / 180;
  const theta = ((BASE_YAW * cam + yaw * cam) * Math.PI) / 180;
  const wallsK = ease((s - 0.12) / 0.33);
  const upperK = nF > 1 && showUpper ? ease((s - 0.45) / 0.3) : 0;
  const roofK = showRoof && (nF === 1 || showUpper) ? ease((s - 0.78) / 0.22) : 0;
  const labelK = 1 - clamp01((s - 0.28) / 0.22);

  const zTop = PEIL + nF * FLOOR_H + 3;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const sinP = Math.sin(phi);
  const cosP = Math.cos(phi);
  const raw = (p: V3) => {
    const cx = p[0] - W / 2;
    const cy = p[1] - D / 2;
    const xr = cx * cosT - cy * sinT;
    const yr = cx * sinT + cy * cosT;
    return { x: xr, y: yr * sinP + p[2] * cosP, depth: p[2] * sinP - yr * cosP };
  };

  // Skala tetap (gabungan tampilan awal dan akhir) supaya tidak "memompa" saat animasi
  const corners: V3[] = [];
  [0, W].forEach((x) => [0, D].forEach((y) => [0, zTop].forEach((z) => corners.push([x, y, z]))));
  const bounds = corners.map(raw);
  const minX = Math.min(...bounds.map((b) => b.x));
  const maxX = Math.max(...bounds.map((b) => b.x));
  const minY = Math.min(...bounds.map((b) => b.y));
  const maxY = Math.max(...bounds.map((b) => b.y));
  const fitEnd = Math.min((w - 40) / (maxX - minX), (h - 40) / (maxY - minY));
  const fitStart = Math.min((w - 40) / W, (h - 40) / D);
  const scale = Math.min(fitStart, fitEnd * 1.08) * (0.94 + 0.06 * (1 - cam));
  const ox = w / 2 - ((minX + maxX) / 2) * scale * cam;
  const oy = h / 2 + ((minY + maxY) / 2) * scale * cam;
  const P = (p: V3) => {
    const r = raw(p);
    return { x: ox + r.x * scale, y: oy - r.y * scale, depth: r.depth };
  };

  const faces: Face[] = [];
  const quad = (pts: V3[], color: string, alpha: number, layer: number, stroke?: string) => faces.push({ pts, color, alpha, layer, stroke });
  /** Kotak tegak sumbu sejajar; sisi yang menghadap kamera saja yang digambar */
  const prism = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, color: string, alpha: number, layer: number, top = color) => {
    if (z1 - z0 < 0.002) {
      quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], top, alpha, layer);
      return;
    }
    const sides: { n: [number, number]; pts: V3[] }[] = [
      { n: [0, -1], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
      { n: [0, 1], pts: [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]] },
      { n: [-1, 0], pts: [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]] },
      { n: [1, 0], pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
    ];
    sides.forEach(({ n, pts }) => {
      const nyR = n[0] * sinT + n[1] * cosT;
      const nxR = n[0] * cosT - n[1] * sinT;
      if (nyR >= -0.01 || cam < 0.02) return;
      // Garis tepi sewarna isi supaya sambungan potongan dinding tidak terlihat
      const col = shade(color.startsWith("#") ? color : "#f2efea", 0.8 + 0.18 * -nyR - 0.07 * nxR);
      quad(pts, col, alpha, layer, col);
    });
    quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], top, alpha, layer);
  };

  // Tanah dan halaman
  quad([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]], "#efe9df", 1, 0, "#c9c2b7");

  const floorLevel = (f: number) => PEIL + f * FLOOR_H;
  const buildFloor = (g: FloorGeom, f: number, dz: number, alpha: number, layer: number) => {
    const base = floorLevel(f) + dz;
    const wallH = (f === 0 ? WALL_H * wallsK : WALL_H * clamp01(upperK * 1.15)) + 0.001;
    // Lantai ruang (lantai 2: pelat beton dengan sisi terlihat)
    g.rooms.forEach((r) => {
      if (r.type === "void") return;
      const col = FLOOR3D[r.type] ?? (isOpen(r.type) ? "#e8e2d7" : shade(ROOM_META[r.type].fill, 0.97));
      if (r.type === "balkon") {
        const d = Math.min(1.2, r.d);
        prism(r.x, r.y + r.d - d, r.x + r.w, r.y + r.d, base - 0.15, base, "#e9e3da", alpha, layer, col);
        prism(r.x, r.y + r.d - d, r.x + r.w, r.y + r.d - d + 0.05, base, base + wallH * 0.3, "#c9d6dd", alpha * 0.85, layer);
        return;
      }
      if (f === 0) {
        const z = isOpen(r.type) ? 0.02 : PEIL;
        prism(r.x, r.y, r.x + r.w, r.y + r.d, 0, z, "#e4ddd2", alpha, layer, col);
      } else {
        prism(r.x, r.y, r.x + r.w, r.y + r.d, base - 0.15, base, "#e9e3da", alpha, layer, col);
      }
    });
    // Tangga lantai 1: anak tangga dua arah
    if (f === 0)
      g.rooms
        .filter((r) => r.type === "tangga")
        .forEach((r) => {
          const n = 10;
          const run = Math.max(0.5, r.d - 1.1) / n;
          for (let i = 0; i < n; i++) {
            const zA = base + ((i + 1) / (2 * n)) * FLOOR_H * wallsK;
            prism(r.x + 0.05, r.y + 0.1 + i * run, r.x + r.w / 2 - 0.02, r.y + 0.1 + (i + 1) * run, base, zA, "#e5ded4", alpha, layer, "#d8cfc2");
            const zB = base + ((n + i + 1) / (2 * n)) * FLOOR_H * wallsK;
            prism(r.x + r.w / 2 + 0.02, r.y + r.d - 1.0 - (i + 1) * run, r.x + r.w - 0.05, r.y + r.d - 1.0 - i * run, base, zB, "#e5ded4", alpha, layer, "#d8cfc2");
          }
          prism(r.x + 0.05, r.y + r.d - 1, r.x + r.w - 0.05, r.y + r.d - 0.05, base, base + (FLOOR_H / 2) * wallsK, "#e5ded4", alpha, layer, "#d8cfc2");
        });
    // Dinding (dipecah per 1,2 m supaya urutan gambar stabil)
    const top = "#3a3836";
    solidWallPieces(g).forEach((wl) => {
      const tt = (wl.ext ? WALL_T.ext : WALL_T.int) / 2;
      const horiz = Math.abs(wl.y1 - wl.y2) < 1e-6;
      const a = horiz ? Math.min(wl.x1, wl.x2) : Math.min(wl.y1, wl.y2);
      const b = horiz ? Math.max(wl.x1, wl.x2) : Math.max(wl.y1, wl.y2);
      const parts = Math.max(1, Math.ceil((b - a) / 1.2));
      for (let i = 0; i < parts; i++) {
        const s0 = a + ((b - a) * i) / parts - (i === 0 ? tt : 0);
        const s1 = a + ((b - a) * (i + 1)) / parts + (i === parts - 1 ? tt : 0);
        if (horiz) prism(s0, wl.y1 - tt, s1, wl.y1 + tt, base, base + wallH, "#f4f1ec", alpha, layer, top);
        else prism(wl.x1 - tt, s0, wl.x1 + tt, s1, base, base + wallH, "#f4f1ec", alpha, layer, top);
      }
    });
    // Ambang atas pintu/jendela, dinding bawah jendela, dan kaca
    g.openings.forEach((o) => {
      const tt = WALL_T.ext / 2;
      const head = o.kind === "open" ? 2.4 : 2.2;
      const room = g.rooms.find((r) => r.id === o.room);
      const sill = o.kind === "window" ? (room?.type === "km" ? 1.5 : 0.9) : 0;
      const box = (z0: number, z1: number, color: string, k = 1) => {
        if (z1 <= z0) return;
        if (o.dir === "h") prism(o.s, o.at - tt, o.e, o.at + tt, base + z0, base + z1, color, alpha * k, layer, color === "#f4f1ec" ? top : color);
        else prism(o.at - tt, o.s, o.at + tt, o.e, base + z0, base + z1, color, alpha * k, layer, color === "#f4f1ec" ? top : color);
      };
      const hz = Math.min(head, wallH);
      box(hz, wallH, "#f4f1ec");
      if (o.kind === "window") {
        box(0, Math.min(sill, wallH), "#f4f1ec");
        if (wallH > sill + 0.05) {
          const zz0 = base + sill;
          const zz1 = base + Math.min(head, wallH);
          const pts: V3[] = o.dir === "h" ? [[o.s, o.at, zz0], [o.e, o.at, zz0], [o.e, o.at, zz1], [o.s, o.at, zz1]] : [[o.at, o.s, zz0], [o.at, o.e, zz0], [o.at, o.e, zz1], [o.at, o.s, zz1]];
          quad(pts, "rgba(150,185,205,0.55)", alpha, layer, "#5d7480");
        }
      }
    });
  };

  buildFloor(geoms[0], 0, 0, 1, 1);
  if (nF > 1 && upperK > 0.001) buildFloor(geoms[1], 1, (1 - upperK) * 5, upperK, 2);

  // Kanopi carport (setelah dinding naik)
  if (wallsK > 0.95) {
    let x = 0;
    plan.floors[0][0].forEach((c) => {
      if (c.type === "carport") prism(x, 0.4, x + c.w, plan.bands[0].d, 2.9, 3.05, "#e7e2da", clamp01((wallsK - 0.95) * 20) * (1 - roofK * 0), 1, "#d4cdc2");
      x += c.w;
    });
  }

  // Atap
  if (roofK > 0.001) {
    const top = nF > 1 && showUpper ? geoms[1] : geoms[0];
    const ys = top.rooms.filter((r) => !isOpen(r.type)).map((r) => [r.y, r.y + r.d]);
    const y0 = Math.min(...ys.map((v) => v[0]));
    const y1 = Math.max(...ys.map((v) => v[1]));
    const zt = PEIL + (nF > 1 && showUpper ? 2 : 1) * FLOOR_H - (FLOOR_H - WALL_H) + (1 - roofK) * 3;
    const o = 0.6;
    const roofCol = "#b8664b";
    if (plan.brief.roof === "datar") {
      const tt = 0.12;
      prism(0, y0, W, y1, zt - 0.05, zt + 0.05, "#d9d3ca", roofK, 3, "#cfc8bd");
      prism(0, y0, W, y0 + tt, zt, zt + 0.9, "#f4f1ec", roofK, 3);
      prism(0, y1 - tt, W, y1, zt, zt + 0.9, "#f4f1ec", roofK, 3);
      prism(0, y0, tt, y1, zt, zt + 0.9, "#f4f1ec", roofK, 3);
      prism(W - tt, y0, W, y1, zt, zt + 0.9, "#f4f1ec", roofK, 3);
    } else {
      const hr = (W / 2 + o) * Math.tan((30 * Math.PI) / 180) * (plan.brief.roof === "perisai" ? 0.8 : 1);
      const xa = -o;
      const xb = W + o;
      const ya = y0 - o;
      const yb = y1 + o;
      const zr = zt + hr;
      const roofFaces: { pts: V3[]; n: V3 }[] = [];
      if (plan.brief.roof === "pelana") {
        roofFaces.push({ pts: [[xa, ya, zt], [W / 2, ya, zr], [W / 2, yb, zr], [xa, yb, zt]], n: [-1, 0, 1] });
        roofFaces.push({ pts: [[W / 2, ya, zr], [xb, ya, zt], [xb, yb, zt], [W / 2, yb, zr]], n: [1, 0, 1] });
        // Dinding segitiga depan dan belakang
        quad([[0, y0, zt], [W, y0, zt], [W / 2, y0, zt + (W / 2) * Math.tan((30 * Math.PI) / 180)]], "#f1ede6", roofK, 3, "#8f8a82");
        quad([[0, y1, zt], [W, y1, zt], [W / 2, y1, zt + (W / 2) * Math.tan((30 * Math.PI) / 180)]], "#e4dfd7", roofK, 3, "#8f8a82");
      } else {
        const inset = Math.min((xb - xa) / 2, (yb - ya) / 2) * 0.999;
        const ra = ya + inset;
        const rb = Math.max(ra, yb - inset);
        roofFaces.push({ pts: [[xa, ya, zt], [W / 2, ra, zr], [W / 2, rb, zr], [xa, yb, zt]], n: [-1, 0, 1] });
        roofFaces.push({ pts: [[xb, ya, zt], [xb, yb, zt], [W / 2, rb, zr], [W / 2, ra, zr]], n: [1, 0, 1] });
        roofFaces.push({ pts: [[xa, ya, zt], [xb, ya, zt], [W / 2, ra, zr]], n: [0, -1, 1] });
        roofFaces.push({ pts: [[xa, yb, zt], [xb, yb, zt], [W / 2, rb, zr]], n: [0, 1, 1] });
      }
      roofFaces.forEach(({ pts, n }) => {
        const nyR = n[0] * sinT + n[1] * cosT;
        const k = 0.78 + 0.2 * Math.max(0, -nyR) + 0.12 * n[2] * sinP;
        quad(pts, shade(roofCol, k), roofK, 4, "#6e3a2a");
      });
    }
  }

  // Urutkan per lapisan, lalu dari jauh ke dekat
  const projected = faces.map((f) => {
    const pts = f.pts.map(P);
    return { f, pts, depth: pts.reduce((sum, p) => sum + p.depth, 0) / pts.length };
  });
  projected.sort((a, b) => a.f.layer - b.f.layer || a.depth - b.depth);

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f7f4ef";
  ctx.fillRect(0, 0, w, h);
  ctx.lineJoin = "round";
  projected.forEach(({ f, pts }) => {
    ctx.globalAlpha = f.alpha;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = f.color;
    ctx.fill();
    ctx.strokeStyle = f.stroke ?? "rgba(40,36,32,0.28)";
    ctx.lineWidth = f.stroke ? 1 : 0.6;
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Label ruang selama masih tampak seperti denah
  if (labelK > 0.02) {
    ctx.globalAlpha = labelK;
    ctx.fillStyle = "#2b2926";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fs = Math.max(9, Math.min(13, scale * 0.42));
    ctx.font = `700 ${fs}px Arial, Helvetica, sans-serif`;
    geoms[0].rooms.forEach((r) => {
      if (r.type === "void" || r.type === "tangga" || r.w * scale < 34) return;
      const p = P([r.x + r.w / 2, r.y + r.d / 2, PEIL]);
      ctx.fillText(t(ROOM_META[r.type].label).toUpperCase(), p.x, p.y);
    });
    ctx.globalAlpha = 1;
  }
}

import type { FloorGeom, Opening, RoomRect } from "./geometry";

// Tata letak perabot per ruang (koordinat denah, meter). Dipakai bersama oleh denah 2D (simbol berwarna)
// dan visual 3D (balok dan bentuk sederhana), supaya keduanya selalu cocok.

export type ItemKind =
  | "bed"
  | "nightstand"
  | "wardrobe"
  | "toilet"
  | "shower"
  | "sink"
  | "counter"
  | "fridge"
  | "sofa"
  | "armchair"
  | "coffee"
  | "rug"
  | "tv"
  | "dining"
  | "chair"
  | "sajadah"
  | "desk"
  | "shelf"
  | "car"
  | "tree"
  | "shrub"
  | "pot"
  | "pole";

export interface Item {
  kind: ItemKind;
  /** Sudut depan kiri (x, y) dan ukuran (w ke arah x, d ke arah y) */
  x: number;
  y: number;
  w: number;
  d: number;
  /** Arah "kepala" (kasur: bantal; sofa: sandaran; kursi: punggung): sisi persegi */
  face?: "front" | "back" | "left" | "right";
  /** Warna aksen (selimut, kain sofa, mobil) */
  tone?: string;
}

const TONES = ["#8aa39b", "#c79a74", "#9db0c8", "#c4a3a3", "#a9b48f"];

/** Angka acak tetap dari id (pohon dan warna sama setiap kali digambar) */
function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function doorsOf(g: FloorGeom, r: RoomRect): Opening[] {
  const EPS = 1e-6;
  return g.openings.filter((o) => {
    if (o.kind === "window") return false;
    if (o.room === r.id) return true;
    // Pintu ruang lain yang terletak di dinding ruang ini
    const onH = o.dir === "h" && (Math.abs(o.at - r.y) < EPS || Math.abs(o.at - (r.y + r.d)) < EPS) && o.s < r.x + r.w && o.e > r.x;
    const onV = o.dir === "v" && (Math.abs(o.at - r.x) < EPS || Math.abs(o.at - (r.x + r.w)) < EPS) && o.s < r.y + r.d && o.e > r.y;
    return onH || onV;
  });
}

export function furnishRoom(g: FloorGeom, r: RoomRect, floor: number): Item[] {
  const doors = doorsOf(g, r);
  const onWall = (y: number) => doors.filter((o) => o.dir === "h" && Math.abs(o.at - y) < 1e-6);
  const backHasDoor = onWall(r.y + r.d).length > 0;
  const frontHasDoor = onWall(r.y).length > 0;
  // Dinding jauh dari pintu (untuk kepala kasur, meja dapur, dan sejenisnya)
  const farBack = !backHasDoor || frontHasDoor;
  const farY = (depth: number) => (farBack ? r.y + r.d - depth - 0.05 : r.y + 0.05);
  const doorX = doors.length ? (doors[0].dir === "h" ? (doors[0].s + doors[0].e) / 2 : doors[0].at) : r.x + r.w / 2;
  const leftAway = doorX > r.x + r.w / 2; // pintu di kanan -> taruh perabot samping di kiri
  const rand = seeded(r.id);
  const tone = TONES[Math.floor(rand() * TONES.length)];
  const items: Item[] = [];
  const add = (i: Item) => items.push(i);

  switch (r.type) {
    case "kamar_utama":
    case "kamar": {
      const bw = Math.min(r.type === "kamar_utama" ? 1.6 : 1.2, r.w - 0.6);
      const bd = Math.min(2, r.d - 0.8);
      if (bw < 0.8 || bd < 1.4) break;
      const bx = r.x + (r.w - bw) / 2;
      const by = farY(bd);
      add({ kind: "bed", x: bx, y: by, w: bw, d: bd, face: farBack ? "back" : "front", tone });
      const ns = 0.45;
      const nsY = farBack ? by + bd - 0.42 : by;
      if (bx - r.x >= ns + 0.1) add({ kind: "nightstand", x: bx - ns - 0.05, y: nsY, w: ns, d: 0.42 });
      if (r.x + r.w - (bx + bw) >= ns + 0.1) add({ kind: "nightstand", x: bx + bw + 0.05, y: nsY, w: ns, d: 0.42 });
      // Lemari di sisi samping yang jauh dari pintu
      const side = (r.w - bw) / 2;
      if (side >= 0.7 && r.d - bd >= 0.3) {
        const len = Math.min(1.8, r.d - 1.2);
        const wy = farBack ? r.y + 0.6 : r.y + r.d - len - 0.6;
        add({ kind: "wardrobe", x: leftAway ? r.x + 0.05 : r.x + r.w - 0.65, y: Math.max(r.y + 0.05, wy), w: 0.6, d: len });
      } else if (r.d - bd >= 1.5) {
        const len = Math.min(1.8, r.w - 1.2);
        add({ kind: "wardrobe", x: leftAway ? r.x + 0.05 : r.x + r.w - len - 0.05, y: farBack ? r.y + 0.05 : r.y + r.d - 0.65, w: len, d: 0.6 });
      }
      add({ kind: "rug", x: bx - 0.2, y: farBack ? by - 0.5 : by + bd - 0.6, w: bw + 0.4, d: 1.1, tone });
      break;
    }
    case "km": {
      if (r.w < 1 || r.d < 1.4) break;
      const ty = farBack ? r.y + r.d - 0.75 : r.y + 0.05;
      add({ kind: "toilet", x: leftAway ? r.x + 0.12 : r.x + r.w - 0.52, y: ty, w: 0.4, d: 0.7, face: farBack ? "back" : "front" });
      if (r.w >= 1.6 && r.d >= 2) add({ kind: "shower", x: leftAway ? r.x + r.w - 0.95 : r.x + 0.05, y: farBack ? r.y + r.d - 0.95 : r.y + 0.05, w: 0.9, d: 0.9 });
      add({ kind: "sink", x: leftAway ? r.x + 0.05 : r.x + r.w - 0.5, y: r.y + r.d / 2 - 0.25, w: 0.45, d: 0.5 });
      break;
    }
    case "dapur": {
      const cy = farY(0.6);
      add({ kind: "counter", x: r.x + 0.05, y: cy, w: r.w - 0.1, d: 0.6 });
      if (r.w >= 2.4 && r.d >= 2.6) {
        const len = Math.min(1.6, r.d - 1.6);
        add({ kind: "counter", x: leftAway ? r.x + 0.05 : r.x + r.w - 0.65, y: farBack ? cy - len : cy + 0.6, w: 0.6, d: len });
      }
      add({ kind: "fridge", x: leftAway ? r.x + r.w - 0.75 : r.x + 0.05, y: farBack ? cy - 0.75 : cy + 0.65, w: 0.7, d: 0.7 });
      break;
    }
    case "keluarga":
    case "santai":
    case "tamu_keluarga": {
      if (r.w < 2.6 || r.d < 2.6) break;
      const sd = Math.min(2.2, r.d - 0.8);
      const sx = r.x + 0.1;
      const sy = r.y + (r.d - sd) / 2;
      add({ kind: "rug", x: sx + 0.5, y: sy - 0.2, w: Math.min(2.2, r.w * 0.45), d: sd + 0.4, tone });
      add({ kind: "sofa", x: sx, y: sy, w: 0.9, d: sd, face: "left", tone });
      add({ kind: "coffee", x: sx + 1.25, y: r.y + r.d / 2 - 0.5, w: 0.55, d: 1 });
      const tvX = Math.min(r.x + r.w - 0.5, sx + 2.8);
      add({ kind: "tv", x: tvX, y: r.y + r.d / 2 - 0.8, w: 0.4, d: 1.6 });
      if (r.type === "keluarga" && r.w >= 5) {
        add({ kind: "dining", x: r.x + r.w - 1.65, y: r.y + r.d / 2 - 0.45, w: 1.2, d: 0.9 });
        [-0.32, 0.32].forEach((dx) => {
          add({ kind: "chair", x: r.x + r.w - 1.25 + dx - 0.2, y: r.y + r.d / 2 + 0.5, w: 0.4, d: 0.4, face: "back" });
          add({ kind: "chair", x: r.x + r.w - 1.25 + dx - 0.2, y: r.y + r.d / 2 - 0.9, w: 0.4, d: 0.4, face: "front" });
        });
      }
      add({ kind: "pot", x: r.x + r.w - 0.5, y: r.y + 0.1, w: 0.4, d: 0.4 });
      break;
    }
    case "tamu": {
      if (r.w < 2.4 || r.d < 2.4) break;
      const cx = r.x + r.w / 2;
      const cy = r.y + r.d / 2;
      add({ kind: "rug", x: cx - 1.1, y: cy - 0.9, w: 2.2, d: 1.8, tone });
      add({ kind: "sofa", x: cx - 0.95, y: cy + 0.35, w: 1.9, d: 0.85, face: "back", tone });
      add({ kind: "coffee", x: cx - 0.45, y: cy - 0.25, w: 0.9, d: 0.5 });
      add({ kind: "armchair", x: cx - 0.85, y: cy - 1.05, w: 0.7, d: 0.7, face: "front", tone });
      add({ kind: "armchair", x: cx + 0.15, y: cy - 1.05, w: 0.7, d: 0.7, face: "front", tone });
      add({ kind: "pot", x: r.x + 0.1, y: r.y + r.d - 0.5, w: 0.4, d: 0.4 });
      break;
    }
    case "mushola":
      [0, 1].forEach((i) => {
        if (r.w >= 0.75 * (i + 1) + 0.2) add({ kind: "sajadah", x: r.x + 0.2 + i * 0.75, y: r.y + r.d / 2 - 0.55, w: 0.6, d: 1.1, face: "back" });
      });
      break;
    case "kerja": {
      const dy = farY(0.6);
      add({ kind: "desk", x: r.x + 0.2, y: dy, w: Math.min(1.4, r.w - 0.4), d: 0.6 });
      add({ kind: "chair", x: r.x + 0.6, y: farBack ? dy - 0.55 : dy + 0.7, w: 0.45, d: 0.45, face: farBack ? "front" : "back" });
      if (r.w >= 2.6) add({ kind: "shelf", x: r.x + r.w - 0.45, y: r.y + 0.3, w: 0.4, d: Math.min(1.6, r.d - 0.6) });
      break;
    }
    case "gudang":
      add({ kind: "shelf", x: r.x + 0.05, y: farY(0.45), w: r.w - 0.1, d: 0.45 });
      break;
    case "carport": {
      if (r.w < 2 || r.d < 4.3) break;
      const cars = r.w >= 5 ? 2 : 1;
      const colors = ["#f2f2f0", "#5b6470"];
      for (let i = 0; i < cars; i++) add({ kind: "car", x: r.x + ((i + 0.5) * r.w) / cars - 0.9, y: r.y + (r.d - 4.3) / 2, w: 1.8, d: 4.3, face: "front", tone: colors[i % 2] });
      break;
    }
    case "teras":
      if (r.w >= 1.8 && r.d >= 1.6) {
        add({ kind: "armchair", x: r.x + r.w - 1.6, y: r.y + r.d - 0.9, w: 0.6, d: 0.6, face: "back", tone: "#b89a7a" });
        add({ kind: "coffee", x: r.x + r.w - 0.95, y: r.y + r.d - 0.8, w: 0.45, d: 0.45 });
      }
      add({ kind: "pot", x: r.x + 0.15, y: r.y + 0.15, w: 0.45, d: 0.45 });
      break;
    case "taman": {
      if (floor > 0 || r.w < 1 || r.d < 0.8) break;
      const n = Math.max(1, Math.min(4, Math.floor((r.w * r.d) / 6)));
      for (let i = 0; i < n; i++) {
        const s = Math.min(Math.min(r.w, r.d) * 0.8, 1.4 + rand() * 1.2);
        const x = r.x + ((i + 0.5) * r.w) / n - s / 2 + (rand() - 0.5) * 0.4;
        const y = r.y + (r.d - s) / 2 + (rand() - 0.5) * Math.max(0, r.d - s) * 0.6;
        add({ kind: i % 2 === 0 ? "tree" : "shrub", x: Math.max(r.x, Math.min(r.x + r.w - s, x)), y: Math.max(r.y, Math.min(r.y + r.d - s, y)), w: s, d: s });
      }
      break;
    }
    case "jemur":
      if (r.w >= 1.4 && r.d >= 1) {
        add({ kind: "pole", x: r.x + 0.2, y: r.y + r.d / 2 - 0.05, w: 0.1, d: 0.1 });
        add({ kind: "pole", x: r.x + r.w - 0.3, y: r.y + r.d / 2 - 0.05, w: 0.1, d: 0.1 });
      }
      break;
    case "balkon":
      add({ kind: "pot", x: r.x + 0.15, y: r.y + r.d - 0.6, w: 0.4, d: 0.4 });
      break;
  }
  return items;
}

/** Perabot seluruh lantai */
export function furnishFloor(g: FloorGeom): Item[] {
  return g.rooms.flatMap((r) => (r.type === "void" ? [] : furnishRoom(g, r, g.floor)));
}

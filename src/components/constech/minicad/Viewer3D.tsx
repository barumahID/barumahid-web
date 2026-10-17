"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { furnishFloor, type Item } from "@/lib/denah/furniture";
import { floorGeometry, solidWallPieces, WALL_T, type FloorGeom } from "@/lib/denah/geometry";
import { FLOOR_H, PEIL, isOpen, type Plan, type RoomType } from "@/lib/denah/types";

// Visual 3D yang lebih realistis (gratis, di browser, tanpa API): three.js dengan cahaya matahari dan bayangan
// lembut, pantulan lingkungan, tekstur prosedural (lantai kayu, keramik, rumput, paving, genteng, roster),
// perabot, pohon, dan mobil. Ukurannya selalu sama dengan denah. Nilai `s` (0..1) menjalankan cerita:
// denah dilihat dari atas -> kamera miring -> dinding naik -> lantai 2 turun -> atap terpasang.
// Dimuat terpisah (next/dynamic) hanya saat dibuka, jadi tidak membebani halaman.

export interface Viewer3DApi {
  /** Gambar PNG dari tampilan sekarang */
  snapshot: (w?: number, h?: number) => string | null;
}

const WALL_H = 3.3;
const CUT_H = 2.5;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => 1 - Math.pow(1 - clamp01(n), 3);

// ---------- Tekstur prosedural ----------

type Paint = (c: CanvasRenderingContext2D, n: number) => void;

function canvasTex(paint: Paint, n = 256) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = n;
  const c = cv.getContext("2d")!;
  paint(c, n);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function noise(c: CanvasRenderingContext2D, n: number, count: number, colors: string[], size = 2) {
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    c.fillStyle = colors[Math.floor(r() * colors.length)];
    c.globalAlpha = 0.25 + r() * 0.35;
    c.fillRect(r() * n, r() * n, size * (0.5 + r()), size * (0.5 + r()));
  }
  c.globalAlpha = 1;
}

function makeTextures() {
  const wood = canvasTex((c, n) => {
    // Papan kayu 4 baris per tekstur (tekstur = 2 m), sambungan acak
    const rows = 8;
    for (let i = 0; i < rows; i++) {
      const tone = [196, 160, 120].map((v) => v + ((i * 37) % 21) - 10);
      c.fillStyle = `rgb(${tone.join(",")})`;
      c.fillRect(0, (i * n) / rows, n, n / rows);
      c.strokeStyle = "rgba(90,60,35,0.35)";
      c.beginPath();
      c.moveTo(0, (i * n) / rows);
      c.lineTo(n, (i * n) / rows);
      c.stroke();
      const cut = ((i * 97) % n) + 20;
      c.beginPath();
      c.moveTo(cut, (i * n) / rows);
      c.lineTo(cut, ((i + 1) * n) / rows);
      c.stroke();
    }
    noise(c, n, 900, ["#a07850", "#d8b48a"], 3);
  });
  const tile = canvasTex((c, n) => {
    c.fillStyle = "#ece8e1";
    c.fillRect(0, 0, n, n);
    noise(c, n, 500, ["#ddd7cd", "#f6f3ee"], 3);
    c.strokeStyle = "rgba(150,140,128,0.5)";
    for (let i = 0; i <= 4; i++) {
      c.beginPath();
      c.moveTo((i * n) / 4, 0);
      c.lineTo((i * n) / 4, n);
      c.moveTo(0, (i * n) / 4);
      c.lineTo(n, (i * n) / 4);
      c.stroke();
    }
  });
  const bath = canvasTex((c, n) => {
    c.fillStyle = "#dfe7ea";
    c.fillRect(0, 0, n, n);
    c.strokeStyle = "rgba(120,140,150,0.45)";
    for (let i = 0; i <= 8; i++) {
      c.beginPath();
      c.moveTo((i * n) / 8, 0);
      c.lineTo((i * n) / 8, n);
      c.moveTo(0, (i * n) / 8);
      c.lineTo(n, (i * n) / 8);
      c.stroke();
    }
  });
  const grass = canvasTex((c, n) => {
    c.fillStyle = "#7d9f57";
    c.fillRect(0, 0, n, n);
    noise(c, n, 3500, ["#6b8d48", "#93b56a", "#5f7f3f", "#a3c27a"], 2);
  });
  const paving = canvasTex((c, n) => {
    c.fillStyle = "#c9c4ba";
    c.fillRect(0, 0, n, n);
    noise(c, n, 900, ["#b9b3a8", "#d6d1c8"], 3);
    c.strokeStyle = "rgba(110,104,96,0.45)";
    const rows = 6;
    for (let i = 0; i < rows; i++) {
      const y = (i * n) / rows;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(n, y);
      c.stroke();
      for (let j = 0; j < 3; j++) {
        const x = ((j + (i % 2) * 0.5) * n) / 3;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y + n / rows);
        c.stroke();
      }
    }
  });
  const roof = canvasTex((c, n) => {
    c.fillStyle = "#4a4e54";
    c.fillRect(0, 0, n, n);
    const rows = 8;
    for (let i = 0; i < rows; i++) {
      const y = (i * n) / rows;
      const g = c.createLinearGradient(0, y, 0, y + n / rows);
      g.addColorStop(0, "#5b6066");
      g.addColorStop(1, "#33363b");
      c.fillStyle = g;
      c.fillRect(0, y, n, n / rows - 2);
      for (let j = 0; j < 6; j++) {
        c.fillStyle = "rgba(0,0,0,0.25)";
        c.fillRect(((j + (i % 2) * 0.5) * n) / 6, y, 2, n / rows);
      }
    }
  });
  const plaster = canvasTex((c, n) => {
    c.fillStyle = "#f4f2ee";
    c.fillRect(0, 0, n, n);
    noise(c, n, 700, ["#e8e4dd", "#ffffff"], 2);
  });
  const cladding = canvasTex((c, n) => {
    const cols = 10;
    for (let i = 0; i < cols; i++) {
      const v = 140 + ((i * 29) % 30);
      c.fillStyle = `rgb(${v},${Math.round(v * 0.68)},${Math.round(v * 0.45)})`;
      c.fillRect((i * n) / cols, 0, n / cols - 2, n);
    }
    noise(c, n, 600, ["#6d4a2c", "#b88a5c"], 2);
  });
  const roster = canvasTex((c, n) => {
    c.fillStyle = "#e9e5de";
    c.fillRect(0, 0, n, n);
    const k = 4;
    const s = n / k;
    for (let i = 0; i < k; i++)
      for (let j = 0; j < k; j++) {
        c.fillStyle = "#3b3a37";
        c.fillRect(i * s + s * 0.18, j * s + s * 0.18, s * 0.64, s * 0.64);
        c.fillStyle = "#e9e5de";
        c.beginPath();
        c.arc(i * s + s / 2, j * s + s / 2, s * 0.2, 0, Math.PI * 2);
        c.fill();
      }
  });
  return { wood, tile, bath, grass, paving, roof, plaster, cladding, roster };
}

type Textures = ReturnType<typeof makeTextures>;

const FLOOR_TEX: Partial<Record<RoomType, keyof Textures>> = {
  kamar: "wood",
  kamar_utama: "wood",
  keluarga: "wood",
  santai: "wood",
  tamu_keluarga: "wood",
  tamu: "wood",
  kerja: "wood",
  mushola: "wood",
  balkon: "wood",
  dapur: "tile",
  tangga: "tile",
  gudang: "tile",
  km: "bath",
  taman: "grass",
  carport: "paving",
  teras: "paving",
  jemur: "paving",
};

// ---------- Bangun adegan dari denah ----------

interface House {
  root: THREE.Group;
  lower: THREE.Group;
  lowerWalls: THREE.Group;
  upper: THREE.Group | null;
  roof: THREE.Group | null;
  span: number;
}

function buildHouse(plan: Plan, tex: Textures, opts: { roof: boolean; upper: boolean }): House {
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const geoms = plan.floors.map((_, f) => floorGeometry(plan, f));
  const cut = !opts.roof;
  const wallH = cut ? CUT_H : WALL_H;

  const mats = new Map<string, THREE.Material>();
  const std = (key: string, make: () => THREE.Material) => {
    if (!mats.has(key)) mats.set(key, make());
    return mats.get(key)!;
  };
  const color = (hex: string, rough = 0.8, metal = 0) => std(`c${hex}${rough}${metal}`, () => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal }));
  const textured = (name: keyof Textures, rx: number, ry: number, rough = 0.85) => {
    const t = tex[name].clone();
    t.repeat.set(Math.max(0.2, rx), Math.max(0.2, ry));
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: t, roughness: rough });
  };
  const plaster = std("plaster", () => {
    const t = tex.plaster.clone();
    t.repeat.set(2, 2);
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.92 });
  });
  const glass = std("glass", () => new THREE.MeshStandardMaterial({ color: "#a9c9d8", roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.38 }));
  const frame = color("#2f3236", 0.5, 0.4);
  const woodDark = color("#8a5f3c", 0.7);

  // x,y denah (meter) -> koordinat three (y ke atas, depan menghadap kamera)
  const box = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, mat: THREE.Material, cast = true) => {
    const w = Math.max(0.005, x1 - x0);
    const h = Math.max(0.005, z1 - z0);
    const d = Math.max(0.005, y1 - y0);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set((x0 + x1) / 2 - W / 2, (z0 + z1) / 2, D / 2 - (y0 + y1) / 2);
    m.castShadow = cast;
    m.receiveShadow = true;
    return m;
  };

  const root = new THREE.Group();

  // Tanah di sekitar lahan
  const ground = new THREE.Mesh(new THREE.CircleGeometry(Math.max(W, D) * 1.6, 48), color("#e8e3d9", 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  root.add(ground);

  const furnitureMesh = (it: Item, z0: number, group: THREE.Group) => {
    const add = (m: THREE.Mesh) => group.add(m);
    const { x, y, w, d } = it;
    const tone = it.tone ?? "#8aa39b";
    switch (it.kind) {
      case "bed": {
        add(box(x, y, x + w, y + d, z0, z0 + 0.3, woodDark));
        add(box(x + 0.03, y + 0.03, x + w - 0.03, y + d - 0.03, z0 + 0.3, z0 + 0.5, color("#f7f5f0", 0.95)));
        const headBack = it.face === "back";
        const blanket = headBack ? [y + 0.02, y + d * 0.62] : [y + d * 0.38, y + d - 0.02];
        add(box(x + 0.01, blanket[0], x + w - 0.01, blanket[1], z0 + 0.5, z0 + 0.55, color(tone, 0.95)));
        const py = headBack ? y + d - 0.38 : y + 0.08;
        add(box(x + 0.08, py, x + w / 2 - 0.04, py + 0.3, z0 + 0.5, z0 + 0.62, color("#ffffff", 0.9)));
        add(box(x + w / 2 + 0.04, py, x + w - 0.08, py + 0.3, z0 + 0.5, z0 + 0.62, color("#ffffff", 0.9)));
        const hy = headBack ? [y + d - 0.06, y + d] : [y, y + 0.06];
        add(box(x, hy[0], x + w, hy[1], z0, z0 + 1, woodDark));
        break;
      }
      case "nightstand":
        add(box(x, y, x + w, y + d, z0, z0 + 0.5, woodDark));
        break;
      case "wardrobe":
        add(box(x, y, x + w, y + d, z0, z0 + 2.1, color("#efe9e0", 0.6)));
        break;
      case "toilet":
        add(box(x + 0.05, y + 0.15, x + w - 0.05, y + d - 0.05, z0, z0 + 0.4, color("#ffffff", 0.2)));
        add(box(x, it.face === "back" ? y + d - 0.2 : y, x + w, it.face === "back" ? y + d : y + 0.2, z0, z0 + 0.75, color("#ffffff", 0.2)));
        break;
      case "shower":
        add(box(x, y, x + w, y + 0.03, z0, z0 + 2, glass, false));
        add(box(x, y, x + 0.03, y + d, z0, z0 + 2, glass, false));
        break;
      case "sink":
        add(box(x, y, x + w, y + d, z0, z0 + 0.85, color("#ffffff", 0.25)));
        break;
      case "counter":
        add(box(x, y, x + w, y + d, z0, z0 + 0.86, color("#f1ede6", 0.6)));
        add(box(x - 0.01, y - 0.01, x + w + 0.01, y + d + 0.01, z0 + 0.86, z0 + 0.9, color("#3a3836", 0.35)));
        break;
      case "fridge":
        add(box(x, y, x + w, y + d, z0, z0 + 1.8, color("#c9ccd0", 0.3, 0.4)));
        break;
      case "sofa":
      case "armchair": {
        const fabric = color(tone, 0.95);
        add(box(x, y, x + w, y + d, z0, z0 + 0.42, fabric));
        const back = it.face ?? "back";
        const t = 0.2;
        if (back === "left") add(box(x, y, x + t, y + d, z0, z0 + 0.82, fabric));
        else if (back === "right") add(box(x + w - t, y, x + w, y + d, z0, z0 + 0.82, fabric));
        else if (back === "back") add(box(x, y + d - t, x + w, y + d, z0, z0 + 0.82, fabric));
        else add(box(x, y, x + w, y + t, z0, z0 + 0.82, fabric));
        break;
      }
      case "coffee":
        add(box(x, y, x + w, y + d, z0, z0 + 0.42, woodDark));
        break;
      case "rug":
        add(box(x, y, x + w, y + d, z0, z0 + 0.012, color(tone, 1), false));
        break;
      case "tv":
        add(box(x, y, x + w, y + d, z0, z0 + 0.5, woodDark));
        add(box(x + w / 2 - 0.03, y + 0.1, x + w / 2 + 0.03, y + d - 0.1, z0 + 0.6, z0 + 1.3, color("#111214", 0.3, 0.2)));
        break;
      case "dining":
        add(box(x, y, x + w, y + d, z0 + 0.72, z0 + 0.76, woodDark));
        [
          [x + 0.05, y + 0.05],
          [x + w - 0.1, y + 0.05],
          [x + 0.05, y + d - 0.1],
          [x + w - 0.1, y + d - 0.1],
        ].forEach(([lx, ly]) => add(box(lx, ly, lx + 0.05, ly + 0.05, z0, z0 + 0.72, woodDark)));
        break;
      case "chair":
        add(box(x, y, x + w, y + d, z0 + 0.42, z0 + 0.46, woodDark));
        add(box(x, it.face === "back" ? y + d - 0.05 : y, x + w, it.face === "back" ? y + d : y + 0.05, z0, z0 + 0.9, woodDark));
        break;
      case "sajadah":
        add(box(x, y, x + w, y + d, z0, z0 + 0.01, color("#7c2f2f", 1), false));
        break;
      case "desk":
        add(box(x, y, x + w, y + d, z0 + 0.72, z0 + 0.76, color("#efe9e0", 0.5)));
        add(box(x, y, x + 0.05, y + d, z0, z0 + 0.72, color("#2f3236", 0.5)));
        add(box(x + w - 0.05, y, x + w, y + d, z0, z0 + 0.72, color("#2f3236", 0.5)));
        break;
      case "shelf":
        add(box(x, y, x + w, y + d, z0, z0 + 1.9, woodDark));
        break;
      case "car": {
        const body = color(tone, 0.25, 0.5);
        const ins = 0.1;
        add(box(x + ins, y + 0.1, x + w - ins, y + d - 0.1, z0 + 0.25, z0 + 0.85, body));
        add(box(x + 0.25, y + d * 0.28, x + w - 0.25, y + d * 0.72, z0 + 0.85, z0 + 1.4, color("#2a3640", 0.08, 0.6)));
        const wheel = color("#1c1c1c", 0.8);
        [
          [x + 0.05, y + 0.6],
          [x + w - 0.25, y + 0.6],
          [x + 0.05, y + d - 1.0],
          [x + w - 0.25, y + d - 1.0],
        ].forEach(([wx, wy]) => {
          const m = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.22, 20), wheel);
          m.rotation.z = Math.PI / 2;
          m.position.set(wx + 0.1 - W / 2, z0 + 0.33, D / 2 - (wy + 0.2));
          m.castShadow = true;
          add(m);
        });
        break;
      }
      case "tree": {
        const cx = x + w / 2;
        const cy = y + d / 2;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 8), color("#6b4a32", 1));
        trunk.position.set(cx - W / 2, z0 + 0.8, D / 2 - cy);
        trunk.castShadow = true;
        add(trunk);
        const leaf = color("#5d8a3e", 0.9);
        const r = Math.max(0.6, w / 2);
        [
          [0, 2.1, 0, r],
          [r * 0.45, 1.8, r * 0.2, r * 0.72],
          [-r * 0.4, 1.9, -r * 0.25, r * 0.7],
        ].forEach(([dx, dy, dz, rr]) => {
          const m = new THREE.Mesh(new THREE.IcosahedronGeometry(rr, 1), leaf);
          m.position.set(cx - W / 2 + dx, z0 + dy, D / 2 - cy + dz);
          m.castShadow = true;
          add(m);
        });
        break;
      }
      case "shrub": {
        const leaf = color("#6f9a4a", 0.9);
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.max(0.35, w / 3), 1), leaf);
        m.scale.y = 0.7;
        m.position.set(x + w / 2 - W / 2, z0 + 0.3, D / 2 - (y + d / 2));
        m.castShadow = true;
        add(m);
        break;
      }
      case "pot": {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.4, w * 0.32, 0.4, 14), color("#b0704f", 0.9));
        pot.position.set(x + w / 2 - W / 2, z0 + 0.2, D / 2 - (y + d / 2));
        pot.castShadow = true;
        add(pot);
        const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(w * 0.55, 1), color("#4f7d36", 0.9));
        leaf.position.set(x + w / 2 - W / 2, z0 + 0.7, D / 2 - (y + d / 2));
        leaf.castShadow = true;
        add(leaf);
        break;
      }
      case "pole": {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), color("#7d8186", 0.4, 0.6));
        p.position.set(x + w / 2 - W / 2, z0 + 0.9, D / 2 - (y + d / 2));
        add(p);
        break;
      }
    }
  };

  const buildFloor = (g: FloorGeom, f: number) => {
    const group = new THREE.Group();
    const walls = new THREE.Group();
    const base = PEIL + f * FLOOR_H;
    // Lantai ruang
    g.rooms.forEach((r) => {
      if (r.type === "void") return;
      const key = FLOOR_TEX[r.type];
      const scale = r.type === "km" ? 1.2 : r.type === "taman" ? 3 : 2;
      const mat = key ? textured(key, r.w / scale, r.d / scale) : color("#e6e1d8");
      if (r.type === "balkon") {
        const d = Math.min(1.2, r.d);
        group.add(box(r.x, r.y + r.d - d, r.x + r.w, r.y + r.d, base - 0.15, base, mat));
        group.add(box(r.x, r.y + r.d - d, r.x + r.w, r.y + r.d - d + 0.04, base, base + 1.0, glass, false));
        group.add(box(r.x, r.y + r.d - d - 0.02, r.x + r.w, r.y + r.d - d + 0.06, base + 1.0, base + 1.05, frame));
        return;
      }
      if (f === 0) {
        group.add(box(r.x, r.y, r.x + r.w, r.y + r.d, 0, isOpen(r.type) ? 0.04 : PEIL, mat, false));
      } else {
        group.add(box(r.x, r.y, r.x + r.w, r.y + r.d, base - 0.18, base, mat));
      }
    });
    // Perabot
    furnishFloor(g).forEach((it) => {
      const room = g.rooms.find((r) => it.x >= r.x - 0.5 && it.x <= r.x + r.w && it.y >= r.y - 0.5 && it.y <= r.y + r.d);
      const z0 = f === 0 ? (room && isOpen(room.type) ? 0.04 : PEIL) : base;
      furnitureMesh(it, z0, group);
    });
    // Tangga
    g.rooms
      .filter((r) => r.type === "tangga" && f === 0)
      .forEach((r) => {
        const n = 10;
        const run = Math.max(0.5, r.d - 1.1) / n;
        const stepMat = textured("wood", 0.5, 0.5);
        for (let i = 0; i < n; i++) {
          group.add(box(r.x + 0.05, r.y + 0.1 + i * run, r.x + r.w / 2 - 0.02, r.y + 0.1 + (i + 1) * run, base, base + ((i + 1) / (2 * n)) * FLOOR_H, stepMat));
          group.add(box(r.x + r.w / 2 + 0.02, r.y + r.d - 1 - (i + 1) * run, r.x + r.w - 0.05, r.y + r.d - 1 - i * run, base, base + ((n + i + 1) / (2 * n)) * FLOOR_H, stepMat));
        }
        group.add(box(r.x + 0.05, r.y + r.d - 1, r.x + r.w - 0.05, r.y + r.d - 0.05, base, base + FLOOR_H / 2, stepMat));
      });
    // Dinding (diskalakan saat animasi "naik")
    solidWallPieces(g).forEach((w) => {
      const t = (w.ext ? WALL_T.ext : WALL_T.int) / 2;
      const horiz = Math.abs(w.y1 - w.y2) < 1e-6;
      const m = horiz
        ? box(Math.min(w.x1, w.x2) - t, w.y1 - t, Math.max(w.x1, w.x2) + t, w.y1 + t, 0, wallH, plaster)
        : box(w.x1 - t, Math.min(w.y1, w.y2), w.x1 + t, Math.max(w.y1, w.y2), 0, wallH, plaster);
      walls.add(m);
    });
    // Ambang, dinding bawah jendela, kaca, kusen, pintu utama
    g.openings.forEach((o) => {
      const t = WALL_T.ext / 2;
      const room = g.rooms.find((r) => r.id === o.room);
      const head = o.kind === "open" ? 2.4 : 2.2;
      const sill = o.kind === "window" ? (room?.type === "km" ? 1.5 : 0.9) : 0;
      const seg = (z0: number, z1: number, mat: THREE.Material, inset = 0) => {
        if (z1 <= z0) return;
        walls.add(o.dir === "h" ? box(o.s, o.at - t + inset, o.e, o.at + t - inset, z0, z1, mat) : box(o.at - t + inset, o.s, o.at + t - inset, o.e, z0, z1, mat));
      };
      if (head < wallH) seg(head, wallH, plaster);
      if (o.kind === "window") {
        seg(0, Math.min(sill, wallH), plaster);
        const top = Math.min(head, wallH);
        if (top > sill) {
          seg(sill, top, glass, t - 0.01);
          seg(sill, sill + 0.05, frame, t - 0.03);
          seg(top - 0.05, top, frame, t - 0.03);
        }
      } else if (o.kind === "main") {
        seg(0, Math.min(head, wallH), color("#7a5236", 0.6), t - 0.025);
      }
    });
    walls.position.y = base;
    group.add(walls);
    return { group, walls };
  };

  const lower = buildFloor(geoms[0], 0);
  root.add(lower.group);

  // Fasad: panel roster di samping pintu utama dan kanopi carport
  const entry = geoms[0].openings.find((o) => o.kind === "main");
  if (entry) {
    const front = geoms[0].bandY[1];
    const rx = Math.min(W - 1.0, entry.e + 0.35);
    if (rx > entry.e) {
      const ros = textured("roster", 1, 3, 0.9);
      lower.walls.add(box(rx, front - 0.35, rx + 0.9, front - 0.25, 0 - PEIL, Math.min(wallH, 3.1) - PEIL, ros));
    }
  }
  let cx = 0;
  plan.floors[0][0].forEach((c) => {
    if (c.type === "carport" && !cut) {
      root.add(box(cx, 0.4, cx + c.w, plan.bands[0].d, 2.9, 3.0, color("#e9e5de", 0.7)));
      [cx + 0.1, cx + c.w - 0.2].forEach((px) => root.add(box(px, 0.4, px + 0.1, 0.5, 0, 2.9, frame)));
    }
    cx += c.w;
  });

  let upper: THREE.Group | null = null;
  if (geoms[1] && opts.upper) {
    const u = buildFloor(geoms[1], 1);
    // Panel kayu di dinding depan lantai 2
    const fr = geoms[1].rooms.filter((r) => !isOpen(r.type) && r.type !== "void").sort((a, b) => a.y - b.y || a.x - b.x)[0];
    if (fr && !cut) {
      const cl = textured("cladding", fr.w / 2, 1.5, 0.75);
      u.walls.add(box(fr.x + 0.05, fr.y - 0.12, fr.x + Math.min(fr.w, 2.4), fr.y - 0.08, 0, wallH, cl));
    }
    upper = u.group;
    root.add(upper);
  }
  // Atap dak di atas lantai 1 yang tidak ditutup lantai 2
  if (geoms[1] && !cut) {
    geoms[1].rooms
      .filter((r) => r.type === "void" && r.kind !== "front" && r.kind !== "back")
      .forEach((r) => root.add(box(r.x, r.y, r.x + r.w, r.y + r.d, PEIL + WALL_H, PEIL + WALL_H + 0.15, color("#d9d4cb", 0.9))));
  }

  // Atap
  let roofGroup: THREE.Group | null = null;
  if (opts.roof && (geoms.length === 1 || opts.upper)) {
    roofGroup = new THREE.Group();
    const top = geoms[geoms.length - 1];
    const rooms = top.rooms.filter((r) => !isOpen(r.type));
    const y0 = Math.min(...rooms.map((r) => r.y));
    const y1 = Math.max(...rooms.map((r) => r.y + r.d));
    const zt = PEIL + (geoms.length - 1) * FLOOR_H + WALL_H;
    const o = 0.6;
    if (plan.brief.roof === "datar") {
      roofGroup.add(box(0, y0, W, y1, zt, zt + 0.15, color("#d9d4cb", 0.9)));
      roofGroup.add(box(-0.05, y0 - 0.05, W + 0.05, y0 + 0.1, zt, zt + 0.9, plaster));
      roofGroup.add(box(-0.05, y1 - 0.1, W + 0.05, y1 + 0.05, zt, zt + 0.9, plaster));
      roofGroup.add(box(-0.05, y0, 0.1, y1, zt, zt + 0.9, plaster));
      roofGroup.add(box(W - 0.1, y0, W + 0.05, y1, zt, zt + 0.9, plaster));
    } else {
      const hr = (W / 2 + o) * Math.tan((30 * Math.PI) / 180) * (plan.brief.roof === "perisai" ? 0.8 : 1);
      const P = (x: number, y: number, z: number) => new THREE.Vector3(x - W / 2, z, D / 2 - y);
      const quad = (pts: THREE.Vector3[]) => {
        const geo = new THREE.BufferGeometry();
        const v = pts.length === 4 ? [pts[0], pts[1], pts[2], pts[0], pts[2], pts[3]] : pts;
        geo.setFromPoints(v);
        const uv: number[] = [];
        v.forEach((p) => uv.push(p.x / 2, (p.y + p.z) / 2));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, std("roof", () => {
          const t = tex.roof.clone();
          t.repeat.set(1, 1);
          return new THREE.MeshStandardMaterial({ map: t, roughness: 0.75, side: THREE.DoubleSide });
        }));
        m.castShadow = true;
        m.receiveShadow = true;
        roofGroup!.add(m);
      };
      const xa = -o;
      const xb = W + o;
      const ya = y0 - o;
      const yb = y1 + o;
      const zr = zt + hr;
      if (plan.brief.roof === "pelana") {
        quad([P(xa, ya, zt), P(xa, yb, zt), P(W / 2, yb, zr), P(W / 2, ya, zr)]);
        quad([P(W / 2, ya, zr), P(W / 2, yb, zr), P(xb, yb, zt), P(xb, ya, zt)]);
        // Dinding segitiga depan dan belakang
        [y0, y1].forEach((yy) => {
          const geo = new THREE.BufferGeometry().setFromPoints([P(0, yy, zt), P(W, yy, zt), P(W / 2, yy, zt + (W / 2) * Math.tan((30 * Math.PI) / 180))]);
          geo.computeVertexNormals();
          const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#f1eee8", roughness: 0.9, side: THREE.DoubleSide }));
          m.castShadow = true;
          roofGroup!.add(m);
        });
      } else {
        const inset = Math.min((xb - xa) / 2, (yb - ya) / 2) * 0.999;
        const ra = ya + inset;
        const rb = Math.max(ra, yb - inset);
        quad([P(xa, ya, zt), P(xa, yb, zt), P(W / 2, rb, zr), P(W / 2, ra, zr)]);
        quad([P(xb, ya, zt), P(W / 2, ra, zr), P(W / 2, rb, zr), P(xb, yb, zt)]);
        quad([P(xa, ya, zt), P(W / 2, ra, zr), P(xb, ya, zt)]);
        quad([P(xa, yb, zt), P(xb, yb, zt), P(W / 2, rb, zr)]);
      }
      // Lisplang
      roofGroup.add(box(xa, ya - 0.02, xb, ya + 0.04, zt - 0.2, zt, color("#2f3236", 0.6)));
    }
    root.add(roofGroup);
  }

  return { root, lower: lower.group, lowerWalls: lower.walls, upper, roof: roofGroup, span: Math.max(W, D) };
}

function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
      const map = (x as THREE.MeshStandardMaterial).map;
      if (map) map.dispose();
      x.dispose();
    });
  });
}

export default function Viewer3D({
  plan,
  s,
  roof,
  upper,
  autoRotate = false,
  apiRef,
  onError,
  label,
}: {
  plan: Plan;
  s: number;
  roof: boolean;
  upper: boolean;
  autoRotate?: boolean;
  apiRef?: React.MutableRefObject<Viewer3DApi | null>;
  onError?: () => void;
  label: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    tex: Textures;
    house: House | null;
    userMoved: boolean;
    raf: number;
    visible: boolean;
    s: number;
  } | null>(null);

  // Siapkan renderer sekali
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
    } catch {
      onError?.();
      return;
    }
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef0ec");
    scene.fog = new THREE.Fog("#eef0ec", 40, 110);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const hemi = new THREE.HemisphereLight("#ffffff", "#c9c1b2", 0.55);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight("#fff3e0", 2.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    scene.add(sun);
    scene.add(sun.target);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.zoomToCursor = false;
    controls.addEventListener("start", () => {
      if (state.current) state.current.userMoved = true;
    });

    const st = { renderer, scene, camera, controls, tex: makeTextures(), house: null as House | null, userMoved: false, raf: 0, visible: true, s: 1 };
    state.current = st;

    const resize = () => {
      const w = el.clientWidth || 600;
      const h = el.clientHeight || 450;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const io = new IntersectionObserver(([e]) => (st.visible = e.isIntersecting));
    io.observe(el);

    const loop = () => {
      st.raf = requestAnimationFrame(loop);
      if (!st.visible) return;
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    if (apiRef)
      apiRef.current = {
        snapshot: (w?: number, h?: number) => {
          if (w && h) {
            const prev = new THREE.Vector2();
            renderer.getSize(prev);
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            const url = renderer.domElement.toDataURL("image/png");
            renderer.setSize(prev.x, prev.y, false);
            camera.aspect = prev.x / prev.y;
            camera.updateProjectionMatrix();
            return url;
          }
          renderer.render(scene, camera);
          return renderer.domElement.toDataURL("image/png");
        },
      };

    return () => {
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      if (st.house) disposeGroup(st.house.root);
      Object.values(st.tex).forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      state.current = null;
      if (apiRef) apiRef.current = null;
    };
  }, [apiRef, onError]);

  // Bangun ulang rumah saat denah atau pilihan atap/lantai berubah
  useEffect(() => {
    const st = state.current;
    if (!st) return;
    if (st.house) {
      st.scene.remove(st.house.root);
      disposeGroup(st.house.root);
    }
    const house = buildHouse(plan, st.tex, { roof, upper });
    st.house = house;
    st.scene.add(house.root);
    const span = house.span;
    const sun = st.scene.children.find((c) => c instanceof THREE.DirectionalLight) as THREE.DirectionalLight;
    sun.position.set(-span * 0.9, span * 1.4, span * 0.8);
    const sc = sun.shadow.camera;
    sc.left = sc.bottom = -span * 0.9;
    sc.right = sc.top = span * 0.9;
    sc.near = 0.5;
    sc.far = span * 5;
    sc.updateProjectionMatrix();
    st.controls.minDistance = span * 0.6;
    st.controls.maxDistance = span * 3.2;
  }, [plan, roof, upper]);

  // Cerita 2D -> 3D dan putar otomatis
  useEffect(() => {
    const st = state.current;
    if (!st || !st.house) return;
    if (s < 0.02) st.userMoved = false;
    const h = st.house;
    const span = h.span;
    const cam = ease(s / 0.35);
    const walls = ease((s - 0.12) / 0.33);
    const up = ease((s - 0.45) / 0.3);
    const rf = ease((s - 0.78) / 0.22);
    h.lowerWalls.scale.y = Math.max(0.02, walls);
    h.lowerWalls.visible = walls > 0.01;
    if (h.upper) {
      h.upper.visible = up > 0.01;
      h.upper.position.y = (1 - up) * 6;
    }
    if (h.roof) {
      h.roof.visible = rf > 0.01;
      h.roof.position.y = (1 - rf) * 4;
    }
    if (!st.userMoved) {
      const target = new THREE.Vector3(0, 1.2 * cam, 0);
      const top = new THREE.Vector3(0, span * 2.25, 0.001);
      const az = (-38 * Math.PI) / 180;
      const pol = (58 * Math.PI) / 180;
      const r = span * 1.55;
      const end = new THREE.Vector3(r * Math.sin(pol) * Math.sin(az), r * Math.cos(pol) + 1.2, r * Math.sin(pol) * Math.cos(az));
      st.camera.position.copy(top.clone().lerp(end, cam));
      st.controls.target.copy(target);
      st.camera.lookAt(target);
    }
    st.controls.autoRotate = autoRotate && s >= 1;
    st.controls.autoRotateSpeed = 0.6;
    st.s = s;
  }, [s, plan, roof, upper, autoRotate]);

  return <div ref={wrap} className="h-full w-full cursor-grab active:cursor-grabbing" role="img" aria-label={label} />;
}

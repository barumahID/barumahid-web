import { floorArea, normalizeBrief } from "./layout";
import { ROOF_LABEL, ROOM_META, type Brief, type Cell, type Plan, type Roof, type RoomType } from "./types";

// Pembaca cerita proyek tanpa AI (cadangan saat AI belum aktif) dan penyimpan denah ke tautan.

const WORDS: Record<string, number> = { satu: 1, sebuah: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6 };
const numOf = (s: string) => (WORDS[s.toLowerCase()] ?? Number(s.replace(",", ".")));
const N = "(\\d+(?:[.,]\\d+)?|satu|dua|tiga|empat|lima|enam)";

/** Ambil kebutuhan dari cerita bebas (bahasa Indonesia sehari-hari). Yang tidak disebut memakai nilai sekarang. */
export function parseStory(text: string, current: Brief): { brief: Brief; found: string[] } {
  const s = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
  const out: Partial<Brief> = { ...current };
  const found: string[] = [];

  const size = s.match(/(\d+(?:[.,]\d+)?)\s*(?:m(?:eter)?)?\s*[x×*]\s*(\d+(?:[.,]\d+)?)/);
  if (size) {
    let a = numOf(size[1]);
    let b = numOf(size[2]);
    if (a > b) [a, b] = [b, a]; // lebar biasanya sisi yang lebih pendek
    out.landW = a;
    out.landD = b;
    found.push("lahan");
  } else {
    const lebar = s.match(/lebar\s*(?:lahan|tanah)?\s*(\d+(?:[.,]\d+)?)/);
    const panjang = s.match(/(?:panjang|dalam|kedalaman)\s*(?:lahan|tanah)?\s*(\d+(?:[.,]\d+)?)/);
    if (lebar) out.landW = numOf(lebar[1]);
    if (panjang) out.landD = numOf(panjang[1]);
    if (lebar || panjang) found.push("lahan");
    else {
      // Hanya luas tanah yang disebut (misalnya "tanah 120 m2"): pakai lebar yang umum di perumahan
      const luas = s.match(/(?:tanah|lahan|kavling)[^0-9]{0,12}(\d{2,4})\s*(?:m2|m²|meter persegi)/);
      if (luas) {
        const a = Number(luas[1]);
        const w = a <= 90 ? 6 : a <= 160 ? 8 : a <= 250 ? 10 : 12;
        out.landW = w;
        out.landD = Math.round((a / w) * 2) / 2;
        found.push("lahan");
      }
    }
  }

  const lantai = s.match(new RegExp(`${N}\\s*(?:lantai|lt\\b|tingkat)`));
  if (lantai) {
    out.floors = numOf(lantai[1]) >= 2 ? 2 : 1;
    found.push("lantai");
  } else if (/rumah tingkat|bertingkat|dua tingkat/.test(s)) {
    out.floors = 2;
    found.push("lantai");
  }

  const kt = s.match(new RegExp(`${N}\\s*(?:kamar tidur|kt\\b|kamar(?!\\s*mandi))`));
  if (kt) {
    out.bedrooms = numOf(kt[1]);
    found.push("kamar");
  }
  const km = s.match(new RegExp(`${N}\\s*(?:kamar mandi|km\\b|toilet|wc\\b)`));
  if (km) {
    out.bathrooms = numOf(km[1]);
    found.push("kamar mandi");
  }

  if (/tanpa (?:carport|garasi)|tidak (?:pakai|perlu) (?:carport|garasi)/.test(s)) {
    out.carport = 0;
    found.push("carport");
  } else if (/carport|garasi|parkir/.test(s)) {
    const mobil = s.match(new RegExp(`${N}\\s*mobil`));
    out.carport = mobil && numOf(mobil[1]) >= 2 ? 2 : 1;
    found.push("carport");
  }

  const flags: [RegExp, "mushola" | "workRoom" | "storage" | "laundry", string][] = [
    [/mushol|musal|ruang sholat|ruang shalat|ruang ibadah/, "mushola", "mushola"],
    [/ruang kerja|kantor|studio|ruang belajar|home office/, "workRoom", "ruang kerja"],
    [/gudang/, "storage", "gudang"],
    [/jemur|cuci|laundry/, "laundry", "cuci jemur"],
  ];
  for (const [re, key, label] of flags) {
    if (re.test(s)) {
      out[key] = true;
      found.push(label);
    }
  }

  const roof: Roof | null = /pelana/.test(s) ? "pelana" : /perisai|limas/.test(s) ? "perisai" : /\bdak\b|atap datar|flat|beton/.test(s) ? "datar" : null;
  if (roof) {
    out.roof = roof;
    found.push("atap");
  }

  return { brief: normalizeBrief(out), found };
}

// ---- Simpan denah ke teks pendek (untuk tautan dan lampiran form) ----

const TYPES = Object.keys(ROOM_META) as RoomType[];

function toB64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(code: string) {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodePlan(plan: Plan): string {
  const data = {
    v: 1,
    b: plan.brief,
    d: plan.bands.map((b) => [b.kind, b.d]),
    f: plan.floors.map((bands) => bands.map((cells) => cells.map((c) => [TYPES.indexOf(c.type), c.w]))),
  };
  return toB64Url(JSON.stringify(data));
}

/** Baca kembali denah dari tautan. Kembalikan null kalau isinya tidak valid. */
export function decodePlan(code: string): Plan | null {
  try {
    if (code.length > 6000) return null;
    const raw = JSON.parse(fromB64Url(code)) as { v: number; b: Partial<Brief>; d: [string, number][]; f: [number, number][][][] };
    if (raw.v !== 1 || !Array.isArray(raw.d) || !Array.isArray(raw.f) || raw.f.length < 1 || raw.f.length > 2) return null;
    const brief = normalizeBrief(raw.b);
    const kinds = ["front", "P", "R", "H", "back"];
    const bands = raw.d.map(([kind, d]) => {
      if (!kinds.includes(kind) || !(d > 0.3 && d < 40)) throw new Error("band");
      return { id: kind, kind: kind as Plan["bands"][number]["kind"], d: Number(d) };
    });
    const D = bands.reduce((s, b) => s + b.d, 0);
    if (Math.abs(D - brief.landD) > 0.05) return null;
    let n = 0;
    const floors: Cell[][][] = raw.f.map((bandsCells, fi) => {
      if (bandsCells.length !== bands.length) throw new Error("bands");
      return bandsCells.map((cells, bi) => {
        const row = cells.map(([ti, w]) => {
          const type = TYPES[ti];
          if (!type || !(w > 0.05)) throw new Error("cell");
          return { id: `f${fi + 1}-${bands[bi].kind}-u${(n++).toString(36)}`, type, w: Number(w) };
        });
        if (Math.abs(row.reduce((s, c) => s + c.w, 0) - brief.landW) > 0.05) throw new Error("width");
        return row;
      });
    });
    return { v: 1, brief: { ...brief, floors: floors.length === 2 ? 2 : 1 }, bands, floors, warnings: [] };
  } catch {
    return null;
  }
}

const num = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");

/** Ringkasan bahasa Indonesia (nilai yang dikirim ke CRM tetap bahasa Indonesia). */
export function planSummary(plan: Plan) {
  const b = plan.brief;
  const area = plan.floors.reduce((s, _, i) => s + floorArea(plan, i), 0);
  const parts = [
    `lahan ${num(b.landW)} × ${num(b.landD)} m`,
    `${b.floors} lantai`,
    `${b.bedrooms} kamar tidur`,
    `${b.bathrooms} kamar mandi`,
    b.carport ? `carport ${b.carport} mobil` : "tanpa carport",
    b.mushola && "mushola",
    b.workRoom && "ruang kerja",
    b.storage && "gudang",
    `atap ${ROOF_LABEL[b.roof].toLowerCase()}`,
  ].filter(Boolean);
  return `${parts.join(", ")}. Luas bangunan ± ${area} m².`;
}

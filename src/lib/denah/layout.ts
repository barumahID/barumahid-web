import { DEFAULT_BRIEF, LIMITS, ROOM_META, type BandDef, type BandKind, type Brief, type Cell, type Note, type Plan, type Roof, type RoomType } from "./types";

// Rumus tata letak denah konsep (tanpa AI). Pola rumah Indonesia yang umum:
// depan = carport dan teras; baris depan = ruang tamu dan kamar; baris tengah = ruang keluarga (pusat) dan tangga;
// baris belakang = kamar, kamar mandi, dapur; paling belakang = cuci jemur atau taman.
// Semua ruang menempel ke ruang tengah, jadi setiap ruang punya akses tanpa lorong.
// Lantai 2 memakai pita yang sama (dinding dan tangga sejajar), ruang tengahnya ruang santai.

type RowKey = "P" | "R" | "H";

const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Rapikan isian (dari form, AI, atau tautan) supaya selalu valid. */
export function normalizeBrief(input: Partial<Record<keyof Brief, unknown>> | null | undefined): Brief {
  const b = input ?? {};
  const num = (v: unknown, d: number) => {
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(",", ".")) : NaN;
    return Number.isFinite(n) ? n : d;
  };
  const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
  const roof: Roof = b.roof === "perisai" || b.roof === "datar" || b.roof === "pelana" ? b.roof : DEFAULT_BRIEF.roof;
  const floors = num(b.floors, DEFAULT_BRIEF.floors) >= 2 ? 2 : 1;
  const carportN = Math.round(clamp(num(b.carport, DEFAULT_BRIEF.carport), 0, 2)) as 0 | 1 | 2;
  return {
    landW: r2(clamp(num(b.landW, DEFAULT_BRIEF.landW), LIMITS.landW[0], LIMITS.landW[1])),
    landD: r2(clamp(num(b.landD, DEFAULT_BRIEF.landD), LIMITS.landD[0], LIMITS.landD[1])),
    floors,
    bedrooms: Math.round(clamp(num(b.bedrooms, DEFAULT_BRIEF.bedrooms), LIMITS.bedrooms[0], LIMITS.bedrooms[1])),
    bathrooms: Math.round(clamp(num(b.bathrooms, DEFAULT_BRIEF.bathrooms), LIMITS.bathrooms[0], LIMITS.bathrooms[1])),
    carport: carportN,
    mushola: bool(b.mushola, false),
    workRoom: bool(b.workRoom, false),
    storage: bool(b.storage, false),
    laundry: bool(b.laundry, DEFAULT_BRIEF.laundry),
    roof,
  };
}

/** Bagi lebar total ke sel: mulai dari ukuran yang disarankan, kecilkan ke minimum atau bagi sisa sesuai bobot. */
function distribute(types: RoomType[], total: number): number[] {
  const meta = types.map((t) => ROOM_META[t]);
  const sumMin = meta.reduce((s, m) => s + m.min, 0);
  const sumPref = meta.reduce((s, m) => s + m.pref, 0);
  let ws: number[];
  if (total <= sumMin) {
    ws = meta.map((m) => (sumMin > 0 ? (m.min * total) / sumMin : total / meta.length));
  } else if (total <= sumPref) {
    const k = sumPref === sumMin ? 0 : (total - sumMin) / (sumPref - sumMin);
    ws = meta.map((m) => m.min + (m.pref - m.min) * k);
  } else {
    // Sisa lebar dibagi sesuai bobot; ruang yang sudah mencapai lebar maksimum tidak ikut menerima lagi
    ws = meta.map((m) => m.pref);
    let extra = total - sumPref;
    for (let round = 0; round < 6 && extra > 0.001; round++) {
      const open = meta.map((m, i) => (m.max === undefined || ws[i] < m.max - 1e-6) && m.grow > 0);
      const g = meta.reduce((s, m, i) => s + (open[i] ? m.grow : 0), 0);
      if (g <= 0) break;
      let used = 0;
      ws = ws.map((w, i) => {
        if (!open[i]) return w;
        const add = (extra * meta[i].grow) / g;
        const next = meta[i].max !== undefined ? Math.min(meta[i].max!, w + add) : w + add;
        used += next - w;
        return next;
      });
      extra -= used;
    }
    if (extra > 0.001) {
      // Semua sudah maksimum: sisa ke ruang dengan bobot terbesar
      let best = 0;
      meta.forEach((m, i) => {
        if (m.grow > meta[best].grow) best = i;
      });
      ws[best] += extra;
    }
  }
  return snap(ws, total);
}

/** Bulatkan ke 5 cm dan pastikan jumlahnya tepat sama dengan total. */
export function snap(ws: number[], total: number, step = 0.05): number[] {
  const out = ws.map((w) => Math.round(w / step) * step);
  const diff = total - out.reduce((s, w) => s + w, 0);
  if (out.length) {
    let big = 0;
    out.forEach((w, i) => {
      if (w > out[big]) big = i;
    });
    out[big] += diff;
  }
  return out.map(r2);
}

/** Urutkan ruang dalam satu baris: kamar dulu, kamar mandi menyelip setelah kamar pertama, lalu ruang lain. */
function orderRow(types: RoomType[]): RoomType[] {
  const beds: RoomType[] = types.filter((t) => t === "kamar_utama" || t === "kamar").sort((a, b) => (a === "kamar_utama" ? -1 : b === "kamar_utama" ? 1 : 0));
  const baths = types.filter((t) => t === "km");
  const rest = types.filter((t) => !beds.includes(t) && t !== "km");
  const out: RoomType[] = [];
  beds.forEach((b, i) => {
    out.push(b);
    if (baths.length && (i === 0 || i === beds.length - 1)) out.push(baths.shift()!);
  });
  return [...out, ...baths, ...rest];
}

// Slot samping di baris tengah (R) selalu pilihan terakhir: ruang di depan/belakangnya jadi sulit diakses
const PREFS: Partial<Record<RoomType, RowKey[]>> = {
  kamar_utama: ["H", "P", "R"],
  kamar: ["P", "H", "R"],
  km: ["H", "P", "R"],
  kerja: ["P", "H", "R"],
  mushola: ["H", "P", "R"],
  gudang: ["H", "P", "R"],
};

interface FloorProgram {
  hub: RoomType;
  /** Ruang wajib di baris tertentu (misalnya ruang tamu di depan, dapur di belakang) */
  fixed: Partial<Record<RowKey, RoomType>>;
  stairs: boolean;
  /** Ruang lain, diurutkan dari yang paling penting */
  rooms: RoomType[];
}

/** Tempatkan ruang ke baris P/R/H selama lebarnya muat. Baris R hanya punya satu slot di samping ruang tengah. */
function placeFloor(prog: FloorProgram, rows: RowKey[], W: number, notes: Note[], floorNo: number) {
  const out: Record<RowKey, RoomType[]> = { P: [], R: [], H: [] };
  const used: Record<RowKey, number> = { P: 0, R: ROOM_META[prog.hub].min + (prog.stairs ? ROOM_META.tangga.min : 0), H: 0 };
  let sideUsed = false;
  for (const [row, t] of Object.entries(prog.fixed) as [RowKey, RoomType][]) {
    const target = rows.includes(row) ? row : "R";
    if (target === "R") {
      // Baris depan tidak ada (lahan pendek): ruang tamu digabung ke ruang tengah
      continue;
    }
    out[target].push(t);
    used[target] += ROOM_META[t].min;
  }
  for (const t of prog.rooms) {
    const prefs = (PREFS[t] ?? ["H", "P", "R"]).filter((r) => rows.includes(r));
    const row = prefs.find((r) => {
      if (r === "R" && sideUsed) return false;
      return used[r] + ROOM_META[t].min <= W + 0.001;
    });
    if (!row) {
      notes.push({ msg: "{ruang} di lantai {lantai} tidak muat di lahan ini. Coba tambah ukuran lahan atau pilih 2 lantai.", vars: { ruang: ROOM_META[t].label, lantai: floorNo } });
      continue;
    }
    if (row === "R") sideUsed = true;
    out[row].push(t);
    used[row] += ROOM_META[t].min;
  }
  return out;
}

let seq = 0;
const cellId = (floor: number, band: string) => `f${floor}-${band}-${(seq++).toString(36)}`;

function rowCells(floor: number, band: BandKind, types: RoomType[], W: number): Cell[] {
  if (!types.length) return [{ id: cellId(floor, band), type: "void", w: r2(W) }];
  // Lebar tangga selalu tetap supaya posisinya sama di lantai 1 dan 2
  const stairW = ROOM_META.tangga.pref;
  const others = types.filter((t) => t !== "tangga");
  const restW = types.includes("tangga") ? W - stairW : W;
  const wsOthers = others.length ? distribute(others, restW) : [];
  let oi = 0;
  const ws = types.map((t) => (t === "tangga" ? stairW : wsOthers[oi++]));
  return types.map((type, i) => ({ id: cellId(floor, band), type, w: ws[i] }));
}

/**
 * Atur ulang urutan sel di baris depan/belakang supaya setiap ruang menempel ke ruang tengah minimal 0,9 m
 * (ruang samping dan tangga di baris tengah bisa menutupi). Kamar mandi boleh hanya menempel ke ruang samping
 * (jadi kamar mandi dalam). Lebar sel tidak berubah, hanya urutannya.
 */
function arrangeForAccess(row: Cell[], hubStart: number, hubEnd: number, sideIsBedroom: boolean, front: boolean): { cells: Cell[]; bad: number } {
  const bed = (c?: Cell) => c?.type === "kamar" || c?.type === "kamar_utama";
  const violations = (cells: Cell[]) => {
    let x = 0;
    let bad = 0;
    cells.forEach((c, i) => {
      const overlap = Math.min(x + c.w, hubEnd) - Math.max(x, hubStart);
      const prev = cells[i - 1];
      const next = cells[i + 1];
      const ok =
        c.type === "void" ||
        overlap >= 1.15 ||
        (front && (prev?.type === "tamu" || next?.type === "tamu")) ||
        (c.type === "km" && (bed(prev) || bed(next) || (sideIsBedroom && x < hubStart))) ||
        (c.type === "gudang" && (prev?.type === "dapur" || next?.type === "dapur"));
      if (!ok) bad++;
      x += c.w;
    });
    return bad;
  };
  if (violations(row) === 0) return { cells: row, bad: 0 };
  // Ruang tamu (depan, menghadap teras) dan dapur (belakang) tetap di ujung kanan; sisanya boleh ditukar
  const fixed = row.filter((c) => c.type === "tamu" || c.type === "dapur");
  const free = row.filter((c) => !fixed.includes(c));
  if (free.length > 6) return { cells: row, bad: violations(row) };
  const perms = (list: Cell[]): Cell[][] => (list.length <= 1 ? [list] : list.flatMap((c, i) => perms([...list.slice(0, i), ...list.slice(i + 1)]).map((p) => [c, ...p])));
  let best = row;
  let bestBad = violations(row);
  for (const p of perms(free)) {
    const cand = [...p, ...fixed];
    const bad = violations(cand);
    if (bad < bestBad) {
      best = cand;
      bestBad = bad;
      if (bad === 0) break;
    }
  }
  return { cells: best, bad: bestBad };
}

/** Kedalaman pita: mulai dari ukuran yang disarankan lalu disesuaikan ke panjang lahan. */
function bandDepths(b: Brief, rowCount: 2 | 3, notes: Note[]) {
  const D = b.landD;
  const fMin = b.carport ? 5 : 1.5;
  let f = b.carport ? 5.5 : 3;
  let back = 2;
  const rowMin = b.floors === 2 ? 3.2 : 3;
  const prefRows = rowCount === 3 ? [3.8, 4, 3.6] : [4.2, 3.8];
  let rows = [...prefRows];
  const sum = () => f + back + rows.reduce((s, x) => s + x, 0);
  if (sum() > D) {
    back = Math.max(1, back - (sum() - D));
    if (sum() > D) f = Math.max(fMin, f - (sum() - D));
    if (sum() > D) {
      const avail = D - f - back;
      const minSum = rowMin * rows.length;
      const prefSum = prefRows.reduce((s, x) => s + x, 0);
      rows = avail >= minSum ? prefRows.map((p) => rowMin + ((p - rowMin) * (avail - minSum)) / (prefSum - minSum)) : prefRows.map(() => avail / prefRows.length);
      if (avail < minSum) notes.push({ msg: "Lahan cukup pendek, ruang jadi lebih sempit dari ukuran ideal." });
    }
  } else {
    let extra = D - sum();
    const addBack = Math.min(extra, 1);
    back += addBack;
    extra -= addBack;
    const room = rows.map((x) => Math.max(0, 5 - x));
    const roomSum = room.reduce((s, x) => s + x, 0);
    const add = Math.min(extra, roomSum);
    rows = rows.map((x, i) => x + (roomSum ? (add * room[i]) / roomSum : 0));
    extra -= add;
    f += extra;
  }
  return snap([f, ...rows, back], D);
}

/** Susun denah konsep dari kebutuhan. Hasilnya bisa diedit (geser dinding, ganti fungsi ruang). */
export function buildPlan(input: Brief): Plan {
  const b = normalizeBrief(input);
  seq = 0; // id sel selalu sama untuk kebutuhan yang sama (render server dan browser cocok)
  const W = b.landW;
  const notes: Note[] = [];
  const twoFloors = b.floors === 2;
  const buildDepth = b.landD - (b.carport ? 5 : 1.5) - 1;
  // Tiga baris ruang kalau lahan cukup panjang (rumah 2 lantai butuh baris tengah lebih dalam untuk tangga)
  const rowCount: 2 | 3 = buildDepth >= (twoFloors ? 9.6 : 9) ? 3 : 2;
  const rowKeys: RowKey[] = rowCount === 3 ? ["P", "R", "H"] : ["R", "H"];

  // Bagi kamar dan kamar mandi ke lantai
  const f1Beds = twoFloors ? (b.bedrooms >= 3 ? 1 : 0) : b.bedrooms;
  const f2Beds = b.bedrooms - f1Beds;
  const f1Baths = twoFloors ? 1 : b.bathrooms;
  const f2Baths = b.bathrooms - f1Baths;
  if (twoFloors && f2Beds > 0 && f2Baths === 0) notes.push({ msg: "Lantai 2 belum punya kamar mandi. Tambah jumlah kamar mandi kalau perlu." });

  const beds = (n: number, master: boolean): RoomType[] => Array.from({ length: n }, (_, i) => (master && i === 0 ? "kamar_utama" : "kamar"));
  // Urutan prioritas: kamar pertama, kamar mandi pertama, kamar lain, kamar mandi lain, ruang tambahan
  const program = (bedList: RoomType[], baths: number): RoomType[] => {
    const kms = Array<RoomType>(Math.max(0, baths)).fill("km");
    return [...bedList.slice(0, 1), ...kms.slice(0, 1), ...bedList.slice(1), ...kms.slice(1)];
  };
  const f1Rooms: RoomType[] = [
    ...program(beds(f1Beds, !twoFloors), f1Baths),
    ...(b.workRoom && !twoFloors ? (["kerja"] as RoomType[]) : []),
    ...(b.mushola ? (["mushola"] as RoomType[]) : []),
    ...(b.storage ? (["gudang"] as RoomType[]) : []),
  ];
  const f1 = placeFloor(
    {
      hub: rowCount === 3 ? "keluarga" : "tamu_keluarga",
      fixed: rowCount === 3 ? { P: "tamu", H: "dapur" } : { H: "dapur" },
      stairs: twoFloors,
      rooms: f1Rooms,
    },
    rowKeys,
    W,
    notes,
    1,
  );

  const depths = bandDepths(b, rowCount, notes);
  const bandKinds: BandKind[] = ["front", ...rowKeys, "back"];
  const bands: BandDef[] = bandKinds.map((kind, i) => ({ id: kind, kind, d: depths[i] }));

  // Halaman depan: carport di kiri, teras di kanan (di depan ruang tamu)
  const frontCells = (): Cell[] => {
    if (b.carport) {
      const cw = Math.min(W, b.carport === 2 ? 5.6 : 3.2);
      const rest = r2(W - cw);
      return rest >= 1.2
        ? [
            { id: cellId(1, "front"), type: "carport", w: r2(cw) },
            { id: cellId(1, "front"), type: "teras", w: rest },
          ]
        : [{ id: cellId(1, "front"), type: "carport", w: r2(W) }];
    }
    const tw = Math.min(W, 3.5);
    return W - tw >= 0.8
      ? [
          { id: cellId(1, "front"), type: "taman", w: r2(W - tw) },
          { id: cellId(1, "front"), type: "teras", w: r2(tw) },
        ]
      : [{ id: cellId(1, "front"), type: "teras", w: r2(W) }];
  };
  const backCells = (): Cell[] => {
    if (b.laundry && W >= 4) {
      const jw = Math.min(2.6, r2(W * 0.4));
      return [
        { id: cellId(1, "back"), type: "jemur", w: r2(jw) },
        { id: cellId(1, "back"), type: "taman", w: r2(W - jw) },
      ];
    }
    return [{ id: cellId(1, "back"), type: "taman", w: r2(W) }];
  };

  const rowFor = (floor: number, prog: Record<RowKey, RoomType[]>, key: RowKey, hub: RoomType, stairs: boolean, fixedRight?: RoomType): Cell[] => {
    if (key === "R") {
      const side = prog.R;
      const types: RoomType[] = [...side, hub, ...(stairs ? (["tangga"] as RoomType[]) : [])];
      const cells = rowCells(floor, "R", types, W);
      // Ruang samping dibuat seramping mungkin supaya ruang di depan/belakangnya tetap menempel ke ruang tengah
      if (side.length && cells.length > 1) {
        const slim = r2(Math.min(cells[0].w, ROOM_META[side[0]].min + 0.2));
        cells[1].w = r2(cells[1].w + cells[0].w - slim);
        cells[0].w = slim;
      }
      return cells;
    }
    const list = prog[key].filter((t) => t !== fixedRight);
    const ordered = orderRow(list);
    const fixed = prog[key].includes(fixedRight as RoomType) ? [fixedRight as RoomType] : [];
    return rowCells(floor, key, [...ordered, ...fixed], W);
  };

  const floor1: Cell[][] = bands.map((band) => {
    if (band.kind === "front") return frontCells();
    if (band.kind === "back") return backCells();
    const k = band.kind as RowKey;
    return rowFor(1, f1, k, rowCount === 3 ? "keluarga" : "tamu_keluarga", twoFloors, k === "P" ? "tamu" : k === "H" ? "dapur" : undefined);
  });
  const floors: Cell[][][] = [floor1];
  const fixAccess = (cells: Cell[][], floorNo: number) => {
    const rIdx = bands.findIndex((b) => b.kind === "R");
    const run = () => {
      const r = cells[rIdx];
      const hubAt = r.findIndex((c) => ["keluarga", "santai", "tamu_keluarga"].includes(c.type));
      const hubStart = r.slice(0, hubAt).reduce((s, c) => s + c.w, 0);
      // Di lantai 2 ujung tangga jadi selasar, jadi ruang di atasnya tetap terjangkau
      const hubEnd = floorNo === 2 ? W : hubStart + (r[hubAt]?.w ?? 0);
      const sideIsBedroom = hubAt > 0 && (r[0].type === "kamar" || r[0].type === "kamar_utama");
      let bad = 0;
      const next = cells.map((row, i) => {
        if (bands[i].kind !== "P" && bands[i].kind !== "H") return row;
        const res = arrangeForAccess(row, hubStart, hubEnd, sideIsBedroom, bands[i].kind === "P");
        bad += res.bad;
        return res.cells;
      });
      return { next, bad, hubAt };
    };
    let res = run();
    // Ruang samping menghalangi akses ruang lain: lepas ruang samping (gabung ke ruang tengah)
    if (res.bad > 0 && res.hubAt > 0) {
      const r = cells[rIdx];
      const side = r[0];
      cells[rIdx] = [{ ...r[1], w: r2(r[1].w + side.w) }, ...r.slice(2)];
      notes.push({ msg: "{ruang} di lantai {lantai} tidak muat di lahan ini. Coba tambah ukuran lahan atau pilih 2 lantai.", vars: { ruang: ROOM_META[side.type].label, lantai: floorNo } });
      res = run();
    }
    res.next.forEach((row, i) => (cells[i] = row));
    return cells;
  };
  fixAccess(floor1, 1);

  if (twoFloors) {
    const f2Rooms: RoomType[] = [...program(beds(f2Beds, true), f2Baths), ...(b.workRoom ? (["kerja"] as RoomType[]) : [])];
    const f2 = placeFloor({ hub: "santai", fixed: {}, stairs: true, rooms: f2Rooms }, rowKeys, W, notes, 2);
    const floor2: Cell[][] = bands.map((band) => {
      if (band.kind === "back") return [{ id: cellId(2, "back"), type: "void", w: r2(W) }];
      if (band.kind === "front") {
        // Balkon di atas teras kalau baris depan lantai 2 berisi ruang
        const frontRow = rowKeys[0];
        const hasFrontRooms = frontRow === "P" ? f2.P.length > 0 : true;
        if (!hasFrontRooms) return [{ id: cellId(2, "front"), type: "void", w: r2(W) }];
        const bw = Math.min(W, 3.5);
        return W - bw >= 0.5
          ? [
              { id: cellId(2, "front"), type: "void", w: r2(W - bw) },
              { id: cellId(2, "front"), type: "balkon", w: r2(bw) },
            ]
          : [{ id: cellId(2, "front"), type: "balkon", w: r2(W) }];
      }
      return rowFor(2, f2, band.kind as RowKey, "santai", true);
    });
    floors.push(fixAccess(floor2, 2));
  }

  return { v: 1, brief: b, bands, floors, warnings: notes };
}

/** Luas lantai bangunan (tanpa halaman, carport, teras, balkon), m² */
export function floorArea(plan: Plan, floor: number) {
  let a = 0;
  plan.floors[floor]?.forEach((cells, bi) => {
    const d = plan.bands[bi].d;
    cells.forEach((c) => {
      if (!["carport", "teras", "taman", "jemur", "balkon", "void"].includes(c.type)) a += c.w * d;
    });
  });
  return Math.round(a);
}

export function totalArea(plan: Plan) {
  return plan.floors.reduce((s, _, i) => s + floorArea(plan, i), 0);
}

export { clamp, r2 };

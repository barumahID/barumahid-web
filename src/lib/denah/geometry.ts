import { ROOM_META, isHub, isOpen, type BandKind, type Note, type Plan, type RoomType } from "./types";

// Geometri satu lantai dari Plan: persegi ruang, dinding (dipotong pintu dan jendela), bukaan.
// Dipakai bersama oleh gambar 2D (SVG), tampak depan, 3D (canvas), dan DXF.

export interface RoomRect {
  id: string;
  type: RoomType;
  band: number;
  kind: BandKind;
  x: number;
  y: number;
  w: number;
  d: number;
}

export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Dinding luar (salah satu sisinya halaman, void, atau batas lahan) */
  ext: boolean;
  /** Ruang di sisi kiri/depan dan kanan/belakang (bisa kosong) */
  a?: string;
  b?: string;
}

export type OpeningKind = "door" | "main" | "open" | "window";

export interface Opening {
  kind: OpeningKind;
  /** "h" = di dinding mendatar (sejajar sumbu x), "v" = di dinding tegak */
  dir: "h" | "v";
  /** Posisi garis dinding (y untuk "h", x untuk "v") dan rentang bukaan di sepanjang dinding */
  at: number;
  s: number;
  e: number;
  /** Ruang tujuan daun pintu membuka (+1 = arah sumbu positif, -1 = negatif) */
  side: 1 | -1;
  /** Engsel di ujung awal (s) atau akhir (e) */
  hingeStart: boolean;
  room?: string;
}

export interface FloorGeom {
  floor: number;
  W: number;
  D: number;
  bandY: number[];
  rooms: RoomRect[];
  walls: Wall[];
  openings: Opening[];
  notes: Note[];
}

const EPS = 1e-6;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function bandOffsets(plan: Plan) {
  const ys: number[] = [];
  let y = 0;
  plan.bands.forEach((b) => {
    ys.push(r3(y));
    y += b.d;
  });
  return ys;
}

export function floorRooms(plan: Plan, floor: number): RoomRect[] {
  const ys = bandOffsets(plan);
  const out: RoomRect[] = [];
  plan.floors[floor]?.forEach((cells, bi) => {
    let x = 0;
    cells.forEach((c) => {
      out.push({ id: c.id, type: c.type, band: bi, kind: plan.bands[bi].kind, x: r3(x), y: ys[bi], w: c.w, d: plan.bands[bi].d });
      x += c.w;
    });
  });
  return out;
}

const isRoom = (r?: RoomRect) => Boolean(r && !isOpen(r.type));
/** Pasangan tanpa dinding: tangga terbuka ke ruang tengah */
const openPair = (a?: RoomRect, b?: RoomRect) =>
  Boolean(a && b && ((isHub(a.type) && b.type === "tangga") || (isHub(b.type) && a.type === "tangga")));

function cellAt(rooms: RoomRect[], band: number, x: number) {
  return rooms.find((r) => r.band === band && x > r.x - EPS && x < r.x + r.w + EPS);
}

/** Semua dinding lantai: batas antar pita (mendatar) dan antar sel (tegak). */
function buildWalls(rooms: RoomRect[], bandCount: number, ys: number[], W: number): Wall[] {
  const walls: Wall[] = [];
  // Dinding mendatar di batas pita
  for (let k = 1; k < bandCount; k++) {
    const y = ys[k];
    const xs = new Set<number>([0, W]);
    rooms.filter((r) => r.band === k - 1 || r.band === k).forEach((r) => {
      xs.add(r3(r.x));
      xs.add(r3(r.x + r.w));
    });
    const pts = [...xs].sort((p, q) => p - q);
    let cur: Wall | null = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const xa = pts[i];
      const xb = pts[i + 1];
      if (xb - xa < EPS) continue;
      const mid = (xa + xb) / 2;
      const a = cellAt(rooms, k - 1, mid);
      const b = cellAt(rooms, k, mid);
      const has = (isRoom(a) || isRoom(b)) && !openPair(a, b);
      if (!has) {
        if (cur) walls.push(cur);
        cur = null;
        continue;
      }
      const ext = !isRoom(a) || !isRoom(b);
      if (cur && cur.a === a?.id && cur.b === b?.id && Math.abs(cur.x2 - xa) < EPS) cur.x2 = xb;
      else {
        if (cur) walls.push(cur);
        cur = { x1: xa, y1: y, x2: xb, y2: y, ext, a: a?.id, b: b?.id };
      }
    }
    if (cur) walls.push(cur);
  }
  // Dinding tegak di dalam pita dan di sisi lahan
  for (let k = 0; k < bandCount; k++) {
    const row = rooms.filter((r) => r.band === k).sort((p, q) => p.x - q.x);
    row.forEach((r, i) => {
      const left = row[i - 1];
      if (i === 0) {
        if (isRoom(r)) walls.push({ x1: 0, y1: r.y, x2: 0, y2: r.y + r.d, ext: true, b: r.id });
      } else if ((isRoom(left) || isRoom(r)) && !openPair(left, r)) {
        walls.push({ x1: r.x, y1: r.y, x2: r.x, y2: r.y + r.d, ext: !isRoom(left) || !isRoom(r), a: left.id, b: r.id });
      }
      if (i === row.length - 1 && isRoom(r)) walls.push({ x1: W, y1: r.y, x2: W, y2: r.y + r.d, ext: true, a: r.id });
    });
  }
  return walls;
}

const dirOf = (w: Wall): "h" | "v" => (Math.abs(w.y1 - w.y2) < EPS ? "h" : "v");
const spanOf = (w: Wall) => (dirOf(w) === "h" ? [Math.min(w.x1, w.x2), Math.max(w.x1, w.x2)] : [Math.min(w.y1, w.y2), Math.max(w.y1, w.y2)]);
const lineOf = (w: Wall) => (dirOf(w) === "h" ? w.y1 : w.x1);

const DOOR_W: Partial<Record<RoomType, number>> = { km: 0.7, gudang: 0.7 };

function connectKind(a: RoomType, b: RoomType): OpeningKind {
  const pair = [a, b];
  const hub = pair.some(isHub);
  if (hub && pair.some((t) => t === "tamu" || t === "dapur" || t === "mushola")) return "open";
  return "door";
}

/** Geometri lengkap satu lantai: ruang, dinding, pintu (akses dari ruang tengah), jendela di dinding luar. */
export function floorGeometry(plan: Plan, floor: number): FloorGeom {
  const W = plan.brief.landW;
  const D = plan.bands.reduce((s, b) => s + b.d, 0);
  const ys = bandOffsets(plan);
  const rooms = floorRooms(plan, floor);
  const walls = buildWalls(rooms, plan.bands.length, ys, W);
  const openings: Opening[] = [];
  const notes: Note[] = [];
  const byId = new Map(rooms.map((r) => [r.id, r]));

  // 1. Akses: mulai dari ruang tengah (dan tangga), sambungkan ruang lain lewat dinding bersama
  const reach = new Set(rooms.filter((r) => isHub(r.type) || r.type === "tangga").map((r) => r.id));
  const indoor = rooms.filter((r) => isRoom(r) && !reach.has(r.id));
  // Urutan pilihan jalan masuk: ruang tengah, ruang tamu, tangga, dapur, kamar (jadi kamar mandi dalam), lainnya
  const score = (t: RoomType) =>
    isHub(t) ? 0 : t === "tamu" ? 1 : t === "tangga" ? 1.5 : t === "dapur" ? 2 : t === "kamar" || t === "kamar_utama" ? 3 : t === "kerja" ? 4 : t === "mushola" ? 6 : t === "gudang" ? 8 : 9;
  let changed = true;
  while (changed) {
    changed = false;
    for (const r of indoor) {
      if (reach.has(r.id)) continue;
      const want = connectKind(r.type, "keluarga") === "open" ? 1.2 : (DOOR_W[r.type] ?? 0.8);
      const options = walls
        .filter((w) => !w.ext && (w.a === r.id || w.b === r.id))
        .map((w) => ({ w, other: byId.get(w.a === r.id ? w.b! : w.a!)! }))
        .filter(({ w, other }) => other && reach.has(other.id) && spanOf(w)[1] - spanOf(w)[0] >= want + 0.3)
        .sort((p, q) => score(p.other.type) - score(q.other.type));
      const pick = options[0];
      if (!pick) continue;
      const kind = connectKind(r.type, pick.other.type);
      const [s0, e0] = spanOf(pick.w);
      const width = kind === "open" ? Math.min(1.6, e0 - s0 - 0.4) : (DOOR_W[r.type] ?? 0.8);
      const s = kind === "open" ? (s0 + e0) / 2 - width / 2 : s0 + 0.15;
      const dir = dirOf(pick.w);
      // Daun pintu membuka ke ruang yang baru disambungkan
      const rCenter = dir === "h" ? r.y + r.d / 2 : r.x + r.w / 2;
      openings.push({ kind, dir, at: lineOf(pick.w), s, e: s + width, side: rCenter > lineOf(pick.w) ? 1 : -1, hingeStart: true, room: r.id });
      reach.add(r.id);
      changed = true;
    }
  }
  indoor.filter((r) => !reach.has(r.id)).forEach((r) => notes.push({ msg: "{ruang} belum punya akses pintu. Geser dindingnya supaya menempel ke ruang lain.", vars: { ruang: ROOM_META[r.type].label } }));

  // 2. Pintu utama (ruang tamu ke teras), pintu belakang (dapur ke halaman belakang), pintu balkon
  const extWall = (roomId: string, toward: (o?: RoomRect) => boolean) =>
    walls.filter((w) => w.ext && dirOf(w) === "h" && (w.a === roomId || w.b === roomId) && toward(byId.get(w.a === roomId ? w.b ?? "" : w.a ?? "")));
  const entry = rooms.find((r) => r.type === "tamu" || r.type === "tamu_keluarga");
  if (entry && floor === 0) {
    const teras = rooms.find((r) => r.type === "teras" && r.band === entry.band - 1);
    const terasOverlap = (w: Wall) => (teras ? Math.min(spanOf(w)[1], teras.x + teras.w) - Math.max(spanOf(w)[0], teras.x) : 0);
    // Dinding depan ruang tamu yang paling banyak menghadap teras (bukan carport)
    const ws = extWall(entry.id, (o) => !o || o.kind === "front" || isOpen(o.type))
      .filter((w) => w.y1 <= entry.y + EPS)
      .sort((p, q) => terasOverlap(q) - terasOverlap(p) || spanOf(q)[1] - spanOf(q)[0] - (spanOf(p)[1] - spanOf(p)[0]));
    const w = ws[0];
    if (w) {
      const [s0, e0] = spanOf(w);
      const ts = teras ? Math.max(s0, teras.x) : s0;
      const te = teras ? Math.min(e0, teras.x + teras.w) : e0;
      const width = Math.min(entry.w >= 3.2 ? 1.2 : 0.9, Math.max(0.8, (te > ts ? te - ts : e0 - s0) - 0.4));
      const c = te - ts > width + 0.2 ? (ts + te) / 2 : (s0 + e0) / 2;
      openings.push({ kind: "main", dir: "h", at: w.y1, s: c - width / 2, e: c + width / 2, side: 1, hingeStart: true, room: entry.id });
    }
  }
  const kitchen = rooms.find((r) => r.type === "dapur");
  if (kitchen) {
    const w = extWall(kitchen.id, (o) => !o || o.kind === "back" || isOpen(o.type)).find((x) => x.y1 >= kitchen.y + kitchen.d - EPS);
    if (w) {
      const [s0, e0] = spanOf(w);
      const s = Math.max(s0 + 0.2, e0 - 1.1);
      openings.push({ kind: "door", dir: "h", at: w.y1, s, e: s + 0.8, side: -1, hingeStart: false, room: kitchen.id });
    }
  }
  const balcony = rooms.find((r) => r.type === "balkon");
  if (balcony) {
    const front = walls
      .filter((w) => w.ext && dirOf(w) === "h" && Math.abs(w.y1 - (balcony.y + balcony.d)) < EPS)
      .filter((w) => ["kamar", "kamar_utama", "santai", "kerja"].includes(byId.get(w.b ?? "")?.type ?? ""))
      .map((w) => ({ w, o: Math.min(spanOf(w)[1], balcony.x + balcony.w) - Math.max(spanOf(w)[0], balcony.x) }))
      .filter((x) => x.o > 1.1)
      .sort((p, q) => q.o - p.o)[0];
    if (front) {
      const s0 = Math.max(spanOf(front.w)[0], balcony.x);
      const e0 = Math.min(spanOf(front.w)[1], balcony.x + balcony.w);
      const c = (s0 + e0) / 2;
      openings.push({ kind: "door", dir: "h", at: front.w.y1, s: c - 0.45, e: c + 0.45, side: 1, hingeStart: true, room: front.w.b });
    }
  }

  // 3. Jendela di dinding luar depan dan belakang (sisi samping lahan dianggap dinding tetangga)
  walls
    .filter((w) => w.ext && dirOf(w) === "h")
    .forEach((w) => {
      const roomId = byId.get(w.a ?? "") && isRoom(byId.get(w.a ?? "")) ? w.a! : w.b!;
      const room = byId.get(roomId);
      if (!room || !isRoom(room) || room.type === "tangga") return;
      const [s0, e0] = spanOf(w);
      // Rentang bebas dari pintu di dinding yang sama
      const blocks = openings.filter((o) => o.dir === "h" && Math.abs(o.at - w.y1) < EPS && o.e > s0 && o.s < e0).map((o) => [o.s - 0.3, o.e + 0.3] as [number, number]);
      let free: [number, number][] = [[s0 + 0.35, e0 - 0.35]];
      blocks.forEach(([bs, be]) => {
        free = free.flatMap(([fs, fe]) => (be <= fs || bs >= fe ? [[fs, fe] as [number, number]] : ([[fs, bs], [be, fe]] as [number, number][]).filter(([a, b]) => b - a > 0)));
      });
      free = free.filter(([a, b]) => b - a >= 0.6).sort((p, q) => q[1] - q[0] - (p[1] - p[0]));
      const seg = free[0];
      if (!seg) return;
      const len = seg[1] - seg[0];
      const width = room.type === "km" ? 0.6 : Math.max(0.6, Math.min(1.5, len * 0.6));
      const count = len >= 4.2 && room.type !== "km" ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const c = seg[0] + (len * (i + 0.5)) / count;
        openings.push({ kind: "window", dir: "h", at: w.y1, s: c - width / 2, e: c + width / 2, side: 1, hingeStart: true, room: room.id });
      }
    });

  return { floor, W, D: r3(D), bandY: ys, rooms, walls, openings, notes };
}

/** Bukaan di dinding depan yang menghadap jalan (ruang di belakangnya, halaman/void/balkon di depannya). */
export function isFacadeOpening(g: FloorGeom, o: Opening) {
  if (o.dir !== "h") return false;
  const room = g.rooms.find((r) => r.id === o.room);
  if (!room || Math.abs(room.y - o.at) > EPS) return false;
  const mid = (o.s + o.e) / 2;
  const front = g.rooms.find((r) => r.band === room.band - 1 && mid > r.x - EPS && mid < r.x + r.w + EPS);
  return !front || isOpen(front.type);
}

/** Potong dinding pada bukaan: kembalikan potongan dinding padat (untuk digambar). */
export function solidWallPieces(g: FloorGeom) {
  return g.walls.flatMap((w) => {
    const dir = dirOf(w);
    const [s0, e0] = spanOf(w);
    const at = lineOf(w);
    const cuts = g.openings.filter((o) => o.dir === dir && Math.abs(o.at - at) < EPS && o.e > s0 && o.s < e0).sort((p, q) => p.s - q.s);
    const pieces: [number, number][] = [];
    let cur = s0;
    cuts.forEach((o) => {
      if (o.s > cur) pieces.push([cur, o.s]);
      cur = Math.max(cur, o.e);
    });
    if (cur < e0) pieces.push([cur, e0]);
    return pieces
      .filter(([a, b]) => b - a > 0.01)
      .map(([a, b]) => (dir === "h" ? { x1: a, y1: at, x2: b, y2: at, ext: w.ext } : { x1: at, y1: a, x2: at, y2: b, ext: w.ext }));
  });
}

export const WALL_T = { ext: 0.15, int: 0.1 };
export { dirOf, spanOf };

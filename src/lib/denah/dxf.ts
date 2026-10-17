import { floorGeometry, isFacadeOpening, solidWallPieces, WALL_T } from "./geometry";
import { FLOOR_H, PEIL, ROOM_META, type Plan } from "./types";

// Ekspor DXF (format R12 ASCII, satuan milimeter) supaya denah konsep bisa dibuka di AutoCAD atau aplikasi CAD lain.
// Isi: tiap lantai berdampingan, lalu tampak depan. Dinding = polyline dengan lebar setebal dinding.

const MM = 1000;
const LAYERS: [string, number][] = [
  ["DINDING", 7],
  ["PINTU", 3],
  ["JENDELA", 4],
  ["TEKS", 2],
  ["UKURAN", 8],
  ["LAHAN", 8],
  ["TANGGA", 9],
  ["TAMPAK", 7],
  ["ATAP", 1],
];

type Label = (s: string) => string;

class Dxf {
  out: string[] = [];
  private n(v: number) {
    return (Math.round(v * MM * 100) / 100).toString();
  }
  private p(code: number, v: string | number) {
    this.out.push(String(code), String(v));
  }
  line(layer: string, x1: number, y1: number, x2: number, y2: number) {
    this.p(0, "LINE");
    this.p(8, layer);
    this.p(10, this.n(x1));
    this.p(20, this.n(y1));
    this.p(30, 0);
    this.p(11, this.n(x2));
    this.p(21, this.n(y2));
    this.p(31, 0);
  }
  wide(layer: string, x1: number, y1: number, x2: number, y2: number, width: number) {
    this.p(0, "POLYLINE");
    this.p(8, layer);
    this.p(66, 1);
    this.p(10, 0);
    this.p(20, 0);
    this.p(30, 0);
    this.p(40, this.n(width));
    this.p(41, this.n(width));
    [
      [x1, y1],
      [x2, y2],
    ].forEach(([x, y]) => {
      this.p(0, "VERTEX");
      this.p(8, layer);
      this.p(10, this.n(x));
      this.p(20, this.n(y));
      this.p(30, 0);
    });
    this.p(0, "SEQEND");
    this.p(8, layer);
  }
  arc(layer: string, cx: number, cy: number, r: number, a0: number, a1: number) {
    this.p(0, "ARC");
    this.p(8, layer);
    this.p(10, this.n(cx));
    this.p(20, this.n(cy));
    this.p(30, 0);
    this.p(40, this.n(r));
    this.p(50, a0.toFixed(3));
    this.p(51, a1.toFixed(3));
  }
  text(layer: string, x: number, y: number, h: number, s: string) {
    this.p(0, "TEXT");
    this.p(8, layer);
    this.p(10, this.n(x));
    this.p(20, this.n(y));
    this.p(30, 0);
    this.p(40, this.n(h));
    this.p(1, s.replace(/[\r\n]/g, " "));
    this.p(72, 1);
    this.p(73, 2);
    this.p(11, this.n(x));
    this.p(21, this.n(y));
    this.p(31, 0);
  }
  rect(layer: string, x: number, y: number, w: number, h: number) {
    this.line(layer, x, y, x + w, y);
    this.line(layer, x + w, y, x + w, y + h);
    this.line(layer, x + w, y + h, x, y + h);
    this.line(layer, x, y + h, x, y);
  }
  build() {
    const head = ["0", "SECTION", "2", "HEADER", "9", "$ACADVER", "1", "AC1009", "9", "$INSUNITS", "70", "4", "0", "ENDSEC"];
    const tables = ["0", "SECTION", "2", "TABLES", "0", "TABLE", "2", "LAYER", "70", String(LAYERS.length)];
    LAYERS.forEach(([name, color]) => tables.push("0", "LAYER", "2", name, "70", "0", "62", String(color), "6", "CONTINUOUS"));
    tables.push("0", "ENDTAB", "0", "ENDSEC");
    return [...head, ...tables, "0", "SECTION", "2", "ENTITIES", ...this.out, "0", "ENDSEC", "0", "EOF"].join("\r\n");
  }
}

const deg = (r: number) => ((r * 180) / Math.PI + 360) % 360;

export function planToDxf(plan: Plan, label: Label): string {
  const dx = new Dxf();
  const W = plan.brief.landW;
  const D = plan.brief.landD;
  const gap = 6;
  const fmt = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");

  plan.floors.forEach((_, f) => {
    const ox = f * (W + gap);
    const g = floorGeometry(plan, f);
    dx.rect("LAHAN", ox, 0, W, D);
    solidWallPieces(g).forEach((w) => dx.wide("DINDING", ox + w.x1, w.y1, ox + w.x2, w.y2, w.ext ? WALL_T.ext : WALL_T.int));
    g.openings.forEach((o) => {
      const pt = (a: number, off: number): [number, number] => (o.dir === "h" ? [ox + a, o.at + off] : [ox + o.at + off, a]);
      if (o.kind === "window") {
        [-WALL_T.ext / 2, 0, WALL_T.ext / 2].forEach((off) => dx.line("JENDELA", ...pt(o.s, off), ...pt(o.e, off)));
        return;
      }
      if (o.kind === "open") return;
      const leaves: [number, number, number][] = o.kind === "main" && o.e - o.s >= 1.1 ? [[o.s, o.e, (o.e - o.s) / 2], [o.e, o.s, (o.e - o.s) / 2]] : [[o.hingeStart ? o.s : o.e, o.hingeStart ? o.e : o.s, o.e - o.s]];
      leaves.forEach(([hinge, other, len]) => {
        const [hx, hy] = pt(hinge, 0);
        const [lx, ly] = pt(hinge, o.side * len);
        const [cx, cy] = pt(hinge + Math.sign(other - hinge) * len, 0);
        dx.line("PINTU", hx, hy, lx, ly);
        let a0 = deg(Math.atan2(cy - hy, cx - hx));
        let a1 = deg(Math.atan2(ly - hy, lx - hx));
        if ((a1 - a0 + 360) % 360 > 180) [a0, a1] = [a1, a0];
        dx.arc("PINTU", hx, hy, len, a0, a1);
      });
    });
    g.rooms.forEach((r) => {
      if (r.type === "void") return;
      if (r.type === "tangga") {
        for (let y = r.y + 0.9; y < r.y + r.d - 0.05; y += 0.27) dx.line("TANGGA", ox + r.x, y, ox + r.x + r.w, y);
        dx.line("TANGGA", ox + r.x + r.w / 2, r.y + 0.9, ox + r.x + r.w / 2, r.y + r.d - 0.1);
      }
      const name = label(ROOM_META[r.type].label).toUpperCase();
      if (!name) return;
      dx.text("TEKS", ox + r.x + r.w / 2, r.y + r.d / 2 + 0.12, 0.2, name);
      dx.text("TEKS", ox + r.x + r.w / 2, r.y + r.d / 2 - 0.2, 0.14, `${fmt(r.w)} x ${fmt(r.d)}`);
    });
    // Ukuran keseluruhan
    dx.line("UKURAN", ox, D + 1, ox + W, D + 1);
    dx.text("UKURAN", ox + W / 2, D + 1.2, 0.18, fmt(W));
    dx.line("UKURAN", ox - 1, 0, ox - 1, D);
    dx.text("UKURAN", ox - 1.3, D / 2, 0.18, fmt(D));
    dx.text("TEKS", ox + W / 2, -1.2, 0.3, label(`DENAH LANTAI ${f + 1}`));
  });

  // Tampak depan (sumbu y = tinggi)
  const ox = plan.floors.length * (W + gap);
  const nF = plan.floors.length;
  const zt = PEIL + nF * FLOOR_H;
  dx.line("TAMPAK", ox - 1, 0, ox + W + 1, 0);
  dx.rect("TAMPAK", ox, 0, W, zt);
  dx.line("TAMPAK", ox, PEIL, ox + W, PEIL);
  plan.floors.forEach((_, f) => {
    const g = floorGeometry(plan, f);
    const base = PEIL + f * FLOOR_H;
    if (f > 0) dx.line("TAMPAK", ox, base, ox + W, base);
    g.openings
      .filter((o) => o.kind !== "open" && isFacadeOpening(g, o))
      .forEach((o) => {
        const room = g.rooms.find((r) => r.id === o.room);
        if (!room) return;
        const sill = o.kind === "window" ? (room.type === "km" ? 1.5 : 0.9) : 0;
        dx.rect(o.kind === "window" ? "JENDELA" : "PINTU", ox + o.s, base + sill, o.e - o.s, 2.2 - sill);
      });
  });
  const o = 0.6;
  if (plan.brief.roof === "datar") dx.rect("ATAP", ox, zt, W, 1);
  else {
    const hr = (W / 2 + o) * Math.tan((30 * Math.PI) / 180) * (plan.brief.roof === "perisai" ? 0.8 : 1);
    const ridge = plan.brief.roof === "perisai" ? W * 0.18 : 0;
    const pts: [number, number][] = [
      [ox - o, zt],
      [ox + W / 2 - ridge, zt + hr],
      [ox + W / 2 + ridge, zt + hr],
      [ox + W + o, zt],
    ];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      dx.line("ATAP", a[0], a[1], b[0], b[1]);
    }
  }
  dx.text("TEKS", ox + W / 2, -1.2, 0.3, label("TAMPAK DEPAN"));
  dx.text("TEKS", ox + W / 2, -1.8, 0.16, label("barumahID miniCAD - gambar konsep, bukan gambar kerja"));
  return dx.build();
}

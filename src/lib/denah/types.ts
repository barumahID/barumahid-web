// miniCAD barumahID: tipe data denah konsep.
// Alur: Brief (kebutuhan dari isian atau AI) -> buildPlan (rumus tata letak) -> Plan (pita dan sel, bisa diedit)
// -> geometri (ruang, dinding, pintu, jendela) -> gambar 2D (SVG), tampak depan, 3D (canvas), DXF.
// Satuan semua ukuran: meter. Sumbu x dari kiri ke kanan lahan, y dari depan (jalan) ke belakang.

export type Roof = "pelana" | "perisai" | "datar";

export interface Brief {
  /** Lebar lahan (sisi depan), meter */
  landW: number;
  /** Panjang lahan (dari depan ke belakang), meter */
  landD: number;
  floors: 1 | 2;
  bedrooms: number;
  bathrooms: number;
  /** Jumlah mobil di carport */
  carport: 0 | 1 | 2;
  mushola: boolean;
  workRoom: boolean;
  storage: boolean;
  laundry: boolean;
  roof: Roof;
}

export type RoomType =
  | "carport"
  | "teras"
  | "taman"
  | "jemur"
  | "balkon"
  | "void"
  | "tamu"
  | "keluarga"
  | "tamu_keluarga"
  | "santai"
  | "dapur"
  | "kamar_utama"
  | "kamar"
  | "km"
  | "mushola"
  | "kerja"
  | "gudang"
  | "tangga";

/** Pita (baris) denah dari depan ke belakang. front/back = halaman, P/R/H = baris ruang (R = ruang tengah). */
export type BandKind = "front" | "P" | "R" | "H" | "back";

export interface BandDef {
  id: string;
  kind: BandKind;
  /** Kedalaman pita, meter */
  d: number;
}

export interface Cell {
  id: string;
  type: RoomType;
  /** Lebar sel, meter. Jumlah lebar sel dalam satu pita = lebar lahan. */
  w: number;
}

export interface Plan {
  v: 1;
  brief: Brief;
  /** Pita dipakai bersama semua lantai supaya dinding dan tangga sejajar */
  bands: BandDef[];
  /** floors[lantai][pita] = sel dari kiri ke kanan */
  floors: Cell[][][];
  /** Catatan untuk pengguna, misalnya ruang yang tidak muat. `msg` = teks Indonesia (kunci terjemahan). */
  warnings: Note[];
}

export interface Note {
  msg: string;
  vars?: Record<string, string | number>;
}

/** Ruang terbuka (tanpa dinding sendiri) */
export const OPEN_TYPES: RoomType[] = ["carport", "teras", "taman", "jemur", "balkon", "void"];
export const isOpen = (t: RoomType) => OPEN_TYPES.includes(t);
/** Ruang pusat yang menghubungkan ruang lain */
export const HUB_TYPES: RoomType[] = ["keluarga", "santai", "tamu_keluarga"];
export const isHub = (t: RoomType) => HUB_TYPES.includes(t);

export interface RoomMeta {
  label: string;
  /** Warna isi lembut di denah dan 3D */
  fill: string;
  /** Lebar minimum dan yang disarankan (meter) */
  min: number;
  pref: number;
  /** Bobot saat sisa lebar dibagi */
  grow: number;
  /** Lebar maksimum supaya ruang kecil tidak jadi terlalu lebar (sisa dibagi ke ruang lain) */
  max?: number;
}

export const ROOM_META: Record<RoomType, RoomMeta> = {
  carport: { label: "Carport", fill: "#ECE9E3", min: 2.6, pref: 3.2, grow: 0 },
  teras: { label: "Teras", fill: "#EFE7DA", min: 1.2, pref: 3, grow: 1 },
  taman: { label: "Taman", fill: "#E3EDDC", min: 0.8, pref: 2, grow: 1 },
  jemur: { label: "Cuci & jemur", fill: "#E4ECF0", min: 1.2, pref: 2.4, grow: 0 },
  balkon: { label: "Balkon", fill: "#EFE7DA", min: 1.2, pref: 3, grow: 0 },
  void: { label: "", fill: "transparent", min: 0, pref: 0, grow: 0 },
  tamu: { label: "Ruang tamu", fill: "#FBF8F3", min: 2.7, pref: 3.5, grow: 1.5 },
  keluarga: { label: "Ruang keluarga & makan", fill: "#FFFFFF", min: 3, pref: 4.5, grow: 3 },
  tamu_keluarga: { label: "Ruang tamu & keluarga", fill: "#FFFFFF", min: 3, pref: 4.5, grow: 3 },
  santai: { label: "Ruang santai", fill: "#FFFFFF", min: 2.5, pref: 4, grow: 3 },
  dapur: { label: "Dapur", fill: "#F6F0E6", min: 1.6, pref: 2.8, grow: 0.6 },
  kamar_utama: { label: "Kamar utama", fill: "#F4EFE8", min: 2.8, pref: 4, grow: 1.2, max: 5.5 },
  kamar: { label: "Kamar tidur", fill: "#F4EFE8", min: 2.7, pref: 3.2, grow: 1, max: 4.5 },
  km: { label: "KM/WC", fill: "#E6EEF2", min: 1.4, pref: 1.8, grow: 0.2, max: 2.4 },
  mushola: { label: "Mushola", fill: "#EEF2E6", min: 1.8, pref: 2.2, grow: 0.3, max: 3 },
  kerja: { label: "Ruang kerja", fill: "#F3F0EA", min: 2.2, pref: 3, grow: 0.8, max: 4 },
  gudang: { label: "Gudang", fill: "#EFEDE9", min: 1.2, pref: 1.6, grow: 0.1, max: 2.4 },
  tangga: { label: "Tangga", fill: "#F1EEEA", min: 2.2, pref: 2.2, grow: 0 },
};

/** Jenis ruang yang boleh dipilih pengguna saat mengganti fungsi ruang */
export const EDITABLE_TYPES: RoomType[] = ["kamar_utama", "kamar", "km", "mushola", "kerja", "gudang", "dapur", "tamu", "keluarga", "santai", "teras", "taman", "carport"];

export const ROOF_LABEL: Record<Roof, string> = { pelana: "Pelana", perisai: "Perisai (limasan)", datar: "Dak datar" };

export const DEFAULT_BRIEF: Brief = {
  landW: 8,
  landD: 15,
  floors: 1,
  bedrooms: 3,
  bathrooms: 2,
  carport: 1,
  mushola: false,
  workRoom: false,
  storage: false,
  laundry: true,
  roof: "pelana",
};

/** Batas isian supaya rumus tata letak tetap masuk akal */
export const LIMITS = {
  landW: [5, 20],
  landD: [8, 40],
  bedrooms: [1, 6],
  bathrooms: [1, 4],
} as const;

/** Tinggi lantai ke lantai dan tinggi dinding (meter) untuk tampak dan 3D */
export const FLOOR_H = 3.6;
export const PEIL = 0.3;

import { RTO_CONVERT_YEARS, RTO_LEVELS, RTO_UNLOCK_MONTHS, RTO_UNLOCK_SCORE, type RtoCategory } from "@/data/rto";

// Tipe dan logika akun penyewa RTO di Portal (aman untuk client). Data aslinya di Supabase project barumahid-web,
// tabel rto_* dengan RLS: penyewa hanya melihat datanya sendiri, pemilik unit melihat sewa di unitnya, tim melihat semua.
// Aturan buka RTO dan pencatatan 25% sewa jadi saldo DP dijaga juga di fungsi database (rto_apply, rto_confirm_payment).

export type RtoStatus = "belum" | "diajukan" | "disetujui" | "ditolak" | "selesai" | "mundur";
export type UnitStatus = "diajukan" | "inspeksi" | "perbaikan" | "tayang" | "penuh" | "ditolak" | "nonaktif";
export type PaymentStatus = "dilaporkan" | "lunas" | "ditolak";
export type LedgerKind = "setoran" | "koreksi" | "pengembalian" | "konversi";
export type AgreementDoc = "syarat_ketentuan" | "nda" | "perjanjian_sewa" | "kontrak_rto" | "mou_penyedia" | "mou_developer" | "bast";

export interface RtoTenant {
  user_id: string;
  city: string | null;
  ktp_verified_at: string | null;
  path: RtoCategory | null;
  target_price: number | null;
  dp_target: number | null;
  rto_status: RtoStatus;
  rto_applied_at: string | null;
  rto_decided_at: string | null;
  contract_signed_at: string | null;
  ppjb_signed_at: string | null;
  /** Rumah tujuan dari developer mitra (diisi tim setelah MoU) */
  target_dev_unit_id: string | null;
  created_at: string;
}

export interface RtoAssessment {
  id: string;
  user_id: string;
  answers: Record<string, string>;
  score: number;
  breakdown: Record<string, number>;
  created_at: string;
}

export interface RtoUnit {
  id: string;
  owner_user_id: string | null;
  title: string;
  kind: "kos" | "rumah";
  city: string;
  kecamatan: string | null;
  kelurahan: string | null;
  address_private: string | null;
  rent_monthly: number;
  rooms: number | null;
  facilities: string[];
  rto_ready: boolean;
  status: UnitStatus;
  inspection_result: "layak" | "layak_catatan" | "tidak_layak" | null;
  inspection_note: string | null;
  /** Dibuat database saat unit dibuat, dipakai di alamat listing /layanan/rto/<slug> */
  slug: string;
  description: string | null;
  /** Path foto di bucket rto-units, urutan pertama = sampul */
  photos: string[];
  /** Titik perkiraan (sudah digeser), bukan lokasi persis */
  approx_lat: number | null;
  approx_lng: number | null;
  created_at: string;
}

/** Fasilitas yang bisa dipilih penyedia kos; dipakai juga untuk filter dan ikon di listing publik */
export const UNIT_FACILITIES = [
  "WiFi",
  "AC",
  "Kamar mandi dalam",
  "Kamar mandi bersama",
  "Parkir motor",
  "Parkir mobil",
  "Dapur bersama",
  "Laundry",
  "Penjaga",
  "Tempat tidur",
  "Lemari",
] as const;

/** Unit yang pemiliknya masih bisa mengubah foto dan deskripsi (setelah tayang hanya tim) */
export const UNIT_OWNER_EDITABLE: UnitStatus[] = ["diajukan", "inspeksi", "perbaikan"];

export interface RtoTenancy {
  id: string;
  tenant_user_id: string;
  unit_id: string | null;
  unit_label: string | null;
  start_date: string;
  end_date: string | null;
  rent_monthly: number;
  due_day: number;
  status: "aktif" | "selesai";
  created_at: string;
}

export interface RtoPayment {
  id: string;
  tenancy_id: string;
  tenant_user_id: string;
  period: string;
  due_date: string;
  amount: number;
  paid_at: string | null;
  status: PaymentStatus;
  is_rto: boolean;
  dp_amount: number;
  reference: string | null;
  created_at: string;
}

export interface RtoLedgerEntry {
  id: string;
  tenant_user_id: string;
  payment_id: string | null;
  kind: LedgerKind;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface RtoAgreement {
  id: string;
  user_id: string;
  doc: AgreementDoc;
  version: string;
  method: "klik" | "tanda_tangan";
  signed_on: string | null;
  created_at: string;
}

export const RTO_STATUS_LABEL: Record<RtoStatus, string> = {
  belum: "Belum mengajukan",
  diajukan: "Diajukan, menunggu tim",
  disetujui: "Disetujui",
  ditolak: "Belum disetujui",
  selesai: "Selesai",
  mundur: "Mundur",
};

export const UNIT_STATUS_LABEL: Record<UnitStatus, string> = {
  diajukan: "Diajukan",
  inspeksi: "Jadwal inspeksi",
  perbaikan: "Perlu perbaikan",
  tayang: "Tayang",
  penuh: "Penuh",
  ditolak: "Tidak lolos",
  nonaktif: "Nonaktif",
};

export const UNIT_STATUS_TONE: Record<UnitStatus, string> = {
  diajukan: "bg-brand-dark/[0.06] text-brand-gray",
  inspeksi: "bg-[#1A5C9A]/10 text-[#1A5C9A]",
  perbaikan: "bg-[#C25E20]/10 text-[#C25E20]",
  tayang: "bg-[#2D7A4F]/10 text-[#2D7A4F]",
  penuh: "bg-brand-dark text-white",
  ditolak: "bg-brand-red/10 text-brand-red",
  nonaktif: "bg-brand-dark/[0.06] text-brand-mute",
};

// ---- Rumah tujuan dari developer mitra (tabel rto_dev_units) ----

export type DevUnitStatus = "diajukan" | "ditinjau" | "perbaikan" | "tayang" | "habis" | "ditolak" | "nonaktif";

export interface RtoDevUnit {
  id: string;
  owner_user_id: string | null;
  slug: string;
  title: string;
  /** Nama proyek atau perumahan */
  project: string | null;
  city: string;
  kecamatan: string | null;
  kelurahan: string | null;
  address_private: string | null;
  /** Harga rumah, dikunci di MoU sampai konversi */
  price: number;
  dp_min_pct: number;
  tipe: string | null;
  land_area: number | null;
  building_area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  units_available: number | null;
  legal: string | null;
  facilities: string[];
  description: string | null;
  photos: string[];
  approx_lat: number | null;
  approx_lng: number | null;
  status: DevUnitStatus;
  review_note: string | null;
  created_at: string;
}

export const DEV_UNIT_STATUS_LABEL: Record<DevUnitStatus, string> = {
  diajukan: "Diajukan",
  ditinjau: "Ditinjau tim",
  perbaikan: "Perlu perbaikan",
  tayang: "Tayang",
  habis: "Unit habis",
  ditolak: "Tidak lolos",
  nonaktif: "Nonaktif",
};

export const DEV_UNIT_STATUS_TONE: Record<DevUnitStatus, string> = {
  diajukan: "bg-brand-dark/[0.06] text-brand-gray",
  ditinjau: "bg-[#1A5C9A]/10 text-[#1A5C9A]",
  perbaikan: "bg-[#C25E20]/10 text-[#C25E20]",
  tayang: "bg-[#2D7A4F]/10 text-[#2D7A4F]",
  habis: "bg-brand-dark text-white",
  ditolak: "bg-brand-red/10 text-brand-red",
  nonaktif: "bg-brand-dark/[0.06] text-brand-mute",
};

/** Rumah tujuan yang developernya masih bisa mengubah foto dan deskripsi (setelah tayang hanya tim) */
export const DEV_OWNER_EDITABLE: DevUnitStatus[] = ["diajukan", "ditinjau", "perbaikan"];

/** Fasilitas rumah tujuan yang bisa dipilih developer */
export const DEV_FACILITIES = ["Carport", "Taman", "Dapur", "Ruang tamu", "Ruang keluarga", "Area mesin cuci", "One gate system", "Masjid atau musala", "Taman bermain"] as const;

/** Baris pipeline developer: peserta yang memilih rumahnya, tanpa identitas (fungsi rto_dev_pipeline) */
export interface DevPipelineRow {
  unit_id: string;
  unit_title: string;
  rto_status: RtoStatus;
  contract_signed_at: string | null;
  dp_target: number | null;
  balance: number;
}

/** Rumah tujuan milik penyewa yang masuk (fungsi rto_my_target) */
export interface MyTarget {
  title: string;
  project: string | null;
  city: string;
  price: number;
  dp_min_pct: number;
  slug: string;
  status: DevUnitStatus;
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = { dilaporkan: "Menunggu konfirmasi", lunas: "Lunas", ditolak: "Ditolak" };
export const LEDGER_LABEL: Record<LedgerKind, string> = { setoran: "Setoran 25% sewa", koreksi: "Koreksi", pengembalian: "Pengembalian", konversi: "Dipakai untuk DP" };
export const DOC_LABEL: Record<AgreementDoc, string> = {
  syarat_ketentuan: "Syarat dan Ketentuan Platform",
  nda: "NDA (perjanjian kerahasiaan)",
  perjanjian_sewa: "Perjanjian Sewa",
  kontrak_rto: "Kontrak RTO",
  mou_penyedia: "MoU Mitra Penyedia",
  mou_developer: "MoU Developer",
  bast: "Berita Acara Serah Terima",
};

// Pertanyaan asesmen Skor Siap Punya Rumah. Nilai poin hanya dihitung di database (rto_submit_assessment).
export const ASSESSMENT_QUESTIONS: { id: string; label: string; options: { value: string; label: string }[] }[] = [
  {
    id: "penghasilan",
    label: "Penghasilanmu sekarang",
    options: [
      { value: "tetap", label: "Tetap, ada slip gaji" },
      { value: "kontrak", label: "Kontrak, tapi rutin setiap bulan" },
      { value: "tidak_menentu", label: "Belum menentu" },
    ],
  },
  {
    id: "menabung",
    label: "Berapa yang rutin kamu sisihkan per bulan",
    options: [
      { value: "lebih_10", label: "Lebih dari 10% penghasilan" },
      { value: "5_10", label: "Sekitar 5 sampai 10%" },
      { value: "belum", label: "Belum rutin menabung" },
    ],
  },
  {
    id: "riwayat",
    label: "Riwayat bayar tagihan atau sewa",
    options: [
      { value: "tidak_pernah", label: "Tidak pernah telat" },
      { value: "sesekali", label: "Sesekali telat, kurang dari 30 hari" },
      { value: "sering", label: "Cukup sering telat" },
      { value: "belum_ada", label: "Belum ada catatan" },
    ],
  },
  {
    id: "aset",
    label: "Kepemilikan tanah",
    options: [
      { value: "shm_sendiri", label: "Ada tanah atas nama sendiri (SHM)" },
      { value: "tanah_keluarga", label: "Ada tanah keluarga atau warisan" },
      { value: "tidak_ada", label: "Belum ada" },
    ],
  },
  {
    id: "target",
    label: "Target rumahmu",
    options: [
      { value: "konkret", label: "Sudah jelas: lokasi, tipe, dan kisaran harga" },
      { value: "tertarik", label: "Tertarik, masih mencari gambaran" },
      { value: "explore", label: "Masih melihat-lihat" },
    ],
  },
];

export const ASSESSMENT_MAX: Record<string, number> = { penghasilan: 35, menabung: 30, riwayat: 20, aset: 10, target: 5 };

// ---- Perjalanan level penyewa (dihitung dari data akun) ----

export interface JourneyInput {
  ktpVerified: boolean;
  hasTenancy: boolean;
  streak: number;
  score: number | null;
  rtoStatus: RtoStatus;
  contractSigned: boolean;
  /** Tanggal Kontrak RTO, untuk menghitung masa RTO sampai konversi */
  contractSignedAt: string | null;
  dpBalance: number;
  dpTarget: number | null;
}

export interface Mission {
  label: string;
  done: boolean;
  /** 0..1 untuk misi bertahap (misalnya 4 dari 6 bulan) */
  progress?: number;
  note?: string;
}

export interface Journey {
  /** Indeks tahap terakhir yang sudah tercapai di RTO_LEVELS (0 = Level 0) */
  reached: number;
  /** Misi untuk tahap berikutnya (kosong kalau sudah di puncak) */
  next: Mission[];
  canApply: boolean;
}

/** Bulan penuh sejak tanggal tertentu */
export function monthsSince(iso: string | null, now = new Date()): number {
  if (!iso) return 0;
  const d = new Date(iso);
  const m = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth() - (now.getDate() < d.getDate() ? 1 : 0);
  return Math.max(0, m);
}

/** Konversi paling cepat: tanggal Kontrak RTO ditambah masa RTO minimal */
export function earliestConversion(contractSignedAt: string | null): Date | null {
  if (!contractSignedAt) return null;
  const d = new Date(contractSignedAt);
  d.setMonth(d.getMonth() + RTO_CONVERT_YEARS.min * 12);
  return d;
}

export function computeJourney(j: JourneyInput): Journey {
  const pctDp = j.dpTarget && j.dpTarget > 0 ? j.dpBalance / j.dpTarget : 0;
  const minMonths = RTO_CONVERT_YEARS.min * 12;
  const monthsIn = j.contractSigned ? monthsSince(j.contractSignedAt) : 0;
  const hasTarget = (j.dpTarget ?? 0) > 0;
  const scoreOk = (j.score ?? 0) >= RTO_UNLOCK_SCORE;
  const steps: { ok: boolean; missions: Mission[] }[] = [
    { ok: true, missions: [] },
    { ok: j.ktpVerified, missions: [{ label: "KTP diverifikasi tim barumahID", done: j.ktpVerified, note: "Kirim foto KTP ke admin lewat WhatsApp." }] },
    {
      ok: j.hasTenancy && j.streak >= RTO_UNLOCK_MONTHS,
      missions: [
        { label: "Tinggal di unit mitra barumahID", done: j.hasTenancy },
        {
          label: `Bayar sewa tepat waktu ${RTO_UNLOCK_MONTHS} bulan berturut-turut`,
          done: j.streak >= RTO_UNLOCK_MONTHS,
          progress: Math.min(1, j.streak / RTO_UNLOCK_MONTHS),
          note: `${Math.min(j.streak, RTO_UNLOCK_MONTHS)} dari ${RTO_UNLOCK_MONTHS} bulan`,
        },
      ],
    },
    {
      ok: scoreOk && j.rtoStatus !== "belum" && j.rtoStatus !== "ditolak",
      missions: [
        { label: `Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE}`, done: scoreOk, note: j.score === null ? "Isi asesmen di bawah." : `Skormu ${j.score}` },
        { label: "Ajukan RTO dari dashboard", done: j.rtoStatus !== "belum" && j.rtoStatus !== "ditolak" },
      ],
    },
    {
      ok: j.rtoStatus === "disetujui" && j.contractSigned,
      missions: [
        { label: "Pengajuan disetujui tim", done: j.rtoStatus === "disetujui" },
        { label: "Kontrak RTO ditandatangani", done: j.contractSigned },
      ],
    },
    {
      ok: hasTarget,
      missions: [{ label: "Pilih rumah developer mitra dan tanda tangani MoU", done: hasTarget, note: "Target DP dicatat tim setelah MoU." }],
    },
    {
      ok: monthsIn >= minMonths && pctDp >= 1,
      missions: [
        {
          label: `Masa RTO minimal ${RTO_CONVERT_YEARS.min} tahun`,
          done: monthsIn >= minMonths,
          progress: Math.min(1, monthsIn / minMonths),
          note: `${Math.min(monthsIn, minMonths)} dari ${minMonths} bulan`,
        },
        { label: "Saldo DP mencapai target di MoU", done: pctDp >= 1, progress: Math.min(1, pctDp) },
      ],
    },
  ];
  let reached = 0;
  for (let i = 1; i < steps.length; i++) {
    if (!steps[i].ok) break;
    reached = i;
  }
  const levelsReached = Math.min(reached, RTO_LEVELS.length - 1);
  const next = levelsReached < steps.length - 1 ? steps[levelsReached + 1].missions : [];
  const canApply = j.ktpVerified && j.hasTenancy && j.streak >= RTO_UNLOCK_MONTHS && scoreOk && (j.rtoStatus === "belum" || j.rtoStatus === "ditolak");
  return { reached: levelsReached, next, canApply };
}

export const rupiah = (n: number | null | undefined) => (n == null ? "-" : "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n)));
export const monthLabel = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { month: "long", year: "numeric" });
export const dateLabel = (iso: string | null) => (iso ? new Date(iso.length === 10 ? iso + "T00:00:00" : iso).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }) : "-");

/** Bulan bayar tepat waktu berturut-turut dari bulan terakhir (sama dengan fungsi database rto_ontime_streak). */
export function computeStreak(payments: RtoPayment[]): number {
  const paid = payments.filter((p) => p.status === "lunas").sort((a, b) => (a.period < b.period ? 1 : -1));
  let streak = 0;
  let expected: string | null = null;
  for (const p of paid) {
    if (expected && p.period !== expected) break;
    if (!p.paid_at || p.paid_at > p.due_date) break;
    streak++;
    const d = new Date(p.period + "T00:00:00Z");
    d.setUTCMonth(d.getUTCMonth() - 1);
    expected = d.toISOString().slice(0, 10);
  }
  return streak;
}

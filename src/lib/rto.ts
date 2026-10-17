import { RTO_LEVELS, RTO_UNLOCK_MONTHS, RTO_UNLOCK_SCORE, type RtoCategory } from "@/data/rto";

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
  created_at: string;
}

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
  ppjbSigned: boolean;
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

export function computeJourney(j: JourneyInput): Journey {
  const pctDp = j.dpTarget && j.dpTarget > 0 ? j.dpBalance / j.dpTarget : 0;
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
      ok: j.ppjbSigned && pctDp >= 0.5,
      missions: [
        { label: "Saldo DP mencapai 50% target", done: pctDp >= 0.5, progress: Math.min(1, pctDp / 0.5) },
        { label: "PPJB ditandatangani, harga dikunci", done: j.ppjbSigned },
      ],
    },
    { ok: pctDp >= 1, missions: [{ label: "Saldo DP mencapai 100% target", done: pctDp >= 1, progress: Math.min(1, pctDp) }] },
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

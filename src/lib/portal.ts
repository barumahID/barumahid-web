import type { FormCode } from "@/data/google-forms";

// Tipe dan label Portal barumahID. Data aslinya (struktur organisasi, tim, mitra, developer) ada di Supabase
// project barumahid-web, tabel portal_*, tidak di repo (repo publik). File ini aman dipakai komponen client;
// fungsi sesi (server saja) ada di src/lib/portal-session.ts.

export type Role = "admin" | "tim" | "mitra";
export type MitraCategory = "tenaga_kerja" | "kontraktor_mandor" | "supplier_vendor" | "penyedia_kos" | "developer";
export type MitraStatus = "terdaftar" | "bersedia" | "terverifikasi" | "aktif" | "nonaktif";

export interface Profile {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  requested_category: MitraCategory | null;
  role: Role;
  created_at: string;
}

export interface OrgLevel {
  id: string;
  name: string;
  tier: string;
  sort: number;
  summary: string[];
  duties: string[];
}

export interface TeamMember {
  id: string;
  level_id: string;
  position: string;
  name: string | null;
  phone: string | null;
  focus: string | null;
  status: "aktif" | "perlu_konfirmasi" | "kosong";
  notes: string | null;
  sort: number;
}

export interface Mitra {
  id: string;
  category: MitraCategory;
  name: string;
  specialty: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  status: MitraStatus;
  profile: Record<string, string | string[]>;
  notes: string | null;
  source: string | null;
  user_id: string | null;
  verified_at: string | null;
  created_at: string;
}

export const CATEGORY_LABEL: Record<MitraCategory, string> = {
  tenaga_kerja: "Tenaga Kerja Konstruksi",
  kontraktor_mandor: "Kontraktor & Mandor",
  supplier_vendor: "Supplier & Vendor",
  penyedia_kos: "Penyedia Kos / Rumah Sewa",
  developer: "Developer Mitra",
};

export const CATEGORY_LINE: Record<MitraCategory, "Jasa Konstruksi" | "Rent-to-Own"> = {
  tenaga_kerja: "Jasa Konstruksi",
  kontraktor_mandor: "Jasa Konstruksi",
  supplier_vendor: "Jasa Konstruksi",
  penyedia_kos: "Rent-to-Own",
  developer: "Rent-to-Own",
};

export const STATUS_LABEL: Record<MitraStatus, string> = {
  terdaftar: "Terdaftar",
  bersedia: "Bersedia",
  terverifikasi: "Terverifikasi",
  aktif: "Aktif",
  nonaktif: "Nonaktif",
};

export const STATUS_TONE: Record<MitraStatus, string> = {
  terdaftar: "bg-brand-dark/[0.06] text-brand-gray",
  bersedia: "bg-[#1A5C9A]/10 text-[#1A5C9A]",
  terverifikasi: "bg-[#C25E20]/10 text-[#C25E20]",
  aktif: "bg-[#2D7A4F]/10 text-[#2D7A4F]",
  nonaktif: "bg-brand-red/10 text-brand-red",
};

/** Formulir pendaftaran dan umpan balik per kategori mitra (Google Form resmi). */
export const CATEGORY_FORMS: Record<MitraCategory, { register: FormCode; feedback?: FormCode }> = {
  tenaga_kerja: { register: "F04" },
  kontraktor_mandor: { register: "F05", feedback: "F09" },
  supplier_vendor: { register: "F04a", feedback: "F08" },
  penyedia_kos: { register: "F14", feedback: "F15" },
  developer: { register: "F16", feedback: "F18" },
};

export function isCategory(v: unknown): v is MitraCategory {
  return typeof v === "string" && v in CATEGORY_LABEL;
}

export const isTeam = (p: Profile | null) => p?.role === "admin" || p?.role === "tim";

// ---- Formulir masuk (jawaban Google Form, dikirim Apps Script ke tabel portal_form_submissions) ----

export type FormGroupId = "mitra" | "feedback" | "klien" | "pelanggan_rto" | "umum";
export type SubmissionStatus = "baru" | "diproses" | "diverifikasi" | "ditolak";

export interface FormSubmission {
  id: string;
  form_code: string;
  form_title: string | null;
  response_id: string;
  submitted_at: string | null;
  respondent_email: string | null;
  name: string | null;
  phone: string | null;
  answers: { q: string; a: unknown }[];
  status: SubmissionStatus;
  mitra_id: string | null;
  handled_at: string | null;
  created_at: string;
}

export interface AccountMeta {
  user_id: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export interface StaffInvite {
  email: string;
  role: "admin" | "tim";
  created_at: string;
}

export const FORM_GROUP_LABEL: Record<FormGroupId, string> = {
  mitra: "Pendaftaran mitra",
  feedback: "Feedback mitra",
  klien: "Klien jasa konstruksi",
  pelanggan_rto: "Pelanggan RTO",
  umum: "Umum",
};

/** Kode Google Form -> judul, kelompok, dan jenis mitra (untuk form pendaftaran mitra). */
export const FORM_META: Record<string, { title: string; group: FormGroupId; category?: MitraCategory }> = {
  F01: { title: "Survei Kebutuhan & Konsultasi Awal", group: "klien" },
  F02: { title: "Pemesanan Jasa Konstruksi", group: "klien" },
  F03: { title: "Feedback Layanan (NPS)", group: "klien" },
  F04: { title: "Pendaftaran Tenaga Kerja Konstruksi", group: "mitra", category: "tenaga_kerja" },
  F04a: { title: "Pendaftaran Supplier & Vendor Material", group: "mitra", category: "supplier_vendor" },
  F05: { title: "Pendaftaran Kontraktor & Mandor", group: "mitra", category: "kontraktor_mandor" },
  F08: { title: "Feedback Mitra Supplier & Vendor", group: "feedback" },
  F09: { title: "Feedback Mitra Kontraktor & Mandor", group: "feedback" },
  F11: { title: "Pendaftaran Calon Penyewa RTO", group: "pelanggan_rto" },
  F12: { title: "Survei Kelayakan Penyewa RTO", group: "pelanggan_rto" },
  F13: { title: "Feedback Pelanggan RTO", group: "pelanggan_rto" },
  F14: { title: "Pendaftaran Penyedia Kos / Rumah Sewa", group: "mitra", category: "penyedia_kos" },
  F15: { title: "Feedback Penyedia Kos", group: "feedback" },
  F16: { title: "Pendaftaran Developer Mitra", group: "mitra", category: "developer" },
  F17: { title: "Survei Minat Developer RTO", group: "mitra", category: "developer" },
  F18: { title: "Feedback Developer Mitra", group: "feedback" },
  F19: { title: "Kontak & Pertanyaan Umum", group: "umum" },
};

export const SUBMISSION_STATUS: Record<SubmissionStatus, { label: string; tone: string }> = {
  baru: { label: "Baru", tone: "bg-brand-red/10 text-brand-red" },
  diproses: { label: "Diproses", tone: "bg-[#C25E20]/10 text-[#C25E20]" },
  diverifikasi: { label: "Diverifikasi", tone: "bg-[#2D7A4F]/10 text-[#2D7A4F]" },
  ditolak: { label: "Ditolak", tone: "bg-brand-dark/[0.06] text-brand-gray" },
};

/** Nomor telepon untuk dicocokkan (08xx dan 628xx dianggap sama). */
export function phoneKey(p: string | null | undefined) {
  const d = (p ?? "").replace(/\D/g, "").replace(/^62/, "0");
  return d.length >= 9 ? d : null;
}

/** Jawaban form jadi teks (pilihan ganda berupa array). */
export function answerText(a: unknown) {
  if (Array.isArray(a)) return a.map((x) => (Array.isArray(x) ? x.join(", ") : String(x))).join(", ");
  return a == null ? "" : String(a);
}

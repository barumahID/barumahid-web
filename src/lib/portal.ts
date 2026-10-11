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

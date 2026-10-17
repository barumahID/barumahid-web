// Pilihan "Masuk sebagai" di navbar dan halaman /masuk.
// Klien konstruksi diarahkan ke form layanan. Penyewa RTO, mitra, dan tim barumahID masuk lewat Portal (/portal, Supabase Auth):
// akun mitra aktif setelah diverifikasi tim, tim melihat dashboard monitoring.

export interface MasukOption {
  label: string;
  hint: string;
  href: string;
  description: string;
}

export const MASUK_OPTIONS: MasukOption[] = [
  {
    label: "Penyewa dan calon pemilik rumah",
    hint: "RTO",
    href: "/portal/daftar?akun=penyewa",
    description: "Buat akun penyewa, naik level menuju RTO, dan pantau saldo DP-mu.",
  },
  {
    label: "Klien konstruksi",
    hint: "ConTech",
    href: "/layanan/contech#konsultasi",
    description: "Minta konsultasi gambar, struktur, renovasi, atau bangun.",
  },
  {
    label: "Mitra barumahID",
    hint: "Portal",
    href: "/portal",
    description: "Tenaga kerja, kontraktor, supplier, penyedia kos, dan developer mitra. Penyedia kos bisa mendaftarkan unit dari dashboard.",
  },
  {
    label: "Tim barumahID",
    hint: "Internal",
    href: "/portal",
    description: "Dashboard monitoring tim, struktur organisasi, dan data mitra.",
  },
];

// Pilihan "Masuk sebagai" di navbar dan halaman /masuk.
// Pelanggan diarahkan ke form layanan. Mitra dan tim barumahID masuk lewat Portal (/portal, Supabase Auth):
// akun mitra aktif setelah diverifikasi tim, tim melihat dashboard monitoring.

export interface MasukOption {
  label: string;
  hint: string;
  href: string;
  description: string;
}

export const MASUK_OPTIONS: MasukOption[] = [
  {
    label: "Calon pemilik rumah",
    hint: "RTO",
    href: "/layanan/rto#daftar",
    description: "Daftar minat program Rent-to-Own dan pantau saldo DP nantinya.",
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
    description: "Tenaga kerja, kontraktor, supplier, penyedia kos, dan developer mitra.",
  },
  {
    label: "Tim barumahID",
    hint: "Internal",
    href: "/portal",
    description: "Dashboard monitoring tim, struktur organisasi, dan data mitra.",
  },
];

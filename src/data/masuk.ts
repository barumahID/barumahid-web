// Pilihan "Masuk sebagai" di navbar dan halaman /masuk.
// Tahap awal tanpa login: tiap pilihan mengarah ke form pendaftaran peran itu.
// Login dan dashboard per peran dibangun di Fase 4 (Supabase Auth), setelah ada mitra aktif.

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
    hint: "ConsTech",
    href: "/layanan/constech#konsultasi",
    description: "Minta konsultasi gambar, struktur, renovasi, atau bangun.",
  },
  {
    label: "Penyedia kos",
    hint: "Mitra",
    href: "/kemitraan/daftar/penyedia-kos",
    description: "Daftarkan kos atau rumah sewamu.",
  },
  {
    label: "Developer",
    hint: "Mitra",
    href: "/kemitraan/daftar/developer",
    description: "Kerja sama unit untuk calon pembeli RTO.",
  },
  {
    label: "Kontraktor atau mandor",
    hint: "Mitra",
    href: "/kemitraan/daftar/kontraktor",
    description: "Ambil proyek bersama barumahID.",
  },
  {
    label: "Freelancer",
    hint: "Projectlink",
    href: "/kemitraan/daftar/projectlink",
    description: "Arsitek, drafter, estimator, dan modeller.",
  },
];

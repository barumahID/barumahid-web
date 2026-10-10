// Tujuh peran mitra di halaman Kemitraan. Tiap peran punya form sendiri (src/lib/leads.ts)
// yang masuk ke sheet CRM Master sesuai kolomnya. Login per peran baru dibangun di Fase 4.

import type { LeadRole } from "@/lib/leads";

export interface PartnerRole {
  slug: string;
  leadRole: LeadRole;
  name: string;
  short: string;
  benefit: string;
  requirements: string[];
  steps: string[];
  /** Kode form lama di Google Forms, untuk referensi tim */
  formCode: string;
}

export const PARTNER_ROLES: PartnerRole[] = [
  {
    slug: "penyedia-kos",
    leadRole: "penyedia-kos",
    name: "Penyedia kos dan rumah sewa",
    short: "Punya kos, kontrakan, atau rumah sewa",
    benefit: "Unit lebih cepat terisi oleh penyewa yang sudah diseleksi, dan kamu tetap menerima 100% harga sewa.",
    requirements: ["Unit layak huni atau siap direnovasi", "Bukti kepemilikan atau izin mengelola", "Bersedia unitnya disurvei"],
    steps: ["Isi data properti", "Survei unit oleh tim kami", "Unit tayang dan dipasarkan"],
    formCode: "F14",
  },
  {
    slug: "developer",
    leadRole: "developer",
    name: "Developer properti",
    short: "Membangun dan menjual perumahan",
    benefit: "Dapat calon pembeli yang DP-nya sedang terkumpul lewat program Rent-to-Own.",
    requirements: ["Badan usaha developer", "Proyek berjalan atau dalam rencana", "Terbuka untuk alokasi unit RTO"],
    steps: ["Isi data developer", "Diskusi skema kerja sama", "Penandatanganan kerja sama"],
    formCode: "F16, F17",
  },
  {
    slug: "kontraktor",
    leadRole: "kontraktor",
    name: "Kontraktor dan mandor borongan",
    short: "Mengerjakan proyek bersama tim",
    benefit: "Dapat proyek dari barumahID dengan pembayaran per termin yang jelas.",
    requirements: ["Pengalaman memimpin pekerjaan konstruksi", "Punya tim tetap", "Bersedia mengikuti standar mutu barumahID"],
    steps: ["Isi data dan keahlian", "Verifikasi pengalaman", "Masuk daftar mitra proyek"],
    formCode: "F05",
  },
  {
    slug: "tenaga-kerja",
    leadRole: "tenaga-kerja",
    name: "Tenaga kerja konstruksi",
    short: "Tukang dan pekerja terampil",
    benefit: "Pekerjaan lebih rutin, dan keahlianmu tercatat untuk proyek berikutnya.",
    requirements: ["Punya keahlian di satu bidang pekerjaan", "Bersedia dicek hasil kerjanya"],
    steps: ["Isi data dan keahlian", "Kami hubungi saat ada proyek", "Bergabung di tim proyek"],
    formCode: "F04",
  },
  {
    slug: "supplier",
    leadRole: "supplier",
    name: "Supplier dan vendor material",
    short: "Toko bangunan dan pemasok material",
    benefit: "Pesanan rutin dari proyek-proyek barumahID.",
    requirements: ["Usaha aktif dengan alamat jelas", "Daftar harga yang bisa diperbarui", "Bisa mengirim ke lokasi proyek"],
    steps: ["Isi data usaha", "Kirim daftar harga", "Masuk daftar vendor proyek"],
    formCode: "F04a",
  },
  {
    slug: "projectlink",
    leadRole: "projectlink",
    name: "Freelancer Projectlink",
    short: "Arsitek, drafter, estimator, modeller",
    benefit: "Proyek nyata untuk portofolio dan penghasilan, dikerjakan bersama tim Jururancang.",
    requirements: ["Menguasai minimal satu software teknik", "Punya contoh karya", "Mahasiswa tingkat akhir, fresh graduate, atau profesional"],
    steps: ["Isi data dan portofolio", "Tes kecil sesuai bidang", "Dapat tawaran proyek"],
    formCode: "F06",
  },
  {
    slug: "knowledges",
    leadRole: "knowledges",
    name: "Mitra Knowledges",
    short: "Kampus, SMK, komunitas, asosiasi",
    benefit: "Kolaborasi kelas, riset, magang, dan artikel di bidang konstruksi.",
    requirements: ["Institusi atau komunitas di bidang konstruksi atau properti", "Punya PIC yang bisa dihubungi"],
    steps: ["Ajukan kerja sama", "Diskusi bentuk program", "Program berjalan"],
    formCode: "F07",
  },
];

export function getRole(slug: string) {
  return PARTNER_ROLES.find((r) => r.slug === slug);
}

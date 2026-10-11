import type { FormLink } from "./google-forms";

// Isi halaman Kemitraan (/kemitraan). Arahan user Okt 2026: Kemitraan keluar dari menu Layanan dan punya halaman
// sendiri. Tampilan solid, profesional, formal, ukuran huruf tidak terlalu besar. Konsep baru:
// - mitrabarumahID Konstruksi tetap aktif -> Mitra Jasa Konstruksi (tenaga kerja, kontraktor & mandor, supplier & vendor)
// - mitrabarumahID Projectlink dan Knowledges -> dilebur ke Jururancang Engineering Mahaksa (freelancer, fresh graduate)
// - mitrabarumahID Kosanesia -> menjadi program Rent-to-Own (penyedia kos dan developer mitra; form penyewa/pelanggan
//   F11-F13 dipindah ke halaman RTO nanti)
// Lini bisnis barumahID kini fokus ke Jasa Konstruksi dan Rent-to-Own. RTO masih pra-peluncuran: copy tidak boleh
// mengklaim program sudah berjalan.

export const KEMITRAAN_HERO = {
  label: "Kemitraan",
  title: "Kemitraan barumahID",
  body: "barumahID membuka kerja sama pada dua lini bisnis: Jasa Konstruksi dan Rent-to-Own. Pilih jalur kemitraan yang sesuai, lengkapi formulir pendaftaran, lalu tim kami melakukan verifikasi sebelum akun Portal Mitra Anda diaktifkan.",
  // Foto mitra di lapangan sebagai latar yang berganti pelan, sudah diburamkan di file (arahan user Okt 2026)
  slides: [1, 2, 3, 4, 5].map((n) => `/images/kemitraan/latar-${n}.webp`),
};

export type JalurId = "konstruksi" | "jururancang" | "rto";

export interface Jalur {
  id: JalurId;
  no: string;
  name: string;
  status: string;
  body: string;
  members: { name: string; body: string }[];
}

export const JALUR: Jalur[] = [
  {
    id: "konstruksi",
    no: "01",
    name: "Mitra Jasa Konstruksi",
    status: "Aktif",
    body: "Mitra pelaksana untuk proyek renovasi dan pembangunan yang dikerjakan barumahID sebagai general kontraktor.",
    members: [
      { name: "Tenaga Kerja Konstruksi", body: "Tukang, pelaksana, dan tenaga terampil di setiap bidang pekerjaan." },
      { name: "Kontraktor & Mandor", body: "Pemimpin pekerjaan lapangan beserta timnya." },
      { name: "Vendor & Supplier", body: "Pemasok material dan penyedia jasa pendukung proyek." },
    ],
  },
  {
    id: "jururancang",
    no: "02",
    name: "Freelancer & Fresh Graduate",
    status: "Melalui Jururancang",
    body: "Kolaborasi profesional untuk pekerjaan gambar, modelling, serta desain dan analisa struktur kini dikelola Jururancang Engineering Mahaksa.",
    members: [
      { name: "Freelancer teknik", body: "Arsitek, drafter, estimator, dan BIM modeller berbasis proyek." },
      { name: "Fresh graduate", body: "Lulusan baru yang ingin membangun portofolio di proyek nyata." },
      { name: "Praktisi & akademisi", body: "Kerja sama pengetahuan, riset, dan pengembangan keahlian." },
    ],
  },
  {
    id: "rto",
    no: "03",
    name: "Mitra Rent-to-Own",
    status: "Pra-peluncuran",
    body: "Kemitraan bagi penyedia hunian dan developer untuk program Rent-to-Own yang sedang kami siapkan.",
    members: [
      { name: "Penyedia Kos & Rumah Sewa", body: "Pemilik kos, kontrakan, atau rumah sewa yang unitnya dapat masuk program." },
      { name: "Developer Mitra", body: "Developer yang bersedia mengalokasikan unit bagi peserta program." },
    ],
  },
];

export interface FormGroup {
  id: JalurId;
  title: string;
  note: string;
  sections: { label: string; forms: FormLink[] }[];
}

export const FORM_GROUPS: FormGroup[] = [
  {
    id: "konstruksi",
    title: "Jasa Konstruksi",
    note: "Pendaftaran mitra pelaksana proyek konstruksi barumahID.",
    sections: [
      {
        label: "Pendaftaran",
        forms: [
          { code: "F04", title: "Tenaga Kerja Konstruksi", body: "Tukang, pelaksana, dan tenaga terampil." },
          { code: "F05", title: "Kontraktor & Mandor", body: "Pemimpin pekerjaan beserta timnya." },
          { code: "F04a", title: "Supplier & Vendor Material", body: "Pemasok material dan jasa pendukung." },
        ],
      },
      {
        label: "Umpan balik mitra aktif",
        forms: [
          { code: "F09", title: "Feedback Kontraktor & Mandor", body: "Evaluasi kerja sama proyek." },
          { code: "F08", title: "Feedback Supplier & Vendor", body: "Evaluasi pemesanan dan pengiriman." },
        ],
      },
    ],
  },
  {
    id: "rto",
    title: "Rent-to-Own",
    note: "Pendaftaran awal untuk program yang sedang kami siapkan. Tim kami menghubungi Anda sebelum program dibuka.",
    sections: [
      {
        label: "Pendaftaran",
        forms: [
          { code: "F14", title: "Penyedia Kos / Rumah Sewa", body: "Daftarkan unit kos, kontrakan, atau rumah sewa." },
          { code: "F16", title: "Developer Mitra", body: "Pendaftaran developer mitra program." },
          { code: "F17", title: "Survei Minat Developer", body: "Pandangan developer terhadap skema RTO." },
        ],
      },
      {
        label: "Umpan balik mitra aktif",
        forms: [
          { code: "F15", title: "Feedback Penyedia Kos", body: "Evaluasi kerja sama penyedia hunian." },
          { code: "F18", title: "Feedback Developer Mitra", body: "Evaluasi kerja sama developer." },
        ],
      },
    ],
  },
];

export const ALUR = [
  { title: "Isi formulir pendaftaran", body: "Pilih formulir sesuai jalur kemitraan Anda." },
  { title: "Buat akun Portal Mitra", body: "Gunakan email dan nomor WhatsApp yang sama dengan formulir." },
  { title: "Verifikasi oleh tim barumahID", body: "Kami menghubungi Anda untuk memastikan data dan kesiapan kerja sama." },
  { title: "Dashboard mitra aktif", body: "Status kemitraan dan informasi kerja sama dapat dipantau dari Portal Mitra." },
];

export const KEMITRAAN_FAQ = [
  { question: "Apakah ada biaya untuk menjadi mitra?", answer: "Tidak ada biaya pendaftaran untuk seluruh jalur kemitraan." },
  {
    question: "Berapa lama proses verifikasi?",
    answer: "Umumnya 1 sampai 3 hari kerja. Tim kami menghubungi Anda melalui WhatsApp untuk memastikan data dan menjelaskan langkah berikutnya.",
  },
  {
    question: "Apa fungsi akun Portal Mitra?",
    answer: "Setelah terverifikasi, Anda dapat melihat status kemitraan, data mitra yang tercatat, serta formulir dan kontak yang relevan dengan jalur Anda.",
  },
  {
    question: "Saya freelancer atau fresh graduate. Ke mana saya mendaftar?",
    answer: "Kolaborasi freelancer dan fresh graduate kini dikelola Jururancang Engineering Mahaksa. Silakan hubungi admin Jururancang melalui WhatsApp.",
  },
  {
    question: "Apakah mitra harus berada di Padang?",
    answer: "Proyek konstruksi kami saat ini paling banyak di Sumatera Barat. Developer dan penyedia hunian dari kota lain tetap dapat mendaftar.",
  },
];

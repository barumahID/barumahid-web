// Skema semua form website barumahID.
// File ini dipakai bersama oleh form (client) dan API route /api/leads (server).
// Penyimpanan: tabel Supabase `barumahid_leads` (utama) dan, kalau env-nya diisi,
// Google Sheet CRM Master lewat Apps Script. Lihat docs/backend/README.md.
// Nama field (`name`) SAMA PERSIS dengan judul kolom di sheet CRM Master,
// supaya Apps Script bisa menulis baris baru dengan mencocokkan header.

export type LeadRole =
  | "konsultasi"
  | "customer-rto"
  | "penyedia-kos"
  | "developer"
  | "kontraktor"
  | "tenaga-kerja"
  | "supplier"
  | "projectlink"
  | "knowledges"
  | "pesan";

export type FieldType = "text" | "tel" | "email" | "number" | "url" | "select" | "textarea";

export interface FieldDef {
  /** Judul kolom di sheet CRM */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  /** Tampil setengah lebar di desktop */
  half?: boolean;
  /** Masuk bagian "Info tambahan (opsional)" yang bisa dibuka */
  extra?: boolean;
  /** Tidak tampil sebagai kolom; diisi komponen lain (misalnya lampiran denah miniCAD) */
  hidden?: boolean;
  maxLength?: number;
}

export interface FormDef {
  role: LeadRole;
  /** Nama sheet tujuan di CRM Master */
  sheet: string;
  title: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  fields: FieldDef[];
  /** Nilai tetap yang ikut terkirim, misalnya Tipe atau sumber form */
  fixed?: Record<string, string>;
}

const SUMBER_INFO = ["Instagram", "TikTok", "LinkedIn", "Teman atau keluarga", "Event", "Google", "Lainnya"];

const nama = (label = "Nama lengkap"): FieldDef => ({
  name: "Nama",
  label,
  type: "text",
  required: true,
  half: true,
  maxLength: 80,
  placeholder: "Nama kamu",
});
const wa: FieldDef = {
  name: "WA",
  label: "No. WhatsApp aktif",
  type: "tel",
  required: true,
  half: true,
  maxLength: 20,
  placeholder: "08xxxxxxxxxx",
};
const email = (required = false): FieldDef => ({
  name: "Email",
  label: required ? "Email" : "Email (opsional)",
  type: "email",
  required,
  half: true,
  maxLength: 120,
  placeholder: "nama@email.com",
});
const kota = (label = "Kota domisili"): FieldDef => ({
  name: "Kota",
  label,
  type: "text",
  required: true,
  half: true,
  maxLength: 60,
  placeholder: "Contoh: Padang",
});
const catatan = (name = "Catatan", label = "Catatan (opsional)"): FieldDef => ({
  name,
  label,
  type: "textarea",
  maxLength: 1000,
  placeholder: "Ceritakan hal lain yang perlu kami tahu",
});

export const FORMS: Record<LeadRole, FormDef> = {
  konsultasi: {
    role: "konsultasi",
    sheet: "📋 Leads Konstruksi",
    title: "Konsultasi proyek konstruksi",
    submitLabel: "Kirim permintaan konsultasi",
    successTitle: "Permintaan konsultasi terkirim.",
    successBody: "Tim kami membalas lewat WhatsApp di jam kerja, biasanya di hari yang sama.",
    fixed: { "Form Source": "Website" },
    fields: [
      nama(),
      wa,
      email(),
      kota("Lokasi proyek (kota)"),
      {
        name: "Jenis Layanan",
        label: "Layanan yang dibutuhkan",
        type: "select",
        required: true,
        half: true,
        options: [
          "Gambar & Modelling",
          "Desain & Analisa Struktur",
          "Renovasi",
          "Bangun rumah atau bangunan",
          "Pendampingan dan manajemen konstruksi",
          "Belum tahu, mau konsultasi dulu",
        ],
      },
      {
        name: "Jenis Bangunan",
        label: "Jenis bangunan",
        type: "select",
        required: true,
        half: true,
        options: [
          "Rumah tinggal",
          "Kos atau kontrakan",
          "Ruko atau bangunan komersial",
          "Gudang atau industri",
          "Masjid, sekolah, atau fasilitas umum",
          "Infrastruktur (jembatan, saluran, dermaga)",
          "Lainnya",
        ],
      },
      {
        name: "Estimasi Luas",
        label: "Perkiraan luas (m²)",
        type: "number",
        half: true,
        placeholder: "Contoh: 120",
      },
      {
        name: "Timeline",
        label: "Kapan mau mulai?",
        type: "select",
        half: true,
        options: ["Secepatnya", "1-3 bulan lagi", "3-6 bulan lagi", "Lebih dari 6 bulan atau belum pasti"],
      },
      {
        name: "Budget",
        label: "Perkiraan anggaran",
        type: "select",
        half: true,
        extra: true,
        options: ["Di bawah Rp10 juta", "Rp10-50 juta", "Rp50-200 juta", "Rp200-500 juta", "Di atas Rp500 juta", "Belum tahu"],
      },
      {
        name: "Sumber Info",
        label: "Tahu barumahID dari mana?",
        type: "select",
        half: true,
        extra: true,
        options: SUMBER_INFO,
      },
      catatan("Catatan Lead", "Ceritakan proyeknya (opsional)"),
      // Diisi otomatis dari miniCAD (ringkasan denah konsep + tautan untuk membukanya lagi)
      { name: "Denah Konsep", label: "Denah konsep (miniCAD)", type: "textarea", hidden: true, maxLength: 4000 },
    ],
  },

  "customer-rto": {
    role: "customer-rto",
    sheet: "🏠 Customer RTO",
    title: "Daftar minat program Rent-to-Own",
    submitLabel: "Daftar minat",
    successTitle: "Kamu sudah masuk daftar minat.",
    successBody:
      "Program RTO masih tahap persiapan. Kami kabari lewat WhatsApp begitu unit pertama siap, termasuk syarat dan simulasinya.",
    fixed: { Sumber: "Website" },
    fields: [
      nama(),
      wa,
      kota("Kota tinggal sekarang"),
      {
        name: "Kota Tujuan",
        label: "Mau punya rumah di kota mana?",
        type: "text",
        required: true,
        half: true,
        maxLength: 60,
        placeholder: "Contoh: Padang",
      },
      {
        name: "Pekerjaan",
        label: "Pekerjaan",
        type: "text",
        required: true,
        half: true,
        maxLength: 80,
        placeholder: "Contoh: karyawan swasta",
      },
      {
        name: "Penghasilan",
        label: "Penghasilan per bulan",
        type: "select",
        required: true,
        half: true,
        options: ["Di bawah Rp3 juta", "Rp3-5 juta", "Rp5-8 juta", "Rp8-12 juta", "Di atas Rp12 juta"],
      },
      {
        name: "Sewa/Bln",
        label: "Bayar sewa per bulan sekarang (Rp)",
        type: "number",
        half: true,
        placeholder: "Contoh: 1500000",
        help: "Kosongkan kalau belum menyewa.",
      },
      {
        name: "Hunian Skrg",
        label: "Tinggal di mana sekarang?",
        type: "select",
        half: true,
        options: ["Kos", "Kontrakan atau sewa rumah", "Rumah orang tua atau keluarga", "Mess atau rumah dinas", "Lainnya"],
      },
      {
        name: "Usia",
        label: "Usia",
        type: "number",
        half: true,
        extra: true,
        placeholder: "Contoh: 27",
      },
      {
        name: "Lama Tinggal",
        label: "Sudah berapa lama di hunian sekarang?",
        type: "select",
        half: true,
        extra: true,
        options: ["Kurang dari 1 tahun", "1-3 tahun", "Lebih dari 3 tahun"],
      },
      {
        name: "Hambatan",
        label: "Hambatan terbesar untuk punya rumah",
        type: "select",
        half: true,
        extra: true,
        options: ["Belum punya DP", "Belum memenuhi syarat KPR", "Penghasilan belum tetap", "Belum paham prosesnya", "Lainnya"],
      },
      {
        name: "Tipe Hunian",
        label: "Hunian yang dicari",
        type: "select",
        half: true,
        extra: true,
        options: ["Rumah tapak", "Kos atau kamar dulu", "Apartemen", "Belum tahu"],
      },
      {
        name: "Budget Sewa",
        label: "Sanggup sewa per bulan (Rp)",
        type: "number",
        half: true,
        extra: true,
        placeholder: "Contoh: 1500000",
      },
      {
        name: "Tahu RTO",
        label: "Sudah paham Rent-to-Own?",
        type: "select",
        half: true,
        extra: true,
        options: ["Sudah paham", "Pernah dengar", "Baru tahu"],
      },
      catatan(),
    ],
  },

  "penyedia-kos": {
    role: "penyedia-kos",
    sheet: "🏡 Penyedia Kos",
    title: "Daftar sebagai penyedia kos atau rumah sewa",
    submitLabel: "Daftarkan properti",
    successTitle: "Data properti terkirim.",
    successBody: "Tim kami menghubungi untuk menjadwalkan survei unit dan menjelaskan skema kerja samanya.",
    fields: [
      nama("Nama pemilik"),
      wa,
      kota("Kota properti"),
      {
        name: "Tipe Properti",
        label: "Tipe properti",
        type: "select",
        required: true,
        half: true,
        options: ["Kos", "Rumah sewa", "Kontrakan petak", "Apartemen", "Lainnya"],
      },
      {
        name: "Jml Unit",
        label: "Jumlah unit atau kamar",
        type: "number",
        required: true,
        half: true,
        placeholder: "Contoh: 8",
      },
      {
        name: "Harga Sewa",
        label: "Harga sewa per bulan (Rp)",
        type: "number",
        half: true,
        placeholder: "Contoh: 1200000",
      },
      {
        name: "Alamat",
        label: "Kelurahan dan kecamatan",
        type: "text",
        half: true,
        maxLength: 120,
        placeholder: "Contoh: Kuranji, Padang",
        help: "Alamat lengkap kami tanyakan saat survei.",
      },
      {
        name: "Kondisi Unit",
        label: "Kondisi unit",
        type: "select",
        half: true,
        options: ["Siap huni", "Perlu renovasi ringan", "Perlu renovasi berat"],
      },
      {
        name: "Fasilitas",
        label: "Fasilitas",
        type: "text",
        extra: true,
        maxLength: 200,
        placeholder: "Contoh: kamar mandi dalam, WiFi, parkir motor",
      },
      {
        name: "Tertarik RTO",
        label: "Tertarik unitnya ikut program RTO?",
        type: "select",
        half: true,
        extra: true,
        options: ["Ya", "Mau diskusi dulu", "Belum"],
      },
      {
        name: "Tahu barumahID",
        label: "Tahu barumahID dari mana?",
        type: "select",
        half: true,
        extra: true,
        options: SUMBER_INFO,
      },
      catatan(),
    ],
  },

  developer: {
    role: "developer",
    sheet: "🏗️ Developer Mitra",
    title: "Daftar sebagai developer mitra",
    submitLabel: "Kirim data developer",
    successTitle: "Data developer terkirim.",
    successBody: "Kami menghubungi PIC untuk menjadwalkan diskusi skema kerja sama.",
    fields: [
      {
        name: "Developer",
        label: "Nama developer atau perusahaan",
        type: "text",
        required: true,
        half: true,
        maxLength: 100,
      },
      {
        name: "PIC",
        label: "Nama PIC",
        type: "text",
        required: true,
        half: true,
        maxLength: 80,
      },
      { name: "Jabatan", label: "Jabatan PIC", type: "text", half: true, maxLength: 60 },
      wa,
      email(),
      kota("Kota proyek"),
      {
        name: "Tipe Proyek",
        label: "Tipe proyek",
        type: "select",
        required: true,
        half: true,
        options: ["Rumah subsidi", "Rumah komersial", "Kavling", "Apartemen", "Ruko", "Lainnya"],
      },
      {
        name: "Kisaran Harga",
        label: "Kisaran harga unit",
        type: "select",
        half: true,
        options: ["Di bawah Rp200 juta", "Rp200-500 juta", "Rp500 juta - Rp1 miliar", "Di atas Rp1 miliar"],
      },
      {
        name: "Jml Unit Pipeline",
        label: "Jumlah unit dalam pipeline",
        type: "number",
        half: true,
        extra: true,
      },
      { name: "Website", label: "Website (opsional)", type: "url", half: true, extra: true, maxLength: 200 },
      {
        name: "Tertarik RTO",
        label: "Tertarik alokasi unit untuk RTO?",
        type: "select",
        half: true,
        extra: true,
        options: ["Ya", "Mau diskusi dulu", "Belum"],
      },
      {
        name: "Alokasi Unit RTO",
        label: "Perkiraan unit untuk RTO",
        type: "number",
        half: true,
        extra: true,
      },
      {
        name: "Jadwal Meeting",
        label: "Waktu yang enak untuk diskusi",
        type: "text",
        extra: true,
        maxLength: 100,
        placeholder: "Contoh: Selasa atau Kamis, setelah jam 13.00",
      },
      catatan(),
    ],
  },

  kontraktor: {
    role: "kontraktor",
    sheet: "👷 Mitra Kontraktor",
    title: "Daftar sebagai kontraktor atau mandor borongan",
    submitLabel: "Daftar jadi mitra",
    successTitle: "Pendaftaran terkirim.",
    successBody: "Tim kami menghubungi untuk verifikasi pengalaman dan contoh pekerjaan.",
    fixed: { Tipe: "Kontraktor atau mandor borongan" },
    fields: [
      nama("Nama kontraktor atau mandor"),
      wa,
      kota("Kota basis kerja"),
      {
        name: "Keahlian",
        label: "Pekerjaan yang biasa dikerjakan",
        type: "text",
        required: true,
        half: true,
        maxLength: 200,
        placeholder: "Contoh: struktur beton, finishing, atap baja ringan",
      },
      {
        name: "Pengalaman",
        label: "Pengalaman",
        type: "select",
        required: true,
        half: true,
        options: ["Kurang dari 2 tahun", "2-5 tahun", "5-10 tahun", "Lebih dari 10 tahun"],
      },
      {
        name: "Jml Tim",
        label: "Jumlah anggota tim",
        type: "number",
        half: true,
      },
      {
        name: "Peralatan",
        label: "Peralatan yang dimiliki",
        type: "text",
        extra: true,
        maxLength: 200,
        placeholder: "Contoh: molen, scaffolding, alat potong",
      },
      {
        name: "Ketersediaan",
        label: "Ketersediaan",
        type: "select",
        half: true,
        extra: true,
        options: ["Bisa mulai sekarang", "Dalam 1 bulan", "Per proyek"],
      },
      catatan(),
    ],
  },

  "tenaga-kerja": {
    role: "tenaga-kerja",
    sheet: "👷 Mitra Kontraktor",
    title: "Daftar sebagai tenaga kerja konstruksi",
    submitLabel: "Daftar jadi mitra",
    successTitle: "Pendaftaran terkirim.",
    successBody: "Data keahlianmu kami simpan. Kami hubungi saat ada proyek yang cocok.",
    fixed: { Tipe: "Tenaga kerja" },
    fields: [
      nama(),
      wa,
      kota("Kota basis kerja"),
      {
        name: "Keahlian",
        label: "Keahlian utama",
        type: "select",
        required: true,
        half: true,
        options: [
          "Tukang batu",
          "Tukang kayu",
          "Tukang besi",
          "Tukang cat",
          "Instalasi listrik",
          "Plumbing",
          "Las",
          "Pekerja umum",
          "Lainnya",
        ],
      },
      {
        name: "Pengalaman",
        label: "Pengalaman",
        type: "select",
        required: true,
        half: true,
        options: ["Kurang dari 2 tahun", "2-5 tahun", "5-10 tahun", "Lebih dari 10 tahun"],
      },
      {
        name: "Ketersediaan",
        label: "Ketersediaan",
        type: "select",
        half: true,
        options: ["Bisa mulai sekarang", "Dalam 1 bulan", "Per proyek"],
      },
      catatan(),
    ],
  },

  supplier: {
    role: "supplier",
    sheet: "🔧 Mitra Supplier",
    title: "Daftar sebagai supplier atau vendor material",
    submitLabel: "Kirim data supplier",
    successTitle: "Data supplier terkirim.",
    successBody: "Kami menghubungi untuk meminta daftar harga dan menjadwalkan kunjungan.",
    fields: [
      {
        name: "Nama Usaha",
        label: "Nama usaha atau toko",
        type: "text",
        required: true,
        half: true,
        maxLength: 100,
      },
      { name: "PIC", label: "Nama PIC", type: "text", required: true, half: true, maxLength: 80 },
      { name: "Jabatan", label: "Jabatan PIC", type: "text", half: true, maxLength: 60 },
      wa,
      email(),
      kota("Kota usaha"),
      {
        name: "Kategori Material",
        label: "Material atau jasa yang disediakan",
        type: "text",
        required: true,
        maxLength: 200,
        placeholder: "Contoh: semen, besi, keramik, rangka baja ringan",
      },
      {
        name: "Legalitas",
        label: "Bentuk usaha",
        type: "select",
        half: true,
        extra: true,
        options: ["PT", "CV", "UD atau perorangan", "Belum berbadan usaha"],
      },
      {
        name: "Wilayah Kirim",
        label: "Wilayah pengiriman",
        type: "text",
        half: true,
        extra: true,
        maxLength: 120,
        placeholder: "Contoh: Kota Padang dan Padang Pariaman",
      },
      {
        name: "Sistem Bayar",
        label: "Sistem pembayaran",
        type: "select",
        half: true,
        extra: true,
        options: ["Tunai", "Tempo 14 hari", "Tempo 30 hari", "Lainnya"],
      },
      {
        name: "Volume",
        label: "Kapasitas pasokan",
        type: "text",
        half: true,
        extra: true,
        maxLength: 120,
        placeholder: "Contoh: 200 sak semen per minggu",
      },
      catatan(),
    ],
  },

  projectlink: {
    role: "projectlink",
    sheet: "🎓 Mitra Projectlink",
    title: "Daftar sebagai freelancer Projectlink",
    submitLabel: "Daftar Projectlink",
    successTitle: "Pendaftaran Projectlink terkirim.",
    successBody: "Kami cek portofoliomu, lalu menghubungi saat ada proyek yang cocok dengan keahlianmu.",
    fields: [
      nama(),
      wa,
      email(),
      kota(),
      {
        name: "Status Skrg",
        label: "Status sekarang",
        type: "select",
        required: true,
        half: true,
        options: ["Mahasiswa", "Fresh graduate", "Profesional", "Freelancer"],
      },
      {
        name: "Bidang",
        label: "Bidang keahlian",
        type: "select",
        required: true,
        half: true,
        options: [
          "Arsitektur",
          "Teknik sipil dan struktur",
          "Drafter CAD",
          "BIM atau 3D modelling",
          "Estimator dan RAB",
          "Desain interior",
          "Lainnya",
        ],
      },
      {
        name: "Software",
        label: "Software yang dikuasai",
        type: "text",
        half: true,
        maxLength: 200,
        placeholder: "Contoh: AutoCAD, SketchUp, ETABS, Revit",
      },
      {
        name: "Portofolio",
        label: "Link portofolio",
        type: "url",
        half: true,
        maxLength: 300,
        placeholder: "https://",
      },
      { name: "Kampus", label: "Kampus (opsional)", type: "text", half: true, extra: true, maxLength: 100 },
      {
        name: "Ketersediaan",
        label: "Ketersediaan",
        type: "select",
        half: true,
        extra: true,
        options: ["Paruh waktu", "Penuh waktu", "Per proyek"],
      },
      catatan(),
    ],
  },

  knowledges: {
    role: "knowledges",
    sheet: "🏫 Mitra Knowledges",
    title: "Kerja sama mitrabarumahID Knowledges",
    submitLabel: "Ajukan kerja sama",
    successTitle: "Pengajuan kerja sama terkirim.",
    successBody: "Kami menghubungi PIC untuk membahas bentuk kerja sama yang paling pas.",
    fields: [
      { name: "Institusi", label: "Nama institusi atau komunitas", type: "text", required: true, half: true, maxLength: 120 },
      { name: "PIC", label: "Nama PIC", type: "text", required: true, half: true, maxLength: 80 },
      { name: "Jabatan", label: "Jabatan PIC", type: "text", half: true, maxLength: 60 },
      wa,
      email(),
      kota(),
      {
        name: "Tipe Institusi",
        label: "Tipe institusi",
        type: "select",
        required: true,
        half: true,
        options: ["Universitas", "SMK", "Lembaga pelatihan", "Komunitas", "Asosiasi profesi", "Lainnya"],
      },
      {
        name: "Program Kerjasama",
        label: "Bentuk kerja sama",
        type: "select",
        required: true,
        half: true,
        options: ["Kelas atau pelatihan", "Riset", "Magang", "Artikel atau konten", "Sertifikasi", "Lainnya"],
      },
      {
        name: "Kapan Mulai",
        label: "Rencana mulai",
        type: "text",
        half: true,
        extra: true,
        maxLength: 60,
        placeholder: "Contoh: Januari 2027",
      },
      catatan(),
    ],
  },

  pesan: {
    role: "pesan",
    sheet: "💬 Pesan Website",
    title: "Kirim pesan",
    submitLabel: "Kirim pesan",
    successTitle: "Pesan terkirim.",
    successBody: "Terima kasih. Kami membalas lewat WhatsApp atau email di jam kerja.",
    fields: [
      nama(),
      wa,
      email(),
      {
        name: "Keperluan",
        label: "Keperluan",
        type: "select",
        required: true,
        half: true,
        options: ["Program Rent-to-Own", "Jasa konstruksi", "Kemitraan", "Media atau kerja sama", "Lainnya"],
      },
      {
        name: "Pesan",
        label: "Pesan",
        type: "textarea",
        required: true,
        maxLength: 1500,
        placeholder: "Tulis pesanmu",
      },
    ],
  },
};

export const LEAD_ROLES = Object.keys(FORMS) as LeadRole[];

export function isLeadRole(v: unknown): v is LeadRole {
  return typeof v === "string" && (LEAD_ROLES as string[]).includes(v);
}

/** Normalisasi nomor WA Indonesia ke format 62xxxxxxxxxx. Mengembalikan null kalau tidak valid. */
export function normalizeWa(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "").replace(/^\+/, "");
  let n = digits;
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  if (!/^62\d{8,13}$/.test(n)) return null;
  return n;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ValidationResult {
  ok: boolean;
  values: Record<string, string>;
  errors: Record<string, string>;
}

/** Validasi isian form. Dipakai di browser dan di server. */
export function validateLead(role: LeadRole, input: Record<string, unknown>): ValidationResult {
  const def = FORMS[role];
  const values: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const f of def.fields) {
    const rawVal = input[f.name];
    const v = typeof rawVal === "string" ? rawVal.trim() : typeof rawVal === "number" ? String(rawVal) : "";
    const max = f.maxLength ?? (f.type === "textarea" ? 1500 : 200);

    if (!v) {
      if (f.required) errors[f.name] = "Wajib diisi.";
      continue;
    }
    if (v.length > max) {
      errors[f.name] = `Maksimal ${max} karakter.`;
      continue;
    }
    if (f.type === "tel") {
      const n = normalizeWa(v);
      if (!n) {
        errors[f.name] = "Nomor WhatsApp belum valid. Contoh: 081234567890.";
        continue;
      }
      values[f.name] = n;
      continue;
    }
    if (f.type === "email" && !EMAIL_RE.test(v)) {
      errors[f.name] = "Format email belum valid.";
      continue;
    }
    if (f.type === "number") {
      const num = Number(v.replace(/[.,\s]/g, ""));
      if (!Number.isFinite(num) || num < 0) {
        errors[f.name] = "Isi dengan angka.";
        continue;
      }
      values[f.name] = String(num);
      continue;
    }
    if (f.type === "url") {
      const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
      try {
        const u = new URL(withProto);
        if (!u.hostname.includes(".")) throw new Error("bad host");
        values[f.name] = u.toString();
      } catch {
        errors[f.name] = "Link belum valid.";
      }
      continue;
    }
    if (f.type === "select" && f.options && !f.options.includes(v)) {
      errors[f.name] = "Pilih salah satu opsi.";
      continue;
    }
    values[f.name] = v;
  }

  return { ok: Object.keys(errors).length === 0, values, errors };
}

/** Ringkasan isian untuk pesan WhatsApp cadangan saat pengiriman gagal. */
export function leadToWhatsAppText(role: LeadRole, values: Record<string, string>): string {
  const def = FORMS[role];
  const lines = def.fields
    .filter((f) => values[f.name])
    .map((f) => `${f.label}: ${values[f.name]}`);
  return [`Halo barumahID, saya isi form "${def.title}" di website tapi gagal terkirim. Ini datanya:`, ...lines].join("\n");
}

// ---------------------------------------------------------------------------
// Penyimpanan utama: tabel Supabase `barumahid_leads`.
// Kolom `jenis` dibatasi CHECK constraint di database: customer | mitra | developer | kontak.
// Form website lebih rinci (10 jenis), jadi jenis aslinya disimpan di `data.form`.
// ---------------------------------------------------------------------------

export type SupabaseJenis = "customer" | "mitra" | "developer" | "kontak";

const SUPABASE_MAP: Record<LeadRole, { jenis: SupabaseJenis; nama: string[] }> = {
  konsultasi: { jenis: "customer", nama: ["Nama"] },
  "customer-rto": { jenis: "customer", nama: ["Nama"] },
  "penyedia-kos": { jenis: "mitra", nama: ["Nama"] },
  developer: { jenis: "developer", nama: ["Developer", "PIC"] },
  kontraktor: { jenis: "mitra", nama: ["Nama"] },
  "tenaga-kerja": { jenis: "mitra", nama: ["Nama"] },
  supplier: { jenis: "mitra", nama: ["Nama Usaha", "PIC"] },
  projectlink: { jenis: "mitra", nama: ["Nama"] },
  knowledges: { jenis: "mitra", nama: ["Institusi", "PIC"] },
  pesan: { jenis: "kontak", nama: ["Nama"] },
};

export interface SupabaseLeadRow {
  jenis: SupabaseJenis;
  nama: string;
  kontak: string;
  kota: string | null;
  data: Record<string, string>;
  sumber: string | null;
}

/** Ubah isian form yang sudah divalidasi jadi satu baris tabel `barumahid_leads`. */
export function toSupabaseRow(role: LeadRole, values: Record<string, string>, page: string): SupabaseLeadRow {
  const def = FORMS[role];
  const map = SUPABASE_MAP[role];
  const nama = map.nama
    .map((k) => values[k])
    .filter(Boolean)
    .join(" / ");
  return {
    jenis: map.jenis,
    nama: nama.slice(0, 1000),
    kontak: (values.WA || values.Email || "").slice(0, 1000),
    kota: values.Kota ? values.Kota.slice(0, 1000) : null,
    data: { form: role, judul_form: def.title, sheet_crm: def.sheet, ...values, ...(def.fixed ?? {}) },
    sumber: page ? page.slice(0, 1000) : null,
  };
}

export interface LeadPayload {
  role: LeadRole;
  fields: Record<string, string>;
  consent: boolean;
  page?: string;
  /** honeypot, harus kosong */
  company_website?: string;
  turnstileToken?: string;
}

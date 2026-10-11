// Isi halaman Karier (/rekrutmen). Arahan user Okt 2026: bahasa lebih profesional (memakai "Anda"),
// tambah Magang Arsitektur dari brosur user, ganti ajakan "kerja per proyek" dengan freelancer Jururancang Team
// (kontak: WA admin Jururancang di src/data/site.ts). Gaya halaman mengacu template "Social Media Studio".

export const KARIER_HERO = {
  status: "Magang Arsitektur dibuka · Remote",
  hint: "Gerakkan kursor untuk menjangkau · Klik untuk mengirim sinyal",
  // Baris dipisah \n, kata di dalam [..] diberi sorotan merah
  title: "Ikut membangun ekosistem\n[konstruksi] yang [lebih baik.]",
  body: "barumahID adalah perusahaan konstruksi berbasis teknologi di bawah PT Inditek Bluprim Mahaksa. Kami membuka kesempatan magang, rekrutmen berkala, dan kolaborasi freelance bagi talenta yang ingin berkembang di bidang arsitektur, rekayasa, dan konstruksi.",
  location: "Padang dan remote",
};

// Jalan pintas di bawah hero, sekaligus urutan bagian di halaman
export const KARIER_JALUR = [
  { id: "magang", label: "Magang Arsitektur" },
  { id: "rekrutmen", label: "Rekrutmen Berkala" },
  { id: "freelance", label: "Freelancer Jururancang" },
  { id: "lamaran-umum", label: "Lamaran Umum" },
];

// Bidang yang kami tekuni, untuk pita berjalan (dekoratif, bukan daftar lowongan)
export const KARIER_BIDANG = [
  "Arsitektur",
  "BIM dan modelling",
  "Desain dan analisa struktur",
  "Estimasi biaya",
  "Desain interior dan eksterior",
  "Marketing",
  "Teknologi dan AI",
  "Operasional",
];

// Sumber: brosur "Internship Opportunities: Architecture Internship" dari user (Okt 2026).
// Brosur tidak menyebut periode. Status buka/tutup dan durasi perlu dikonfirmasi (docs/KONFIRMASI.md).
export const MAGANG = {
  open: true,
  label: "(01) Program magang",
  title: "Magang Arsitektur.",
  subtitle: "Remote, berdurasi terbatas.",
  meta: [
    { label: "Lokasi", value: "Remote" },
    { label: "Sifat", value: "Magang, berdurasi terbatas" },
    { label: "Bidang", value: "Arsitektur" },
  ],
  description:
    "Posisi magang jarak jauh dengan durasi terbatas sebagai Architectural Intern di barumahID. Peserta magang akan berkolaborasi dalam proyek arsitektur dan memperoleh pengalaman praktis langsung di bidangnya.",
  duties: [
    "Membantu proses desain arsitektur",
    "Berkomunikasi dan berkoordinasi dengan anggota tim",
    "Mengembangkan solusi arsitektur",
    "Mengintegrasikan elemen desain ke dalam rancangan",
  ],
  qualifications: [
    "Menguasai dasar arsitektur dan desain arsitektural",
    "Memiliki kemampuan komunikasi yang baik",
    "Mampu merancang solusi dan mengintegrasikan elemen desain",
    "Memahami perangkat lunak dan tools arsitektur",
    "Terbiasa bekerja dengan ritme cepat",
    "Teliti dan memperhatikan detail",
    "Mahasiswa aktif atau lulusan program studi Arsitektur",
  ],
  emailSubject: "Lamaran Magang Arsitektur",
  waMessage: "Halo Admin barumahID, saya ingin bertanya tentang program Magang Arsitektur.",
  poster: {
    src: "/images/karier/brosur-magang-arsitektur.webp",
    w: 1080,
    h: 1920,
    alt: "Brosur Internship Opportunities: Architecture Internship barumahID",
  },
  steps: [
    { title: "Siapkan dokumen", body: "CV dan portofolio terbaru Anda." },
    { title: "Kirim lamaran", body: "Kirim ke {email} dengan subjek \"Lamaran Magang Arsitektur - Nama Anda\"." },
    { title: "Tunggu kabar dari kami", body: "Tim kami akan menghubungi kandidat yang sesuai melalui email atau WhatsApp." },
  ],
};

// Rekrutmen per batch. Tambah batch baru di sini: ubah nama, tanggal tutup, dan posisi. Link form dari env.
export const BATCH = {
  label: "(02) Rekrutmen berkala",
  title: "Rekrutmen berkala.",
  subtitle: "Dibuka per batch.",
  intro: "Kami membuka rekrutmen per batch sesuai kebutuhan tim. Setiap batch memiliki periode pendaftaran yang jelas.",
  name: "Rekrutmen Juli 2026",
  closesAt: "2026-07-31T23:59:59+07:00",
  closesLabel: "31 Juli 2026",
  formUrl: process.env.NEXT_PUBLIC_FORM_REKRUTMEN || "",
  positions: [
    { title: "Marketing Specialist", dept: "Marketing", location: "Padang atau remote" },
    { title: "Customer Administration", dept: "Operasional", location: "Padang" },
    { title: "AI Engineer", dept: "Teknologi", location: "Remote" },
    { title: "BIM Modeller", dept: "Engineering", location: "Padang atau remote" },
    { title: "Arsitek", dept: "Desain", location: "Padang" },
    { title: "Desainer Interior dan Eksterior", dept: "Desain", location: "Padang atau remote" },
  ],
};

export const KOLABORASI = {
  label: "(03) Jalur lain",
  title: "Jalur lain untuk bergabung.",
  subtitle: "Berbasis proyek atau lamaran terbuka.",
  freelance: {
    kicker: "Freelance",
    title: "Bergabung sebagai freelancer Jururancang Team",
    body: "Bagi arsitek, drafter, estimator, dan BIM modeller yang ingin bekerja berbasis proyek. Jururancang Engineering Mahaksa adalah partner teknis barumahID untuk gambar dan modelling, serta desain dan analisa struktur. Hubungi admin Jururancang melalui WhatsApp untuk informasi lebih lanjut.",
    cta: "WhatsApp admin Jururancang",
    waMessage: "Halo Admin Jururancang, saya tertarik bergabung sebagai freelancer Jururancang Team.",
  },
  general: {
    kicker: "Lamaran umum",
    title: "Belum menemukan posisi yang sesuai?",
    body: "Kirim CV dan portofolio Anda ke {email} dengan subjek \"Lamaran Umum\". Kami akan menyimpannya sebagai referensi untuk kebutuhan rekrutmen berikutnya.",
    cta: "Kirim CV via email",
    emailSubject: "Lamaran Umum",
  },
};

export const KARIER_PENUTUP = {
  title: "Mari bergabung bersama kami.",
  body: "Informasi lowongan terbaru kami umumkan melalui Instagram @barumahid dan halaman ini.",
};

// Konten halaman Ekosistem (/tentang). Arahan dan bahan dari user (Okt 2026): profil PT, visi misi, LBAG,
// serta tiga infografis (About us, Masalah yang sering terjadi, Keunggulan kami). Copy dirapikan supaya
// singkat dan mudah dipahami, esensinya tetap.
// Jangan pakai singkatan IBM untuk PT Inditek Bluprim Mahaksa (bentrok dengan merek IBM).
// RTO masih pre-launch: copy tidak boleh mengklaim program sudah berjalan.

export const EKOSISTEM_HERO = {
  label: "Ekosistem barumahID",
  title: "PT Inditek Bluprim Mahaksa",
  body: [
    "Perusahaan konstruksi yang berdiri sejak 9 Januari 2024. Kami mengerjakan gambar & modelling, renovasi & bangun konstruksi, serta desain & analisa struktur.",
    "Kami bergerak sebagai general kontraktor sekaligus konsultan konstruksi. Cara kerja kami terus mengikuti perkembangan teknologi lewat LBAG: Lean Construction, BIM, AI dan AR/VR, serta Green Construction. Empat konsep ini kami terapkan bertahap supaya ekosistem konstruksi jadi lebih mudah, rapi, dan terbuka.",
  ],
  services: [
    { label: "Gambar & Modelling", href: "/layanan/contech#harga" },
    { label: "Renovasi & Bangun Konstruksi", href: "/layanan/contech#renovasi" },
    { label: "Desain & Analisa Struktur", href: "/layanan/contech#harga" },
  ],
  // Latar hero: foto kegiatan barumahID di kompetisi dan program startup (bahan user)
  images: [
    { src: "/images/ekosistem/startup-hour-bersama.webp", alt: "Tim barumahID bersama peserta Startup Hour" },
    { src: "/images/ekosistem/presentasi-ide.webp", alt: "Presentasi ide barumahID di depan juri" },
    { src: "/images/ekosistem/pitching-1000-startup.webp", alt: "Pitching barumahID di program 1000 Startup Digital" },
    { src: "/images/ekosistem/hackathon-papan-nama.webp", alt: "Papan nama barumahID di hackathon Gerakan Nasional 1000 Startup Digital" },
  ],
};

// "barumahID itu apa?" (bahan: infografis About us)
export const BARUMAHID_INTRO = {
  label: "Tentang barumahID",
  title: "Startup yang bikin urusan konstruksi dan properti jadi lebih gampang.",
  body: [
    "barumahID adalah startup yang fokus membangun ekosistem konstruksi berbasis teknologi di Indonesia. Kami bergerak di dua lini: ConTech untuk urusan membangun, PropTech untuk urusan memiliki.",
    "Semuanya dalam satu alur, dari desain, renovasi, sampai pembangunan. Prinsip kami sederhana: proyekmu, dibikin mudah aja.",
  ],
  steps: [
    { icon: "desain", label: "Desain" },
    { icon: "renovasi", label: "Renovasi" },
    { icon: "bangun", label: "Pembangunan" },
  ],
  innovation: {
    label: "Inovasi unggulan",
    body: "Kami sedang menyiapkan cara punya rumah yang lebih mudah dan terjangkau. Nantikan, segera hadir.",
  },
};

// Bahan: infografis "Masalah yang sering terjadi"
export const MASALAH = {
  label: "Masalah yang sering terjadi",
  title: "Bangun dan punya rumah masih sering bikin pusing.",
  intro: "Di lapangan, empat masalah ini yang paling sering kami temui.",
  items: [
    {
      icon: "cari",
      title: "Susah cari jasa desain dan konstruksi yang bisa dipercaya.",
      body: "Pilihannya banyak, tapi sulit menilai kualitas, portofolio, dan rekam jejaknya.",
    },
    {
      icon: "biaya",
      title: "Biaya tidak jelas, lalu berubah di tengah jalan.",
      body: "Tanpa hitungan yang terbuka, anggaran membengkak dan susah dikontrol.",
    },
    {
      icon: "waktu",
      title: "Proyek molor, pengawasan dan komunikasi tidak jalan.",
      body: "Koordinasi yang lemah bikin pekerjaan terlambat dan hasilnya tidak sesuai harapan.",
    },
    {
      icon: "dompet",
      title: "Punya rumah masih sulit dan kaku.",
      body: "Harga rumah terus naik, sementara jalan kepemilikan yang mudah dan terjangkau masih sedikit.",
    },
  ],
  answerTitle: "barumahID hadir untuk menjawab semuanya.",
  answerBody:
    "Lewat satu ekosistem: mitra yang terpercaya, proses yang transparan, teknologi yang efisien, dan jalan punya rumah yang lebih mudah dan fleksibel.",
};

// Bahan: infografis "Keunggulan kami"
export const KEUNGGULAN = {
  label: "Keunggulan kami",
  title: "Kenapa kerja bareng barumahID?",
  intro: "Kami ingin membangun terasa mudah, aman, dan bisa dipercaya. Ini caranya.",
  items: [
    { icon: "konsultasi", title: "Konsultasi yang mendampingi", body: "Dari rencana sampai pengerjaan, tim kami responsif dan siap menjawab." },
    { icon: "harga", title: "Harga kompetitif", body: "Harganya pantas dan transparan. Tidak ada biaya tersembunyi." },
    { icon: "teknologi", title: "Teknologi konstruksi", body: "Lean Construction dan BIM bikin proyek lebih efisien dan akurat." },
    { icon: "interaktif", title: "Pengalaman interaktif", body: "Visual 3D membantu kamu melihat hasilnya dulu. AI dan AR/VR kami tambahkan bertahap." },
    { icon: "hijau", title: "Keberlanjutan", body: "Praktik Green Construction untuk bangunan yang lebih ramah lingkungan." },
    { icon: "mitra", title: "Kemitraan", body: "Jaringan mitra konstruksi yang solid, supaya setiap proyek jalan lancar." },
    { icon: "bim", title: "Manajemen proyek efektif", body: "Lewat BIM, semua pihak melihat model yang sama. Risiko telat bisa ditekan." },
    { icon: "efisien", title: "Efisiensi", body: "Pemborosan dipangkas lewat Lean Construction, biayamu ikut lebih hemat." },
    { icon: "fleksibel", title: "Fleksibel dan praktis", body: "Layanan bisa disesuaikan dengan kebutuhan proyekmu." },
    { icon: "rumah", title: "Rent-to-Own yang inklusif", body: "Sedang kami siapkan: jalan punya rumah tanpa harus menunggu DP besar di awal.", soon: true },
  ],
  closingTitle: "Kami tidak cuma membangun rumah, tapi juga kepercayaan.",
  closingBody: "Solusinya tepat, prosesnya mudah, hasilnya berkualitas.",
};

export const VISION = "Jadi pelopor sekaligus pemimpin dalam membangun ekosistem bisnis konstruksi berbasis teknologi di Indonesia.";

export const MISSIONS: string[] = [
  "Membawa teknologi terbaru ke setiap proyek lewat LBAG (Lean Construction, BIM, AI dan AR/VR, Green Construction), supaya kerja lebih produktif dan berkelanjutan.",
  "Memberi layanan yang nyaman, aman, dan harganya pantas untuk klien maupun pemilik proyek.",
  "Membangun jaringan kemitraan yang solid antar pelaku bisnis konstruksi.",
  "Bikin layanan konstruksi gampang diakses, dari informasi dan konsultasi sampai hasil yang berkualitas, untuk klien dan mitra.",
];

export interface Pillar {
  letter: string;
  name: string;
  body: string;
  benefit: string;
}

export const PILLARS_TITLE = "LBAG, empat cara kami membangun lebih baik.";
export const PILLARS_SUBTITLE = "Empat konsep yang kami bawa ke proses bisnis kami, dan terus kami kembangkan bertahap.";

// Catatan: klaim BIM dan AR/VR harus sesuai praktik Jururancang, jadi A memakai "kami terapkan bertahap".
export const PILLARS: Pillar[] = [
  {
    letter: "L",
    name: "Lean Construction",
    body: "Proses konstruksi dioptimalkan supaya tidak ada yang terbuang.",
    benefit: "Waktu, material, dan biaya lebih efisien.",
  },
  {
    letter: "B",
    name: "Building Information Modeling (BIM)",
    body: "Perencanaan, desain, dan pengelolaan proyek lewat model digital bangunan.",
    benefit: "Masalah ketahuan di layar, bukan di lapangan.",
  },
  {
    letter: "A",
    name: "AI dan AR/VR",
    body: "AI dan AR/VR membantu kamu melihat rancangan lebih nyata. Kami terapkan bertahap.",
    benefit: "Keputusan lebih tepat sebelum mulai membangun.",
  },
  {
    letter: "G",
    name: "Green Construction",
    body: "Setiap proyek kami arahkan lebih ramah lingkungan.",
    benefit: "Bangunan hemat energi dan berkelanjutan.",
  },
];

export interface Value {
  letter: string;
  name: string;
  body: string;
}

export const VALUES_TITLE = "BUILD. Lima nilai yang kami pegang.";
export const VALUES_SUBTITLE = "Nilai ini yang menentukan cara kami bekerja di setiap proyek.";

// Judul kartu memakai versi Business Model Canvas (keputusan PRD Website v1, bagian Tentang).
export const VALUES: Value[] = [
  { letter: "B", name: "Bold Innovation", body: "Berani mencoba cara baru. Teknologi seperti BIM dan Lean Construction kami pakai di proyek nyata, bukan cuma jadi jargon." },
  { letter: "U", name: "United Ecosystem", body: "Klien, tim, dan mitra bergerak dalam satu alur. Semua tahu perannya, jadi proyek jalan lebih lancar." },
  { letter: "I", name: "Integrity", body: "Angka di RAB bisa dipertanggungjawabkan. Apa yang kami sepakati di awal, itu yang kami kerjakan." },
  { letter: "L", name: "Long-term Thinking", body: "Bangunan dipakai puluhan tahun. Kami pilih cara kerja dan material yang awet, bukan yang cuma murah hari ini." },
  { letter: "D", name: "Driven by Impact", body: "Setiap proyek yang dibangun dengan benar membuat keluarga dan usaha tumbuh lebih aman. Itu ukuran kerja kami." },
];

export const MOTTO = "Make it. Future.";

export interface GroupUnit {
  name: string;
  role: string;
  body: string;
  status: "induk" | "aktif" | "pengembangan";
  statusLabel: string;
}

// Grup usaha: menunggu revisi user (rencananya jadi globe cabang bisnis). Isi di bawah belum diubah.
export const GROUP_TITLE = "Satu grup, satu arah.";
export const GROUP_SUBTITLE =
  "barumahID adalah bagian dari Mahaksa Grup di bawah PT Inditek Bluprim Mahaksa. Tiap unit punya peran sendiri, tujuannya sama: membangun hunian dan membuka akses untuk memilikinya.";

export const GROUP_UNITS: GroupUnit[] = [
  {
    name: "PT Inditek Bluprim Mahaksa",
    role: "Induk usaha",
    body: "Badan hukum dan induk usaha yang menaungi semua unit Mahaksa Grup.",
    status: "induk",
    statusLabel: "Induk",
  },
  {
    name: "barumahID",
    role: "Platform pendamping kepemilikan rumah",
    body: "Jasa konstruksi lewat ConTech, jalan kepemilikan lewat Rent-to-Own.",
    status: "aktif",
    statusLabel: "Aktif",
  },
  {
    name: "Jururancang Engineering Mahaksa",
    role: "Konsultan perencanaan",
    body: "Konsultan perencanaan, desain, dan analisa struktur. Mitra teknis semua pekerjaan gambar dan struktur barumahID.",
    status: "aktif",
    statusLabel: "Aktif sejak 7 Agustus 2026",
  },
];

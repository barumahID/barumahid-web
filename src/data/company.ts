// Konten halaman Ekosistem (/tentang). Arahan dan bahan dari user (Okt 2026): profil PT, visi misi, LBAG,
// serta tiga infografis (About us, Masalah yang sering terjadi, Keunggulan kami). Copy dibuat santai dan hangat
// (arahan user: humanize, cozy), esensinya tetap. Kecuali hero profil PT: paragraf pertama versi awal, paragraf kedua
// formal (arahan user).
// Jangan pakai singkatan IBM untuk PT Inditek Bluprim Mahaksa (bentrok dengan merek IBM).
// RTO masih pre-launch: copy tidak boleh mengklaim program sudah berjalan.

export const EKOSISTEM_HERO = {
  label: "Profil barumahID",
  title: "PT Inditek Bluprim Mahaksa",
  body: [
    "Perusahaan konstruksi yang berdiri sejak 9 Januari 2024. Kami mengerjakan gambar & modelling, renovasi & bangun konstruksi, serta desain & analisa struktur.",
    "Berfokus sebagai general kontraktor dan konsultan konstruksi, perusahaan secara konsisten mengadaptasi perkembangan teknologi melalui konsep LBAG, yaitu Lean Construction, Building Information Modeling (BIM), Artificial Intelligence serta Augmented dan Virtual Reality (AI dan AR/VR), dan Green Construction. Kami meyakini keempat konsep ini akan mendisrupsi ekosistem bisnis konstruksi di Indonesia menjadi lebih baik di masa mendatang.",
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
    { src: "/images/ekosistem/yelp-2019.webp", alt: "Papan nama barumahID di Youth Economic Leadership Program 2019" },
    { src: "/images/ekosistem/hackathon-papan-nama.webp", alt: "Papan nama barumahID di hackathon Gerakan Nasional 1000 Startup Digital" },
  ],
};

// "barumahID itu apa?" (bahan: infografis About us). Sisi kanan: tiga lini barumahID, lalu catatan inovasi
// unggulan di bawah Rent to Own (arahan user).
export const BARUMAHID_INTRO = {
  label: "Tentang barumahID",
  title: "Bikin urusan bangun dan punya rumah jadi lebih gampang.",
  body: [
    "barumahID adalah startup yang sedang membangun ekosistem konstruksi berbasis teknologi di Indonesia. Kami jalan di dua lini: ConTech untuk urusan membangun, PropTech untuk urusan memiliki.",
    "Mau merancang, renovasi, atau bangun dari nol, semuanya bisa dimulai dari satu tempat. Prinsip kami sederhana: proyekmu, dibikin mudah aja.",
  ],
  lines: [
    { icon: "bangun", label: "End to End Services", body: "Gambar, renovasi, sampai bangun dalam satu alur.", href: "/layanan/contech" },
    { icon: "mitra", label: "Kemitraan", body: "Tukang, mandor, supplier, sampai developer tumbuh bareng.", href: "/kemitraan" },
    { icon: "rumah", label: "Rent To Own", body: "Sewa dulu, sebagian sewanya jadi saldo DP.", href: "/layanan/rto" },
  ],
  innovation: {
    label: "Inovasi unggulan",
    body: "Kami ingin menemani kamu di setiap langkah menuju hunian sendiri. Mulai dari sewa, pelan-pelan mengumpulkan DP, sampai akhirnya rumah itu jadi milikmu.",
  },
};

// Bahan: infografis "Masalah yang sering terjadi"
export const MASALAH = {
  label: "Masalah yang sering terjadi",
  title: "Jujur saja, bangun dan punya rumah masih sering bikin pusing.",
  intro: "Dari obrolan dengan klien dan pengalaman kami di lapangan, empat hal ini yang paling sering bikin proyek tersendat.",
  items: [
    {
      icon: "cari",
      title: "Bingung cari jasa yang bisa dipercaya.",
      body: "Pilihannya banyak, tapi susah menilai mana yang benar-benar ahli. Portofolio dan rekam jejaknya sering tidak jelas, akhirnya memilih cuma modal percaya.",
    },
    {
      icon: "biaya",
      title: "Biaya tidak jelas dan suka berubah di tengah jalan.",
      body: "Tanpa hitungan yang terbuka sejak awal, anggaran gampang membengkak. Tiba-tiba muncul biaya tambahan yang tidak pernah dibicarakan.",
    },
    {
      icon: "waktu",
      title: "Proyek molor dan komunikasinya putus-putus.",
      body: "Pengawasan longgar dan koordinasi yang kurang bikin pekerjaan terlambat. Hasil akhirnya pun sering beda dari yang dibayangkan.",
    },
    {
      icon: "dompet",
      title: "Punya rumah sendiri terasa makin jauh.",
      body: "Harga rumah terus naik, DP terasa berat, dan jalan kepemilikan yang fleksibel masih sedikit.",
    },
  ],
  answerTitle: "Karena itu barumahID hadir.",
  answerBody:
    "Kami rangkai semuanya jadi satu ekosistem: mitra yang terpercaya, biaya yang transparan, teknologi yang bikin kerja efisien, dan jalan punya rumah yang lebih ramah di kantong.",
};

// Bahan: infografis "Keunggulan kami"
export const KEUNGGULAN = {
  label: "Keunggulan kami",
  title: "Kenapa kerja bareng barumahID?",
  intro: "Kami ingin proses membangun terasa tenang, bukan bikin was-was. Ini yang kami tawarkan.",
  items: [
    { icon: "konsultasi", title: "Konsultasi yang mendampingi", body: "Dari rencana sampai pengerjaan, tim kami siap diajak ngobrol dan cepat menjawab." },
    { icon: "harga", title: "Harga kompetitif", body: "Harganya pantas dan dihitung terbuka. Tidak ada biaya yang disembunyikan." },
    { icon: "teknologi", title: "Teknologi konstruksi", body: "Lean Construction dan BIM bikin proyek lebih efisien dan hitungannya lebih akurat." },
    { icon: "interaktif", title: "Pengalaman interaktif", body: "Visual 3D membantu kamu melihat hasilnya dulu. AI dan AR/VR menyusul bertahap." },
    { icon: "hijau", title: "Keberlanjutan", body: "Green Construction supaya bangunan lebih ramah lingkungan dan awet." },
    { icon: "mitra", title: "Kemitraan", body: "Didukung jaringan mitra konstruksi yang solid, jadi proyek jalan lancar." },
    { icon: "bim", title: "Manajemen proyek efektif", body: "Dengan BIM, semua pihak melihat model yang sama. Salah paham berkurang, risiko telat ikut turun." },
    { icon: "efisien", title: "Efisiensi", body: "Pemborosan dipangkas lewat Lean Construction, biayamu ikut lebih hemat." },
    { icon: "fleksibel", title: "Fleksibel dan praktis", body: "Layanan bisa disesuaikan dengan kebutuhan dan kondisi proyekmu." },
    { icon: "rumah", title: "Rent-to-Own yang inklusif", body: "Sedang kami siapkan: jalan punya rumah tanpa harus menunggu DP besar di awal.", soon: true },
  ],
  closingTitle: "Kami tidak cuma membangun rumah, tapi juga rasa percaya.",
  closingBody: "Solusinya tepat, prosesnya mudah, hasilnya bisa diandalkan.",
};

export const VISION = "Jadi pelopor sekaligus pemimpin dalam membangun ekosistem bisnis konstruksi berbasis teknologi di Indonesia.";

export const MISSIONS: string[] = [
  "Membawa teknologi terbaru ke setiap proyek lewat LBAG, supaya kerja lebih produktif dan berkelanjutan.",
  "Memberi layanan yang nyaman, aman, dan harganya pantas, untuk klien maupun pemilik proyek.",
  "Merangkul pelaku bisnis konstruksi jadi jaringan kemitraan yang solid.",
  "Bikin layanan konstruksi gampang diakses, dari cari informasi dan konsultasi sampai hasil yang berkualitas.",
];

// LBAG dan BUILD tampil dalam satu bagian "Cara kami bekerja" (arahan user: satu halaman, proporsional).
export const CARA_KERJA = {
  label: "Cara kami bekerja",
  title: "LBAG dan BUILD, pegangan kami di setiap proyek.",
  subtitle: "LBAG adalah cara kerja kami, BUILD adalah nilai yang kami pegang. Arahkan kursor atau ketuk hurufnya.",
  lbagLabel: "LBAG · Empat pilar teknologi",
  buildLabel: "BUILD · Lima nilai kami",
};

export interface Pillar {
  letter: string;
  name: string;
  body: string;
  benefit: string;
}

// Catatan: klaim BIM dan AR/VR harus sesuai praktik Jururancang, jadi A memakai "kami terapkan bertahap".
export const PILLARS: Pillar[] = [
  {
    letter: "L",
    name: "Lean Construction",
    body: "Proses dirapikan dari awal supaya tidak ada yang terbuang.",
    benefit: "Waktu, material, dan biaya lebih efisien.",
  },
  {
    letter: "B",
    name: "Building Information Modeling (BIM)",
    body: "Bangunan dimodelkan digital dulu, dari perencanaan sampai pengelolaan proyek.",
    benefit: "Masalah ketahuan di layar, bukan di lapangan.",
  },
  {
    letter: "A",
    name: "AI dan AR/VR",
    body: "Rancangan bisa kamu lihat lebih nyata sebelum dibangun. Kami terapkan bertahap.",
    benefit: "Keputusan lebih tepat dan yakin.",
  },
  {
    letter: "G",
    name: "Green Construction",
    body: "Setiap proyek kami arahkan lebih ramah lingkungan.",
    benefit: "Bangunan hemat energi dan awet.",
  },
];

export interface Value {
  letter: string;
  name: string;
  body: string;
}

// Judul kartu memakai versi Business Model Canvas (keputusan PRD Website v1, bagian Tentang).
export const VALUES: Value[] = [
  { letter: "B", name: "Bold Innovation", body: "Berani mencoba cara baru. BIM dan Lean Construction kami pakai di proyek nyata, bukan sekadar jargon." },
  { letter: "U", name: "United Ecosystem", body: "Klien, tim, dan mitra jalan bareng dalam satu alur. Semua tahu perannya, jadi proyek lebih lancar." },
  { letter: "I", name: "Integrity", body: "Setiap angka di RAB bisa dipertanggungjawabkan. Yang disepakati di awal, itu yang kami kerjakan." },
  { letter: "L", name: "Long-term Thinking", body: "Bangunan dipakai puluhan tahun. Kami pilih cara dan material yang awet, bukan sekadar murah hari ini." },
  { letter: "D", name: "Driven by Impact", body: "Setiap bangunan yang berdiri dengan benar bikin keluarga dan usaha tumbuh lebih tenang. Itu ukuran kerja kami." },
];

export const MOTTO = "Make it. Future.";

// Grup usaha diganti "Astro Mahaksa" (src/data/semesta.ts).

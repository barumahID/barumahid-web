// Konten halaman Tentang. Sumber: dokumen "Halaman Tentang barumahID, Brief & Copy v1" dan ADART.
// Jangan pakai singkatan IBM untuk PT Inditek Bluprim Mahaksa (bentrok dengan merek IBM).

export const ABOUT_HERO = {
  label: "Tentang Kami",
  title: "Dibangun dari frustrasi lapangan, bukan dari riset pasar.",
  subtitle:
    "Kami PT Inditek Bluprim Mahaksa, perusahaan konstruksi dan teknologi properti dari Padang. Lewat barumahID, kami bantu orang membangun rumah dengan benar, lalu membuka jalan untuk memilikinya.",
};

export const STORY_TITLE = "Cerita kami dimulai dari lapangan.";

export const STORY: string[] = [
  "barumahID lahir pada 11 November 2018 sebagai ide platform jasa konstruksi. Kami mulai dari yang paling dasar: jasa gambar kerja dan analisa struktur, dikerjakan sambil tetap turun di proyek.",
  "Dari lapangan, kami melihat masalah yang sama terus berulang. Pemilik proyek susah menemukan jasa yang bisa dipercaya dan harganya jelas. Penyewa bertahun-tahun membayar sewa tanpa jalan yang jelas untuk punya rumah sendiri.",
  "Pandemi sempat menghentikan langkah kami di 2020. Kami bangkit lagi, dan sampai 2023 lebih dari 30 proyek selesai. Pada 9 Januari 2024, PT Inditek Bluprim Mahaksa resmi berdiri.",
  "Setelah itu kami ikut menggarap pembangunan dan pekerjaan subkontraktor. Dari sana kami makin yakin, masalah terbesar bukan cara membangun rumah, tapi jalan orang untuk memilikinya.",
  "Di 2026, barumahID tumbuh jadi ekosistem. ConsTech untuk membangun, PropTech lewat program Rent-to-Own untuk membuka jalan kepemilikan. Kami mulai dari Padang, lalu melangkah ke kota tier-2 lain, Jabodetabek, dan seluruh Indonesia.",
];

export interface Milestone {
  year: string;
  title: string;
  body: string;
  award?: boolean;
}

export const TIMELINE: Milestone[] = [
  {
    year: "2018",
    title: "barumahID lahir",
    body: "Mulai dari jasa gambar kerja dan analisa struktur. Masuk Top 15 bootcamp 1000 Startup Digital.",
    award: true,
  },
  { year: "2019", title: "Dilirik di tingkat nasional", body: "Finalis Top 50 Inovasi Startup Kemenristekdikti.", award: true },
  { year: "2020", title: "Jeda pandemi", body: "Aktivitas proyek berhenti sementara karena COVID-19." },
  {
    year: "2021",
    title: "Bangkit lagi",
    body: "Proyek kembali berjalan. Finalis Next Program Hackathon, Scalebox × Nakama.id by DigitalHub.",
    award: true,
  },
  { year: "2023", title: "30+ proyek selesai", body: "Desain, analisa struktur, renovasi, dan bangun." },
  { year: "2024", title: "PT resmi berdiri", body: "PT Inditek Bluprim Mahaksa berbadan hukum sejak 9 Januari 2024." },
  {
    year: "2026",
    title: "Tumbuh jadi ekosistem",
    body: "Mulai membangun program Rent-to-Own. Lulus Rocket Incubation, Yayasan Indonesia Setara × Sandination Academy. Jururancang Engineering Mahaksa resmi berdiri.",
    award: true,
  },
];

export const VISION = "Menjadi pionir dan pemimpin ekosistem konstruksi berbasis teknologi di Indonesia.";

export const MISSIONS: string[] = [
  "Membawa teknologi ke setiap proyek lewat LBAG, supaya kerja lebih cepat, hemat, dan ramah lingkungan.",
  "Menghadirkan layanan konstruksi yang nyaman, aman, dan harganya masuk akal.",
  "Merajut jaringan mitra yang solid, dari tukang dan mandor sampai developer.",
  "Membuka jalan kepemilikan rumah bagi kelas menengah dan pekerja muda lewat Rent-to-Own, dari kota tier-2 Sumatera menuju Jabodetabek dan seluruh Indonesia.",
];

export interface Pillar {
  letter: string;
  name: string;
  body: string;
  constech: string;
  proptech: string;
}

export const PILLARS_TITLE = "Empat pilar yang menopang semua yang kami bangun.";
export const PILLARS_SUBTITLE = "ConsTech membangun rumahnya. PropTech membuka jalan memilikinya. LBAG menopang keduanya.";

// Catatan dokumen Tentang: klaim BIM dan AR/VR harus sesuai praktik Jururancang.
// Kalimat di bawah sengaja memakai "kami terapkan bertahap" untuk A.
export const PILLARS: Pillar[] = [
  {
    letter: "L",
    name: "Lean Construction",
    body: "Pemborosan dipangkas sejak perencanaan. Material, waktu, dan biaya dihitung sebelum dibelanjakan.",
    constech: "RAB lebih rapi, proyek lebih cepat selesai.",
    proptech: "Biaya bangun efisien, harga rumah tetap terjangkau.",
  },
  {
    letter: "B",
    name: "Building Information Modeling",
    body: "Bangunan dimodelkan digital dulu. Bentrok antar elemen ketahuan di layar, bukan di lapangan.",
    constech: "Gambar, struktur, dan MEP sinkron dalam satu model.",
    proptech: "RAB Option Build transparan karena volume dihitung dari model.",
  },
  {
    letter: "A",
    name: "AI + AR/VR",
    body: "AI mempercepat hitungan dan layanan. Visual 3D membantu klien melihat ruangnya sebelum dibangun. Kami terapkan bertahap.",
    constech: "Revisi desain berkurang karena klien sudah melihat hasilnya.",
    proptech: "Simulasi DP dan rekomendasi jalur kepemilikan lebih cepat.",
  },
  {
    letter: "G",
    name: "Green Construction",
    body: "Orientasi bangunan, ventilasi alami, dan material lokal dipilih supaya rumah hemat energi dan awet.",
    constech: "Desain lebih sehat dan biaya operasional lebih hemat.",
    proptech: "Tagihan penghuni lebih ringan. Nanti lewat GreenPoint, kebiasaan pilah sampah jadi poin DP.",
  },
];

export interface Value {
  letter: string;
  name: string;
  body: string;
}

export const VALUES_TITLE = "BUILD. Lima nilai yang kami pegang.";
export const VALUES_SUBTITLE = "Kami membangun rumah. Lima nilai ini yang membangun cara kami bekerja.";

// Judul kartu memakai versi Business Model Canvas (keputusan PRD Website v1, bagian Tentang).
export const VALUES: Value[] = [
  { letter: "B", name: "Bold Innovation", body: "Berani melangkah duluan meski belum sempurna. Berani jujur soal kondisi, berani menolak jalan pintas." },
  { letter: "U", name: "United Ecosystem", body: "Tim, mitra, dan pelanggan bergerak satu arah. Tidak ada yang ditinggal di tengah jalan." },
  { letter: "I", name: "Integrity", body: "Dana pelanggan adalah amanah. Setiap angka yang kami sampaikan bisa dipertanggungjawabkan." },
  { letter: "L", name: "Long-term Thinking", body: "Punya rumah adalah perjalanan bertahun-tahun. Kami menemani prosesnya, bukan mengejar transaksi cepat." },
  { letter: "D", name: "Driven by Impact", body: "Jutaan keluarga di Indonesia belum punya rumah layak. Itu alasan kami bekerja setiap hari." },
];

export const MOTTO = "Make it. Future.";

export interface GroupUnit {
  name: string;
  role: string;
  body: string;
  status: "induk" | "aktif" | "pengembangan";
  statusLabel: string;
}

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
    body: "Jasa konstruksi lewat ConsTech, jalan kepemilikan lewat Rent-to-Own.",
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

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin?: string;
  photo?: string;
}

export const TEAM_TITLE = "Orang-orang di balik barumahID.";
export const TEAM_SUBTITLE = "Tim kecil dengan latar belakang lapangan, bisnis, dan teknologi.";

// Ejaan nama perlu dicek ulang sebelum tayang (lihat daftar konfirmasi di docs/KONFIRMASI.md).
export const TEAM: TeamMember[] = [
  {
    name: "Ir. Zulprima Jaya Putra, S.T., IPP",
    role: "Founder & CEO",
    bio: "Insinyur sipil lulusan Universitas Andalas, Insinyur Profesional Pratama PII, pemegang 3 SKK Ahli Muda. Tujuh tahun memegang project control di proyek jalan tol.",
    initials: "ZJ",
    linkedin: "https://www.linkedin.com/in/zulprima-jaya-putra",
  },
  {
    name: "Agung Perdana",
    role: "Co-Founder, Business Development & Finance",
    bio: "Memegang strategi bisnis dan perencanaan keuangan barumahID.",
    initials: "AP",
  },
  {
    name: "Genta Septriawan",
    role: "Chief Operating Officer",
    bio: "Mengurus operasional proyek, koordinasi tim, dan SOP kerja.",
    initials: "GS",
  },
  {
    name: "Hariyanto Djalil",
    role: "Chief Technology Officer",
    bio: "Memimpin pengembangan platform dan infrastruktur digital barumahID.",
    initials: "HD",
  },
];

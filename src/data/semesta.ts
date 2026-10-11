// "Astro Mahaksa" (dulu Semesta Mahaksa, nama dari user Okt 2026): unit usaha di bawah PT Inditek Bluprim Mahaksa,
// tampil sebagai orbit di halaman Ekosistem.
// Sumber: "Architecture Mahaksa Group" dan cerita dari user (Okt 2026). Tiga divisi sesuai nama PT:
// INDITEK (inovasi & teknologi), BLUPRIM (brand & layanan), MAHAKSA (konstruksi & properti).
// Progres ditulis apa adanya: barumahID 100%, Jururancang 44%, Piatu Tim 14% (berjalan), unit lain 4% (ide yang
// pernah dicoba dan siap dibangun lagi). Istilah "gurita bisnis" sengaja tidak dipakai.
// Cerita unit yang pernah gagal ditulis positif dan jujur, tanpa detail yang menyudutkan pihak lain.
// Logo di public/images/semesta (simbolnya saja), kecuali barumahID yang tampil lengkap dengan tulisannya (arahan user,
// `wide`). Logo berlatar gelap memakai `logoBg` sebagai warna lingkaran.
// `initials` dipakai kalau suatu saat ada unit baru tanpa logo.

export type DivisionId = "inditek" | "bluprim" | "mahaksa";

export interface Division {
  id: DivisionId;
  name: string;
  focus: string;
  color: string; // r,g,b untuk latar gelap
}

export const DIVISIONS: Division[] = [
  { id: "inditek", name: "INDITEK", focus: "Inovasi & Teknologi", color: "236,230,220" },
  { id: "bluprim", name: "BLUPRIM", focus: "Brand & Layanan", color: "88,150,222" },
  { id: "mahaksa", name: "MAHAKSA", focus: "Konstruksi & Properti", color: "197,59,59" },
];

export interface Unit {
  id: string;
  name: string;
  division: DivisionId;
  status: "berjalan" | "ide";
  progress: number;
  body: string;
  logo?: string;
  logoBg?: string;
  /** Logo melebar (simbol + tulisan): lingkarannya dibuat lebih besar dan logonya mengikuti lebar. */
  wide?: boolean;
  initials: string;
}

export const SEMESTA = {
  label: "Astro Mahaksa",
  title: "Satu inti, tiga orbit. Ini mimpi kami ke depan.",
  intro:
    "PT Inditek Bluprim Mahaksa punya tiga divisi, sesuai namanya: Inditek untuk inovasi dan teknologi, Bluprim untuk brand dan layanan, Mahaksa untuk konstruksi dan properti. Sebagian sudah berjalan, sebagian masih ide yang pernah kami coba dan siap kami bangun lagi. Angkanya kami tulis jujur, sesuai progres hari ini.",
  core: "PT Inditek Bluprim Mahaksa",
  hint: "Geser untuk memutar, pilih satu logo untuk melihat ceritanya.",
};

export const UNITS: Unit[] = [
  {
    id: "barumahid",
    name: "barumahID",
    division: "mahaksa",
    status: "berjalan",
    progress: 100,
    body: "Layanan desain, bangun, renovasi, dan kontraktor yang terintegrasi. Dari sini juga kami membuka jalan menuju hunian sendiri lewat Rent-to-Own.",
    logo: "/images/semesta/barumahid-lengkap.png",
    wide: true,
    initials: "bID",
  },
  {
    id: "jururancang",
    name: "Jururancang",
    division: "mahaksa",
    status: "berjalan",
    progress: 44,
    body: "Jururancang Engineering Mahaksa: perencanaan arsitektur dan rekayasa teknis yang profesional. Partner teknis semua pekerjaan gambar dan struktur barumahID.",
    logo: "/images/semesta/jururancang.png",
    initials: "JR",
  },
  {
    id: "piatu-tim",
    name: "Piatu Tim",
    division: "bluprim",
    status: "berjalan",
    progress: 14,
    body: "Yayasan dengan layanan SaaS untuk pengelolaan dana umat di masjid. Aplikasinya sedang dibangun sambil menguji langsung kebutuhan pasarnya.",
    logo: "/images/semesta/piatu-tim.png",
    initials: "PT",
  },
  {
    id: "betools",
    name: "Betools",
    division: "inditek",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/betools.png",
    logoBg: "#010f28",
    body: "Retail perkakas dan kebutuhan konstruksi, semacam toko bangunan. Berawal dari ide alat pelindung diri \"Safety All in One\" yang pernah kami bawa ke lomba inovasi.",
    initials: "BT",
  },
  {
    id: "protonlabs",
    name: "ProtonLabs",
    division: "inditek",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/protonlabs.png",
    logoBg: "#3e1008",
    body: "Riset dan pengembangan teknologi serta material. Kami pernah meneliti beton ramah lingkungan, beton tepat mutu, beton mutu tinggi, dan beton ringan, juga penghitung kendaraan dengan sensor gerak dan YOLO.",
    initials: "PL",
  },
  {
    id: "homematery",
    name: "Homematery",
    division: "inditek",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/homematery.png",
    logoBg: "#162336",
    body: "Menjual produk hasil inovasi ProtonLabs, seperti bata ringan, paving blok, dan roster. Risetnya sudah ada, tinggal dikembangkan jadi produk.",
    initials: "HM",
  },
  {
    id: "simplee",
    name: "Simplee",
    division: "bluprim",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/simplee.png",
    body: "Brand fashion muslim yang minimalis dan modern. Pernah kami jalankan, pelajarannya jadi bekal untuk mencoba lagi.",
    initials: "SP",
  },
  {
    id: "nasikotak",
    name: "NasiKotak",
    division: "bluprim",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/nasikotak.png",
    body: "Brand F&B dengan konsep makanan praktis dan berkualitas. Resepnya sudah diuji coba lewat skema waralaba, tinggal menunggu waktu yang pas untuk dijual.",
    initials: "NK",
  },
  {
    id: "anta-fruchte",
    name: "Anta Fruchte",
    division: "bluprim",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/anta-fruchte.png",
    body: "Jajanan buah yang segar, sehat, dan modern. Berawal dari hobi jajan buah potong di pinggir jalan, lalu jadi proyek kewirausahaan yang dapat nilai A.",
    initials: "AF",
  },
  {
    id: "mahamukena",
    name: "MahaMukena",
    division: "bluprim",
    status: "ide",
    progress: 4,
    logo: "/images/semesta/mahamukena.png",
    body: "Busana muslim wanita yang premium dan elegan. Pernah kami jual, pengalaman pahitnya jadi pelajaran berharga untuk langkah berikutnya.",
    initials: "MM",
  },
];

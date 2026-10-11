// Isi halaman /layanan/contech (arahan user Okt 2026). Urutan halaman:
// 1. Hero: 4 foto saat konstruksi berganti pelan, copy general kontraktor.
// 2. Jejak proyek: wilayah satu baris, angka per lini jasa, globe + Base barumahID dan VO.
// 3. Renovasi dan bangun (layanan unggulan): copy singkat + 4 foto konstruksi, cakupan, AHSP, alur kerja.
// 4. Gambar dan modelling + desain dan analisa struktur bersama partner Jururancang: karya (geser otomatis)
//    dan paket harga yang ringkas.
import { STATS } from "./projects";

export const CONTECH_HERO = {
  label: "Jasa General Kontraktor",
  title: "Proyekmu, dibikin mudah aja.",
  subtitle:
    "barumahID bantu wujudkan proyekmu dengan mudah, dari renovasi sampai bangun konstruksi. Tersedia juga jasa gambar & modelling serta desain & analisa struktur bersama partner kami,",
  // Ditulis di baris baru (arahan user)
  partner: "Jururancang Engineering Mahaksa.",
  // Foto proyek saat konstruksi berlangsung (bahan user), diolah ke public/images/konstruksi.
  images: [
    { src: "/images/konstruksi/pengecoran-plat-lantai.webp", alt: "Bekisting dan besi plat lantai yang siap dicor" },
    { src: "/images/konstruksi/pekerjaan-tanah-alat-berat.webp", alt: "Ekskavator mengerjakan pekerjaan tanah di lokasi proyek" },
    { src: "/images/konstruksi/saluran-dan-dinding-batu.webp", alt: "Pekerja memasang dinding batu saluran, ekskavator di sampingnya" },
    { src: "/images/konstruksi/dinding-penahan-lereng.webp", alt: "Pekerja membangun dinding penahan tanah di lereng" },
  ],
};

export const CONTECH_REACH = {
  label: "Jejak proyek",
  title: "Proyek yang sudah kami kerjakan.",
  // Ringkasan wilayah dari user, ditampilkan dalam satu baris.
  regions: ["Sumatera Barat", "Jambi", "Palembang", "Jabodetabek", "Kinibalu", "Mamuju"],
  stats: [
    { value: STATS.byService.renovasiBangun, label: "Proyek Renovasi dan Bangun Konstruksi" },
    { value: STATS.byService.gambar, label: "Proyek Gambar & Modelling" },
    { value: STATS.byService.struktur, label: "Proyek Desain dan Analisa Struktur" },
  ],
};

export const RENOVASI_BANGUN = {
  label: "Layanan unggulan",
  title: "Renovasi dan bangun.",
  body: "Tidak ada harga borongan yang asal tebak. Percayakan proyekmu ke kami: dikerjakan profesional, biayanya transparan, bersama mitra konstruksi barumahID yang sudah terbukti bekerja dengan kami.",
  // "Paket" renovasi dan bangun: cakupan pekerjaan. Harganya tidak dipukul rata, dihitung per item (AHSP).
  scopes: [
    {
      name: "Renovasi",
      body: "Perbaikan dan perubahan bangunan, dari atap, plafon, dapur, lantai, sampai tambah lantai.",
    },
    {
      name: "Bangun Baru",
      body: "Rumah tinggal, kos, ruko, sampai fasilitas umum. Dari pondasi sampai finishing.",
    },
    {
      name: "Pendampingan & Manajemen Konstruksi",
      body: "Pengawasan mutu, jadwal, dan biaya selama proyek berjalan, dengan laporan progres berkala.",
    },
  ],
  priceLabel: "Harga dihitung per item pekerjaan (RAB berbasis AHSP)",
};

export const GAMBAR_STRUKTUR = {
  label: "Gambar, modelling, dan struktur",
  title: "Gambar kerja sampai hitungan struktur.",
  body: "Dikerjakan bersama partner kami, Jururancang Engineering Mahaksa. Tim insinyurnya menyiapkan denah, gambar kerja, model 3D, sampai hitungan struktur sesuai standar yang berlaku. Tinggal pilih paket sesuai kebutuhan dan tenggat proyekmu.",
  partnerTitle: "Paket harga dikerjakan oleh partner kami",
};

// Semua foto di bawah dari folder "Bahan Untuk Portofolio" (user, Okt 2026) dan masing-masing hanya dipakai
// di SATU tempat di halaman ini (arahan user: gambar selalu segar, tidak berulang).

// 4 foto konstruksi di bagian renovasi dan bangun (rasio sama, 4:5).
export const FOTO_RENOVASI = [
  { src: "/images/konstruksi/renov/pembesian-sloof.webp", alt: "Pembesian sloof dan kolom rumah", caption: "Pembesian sloof dan kolom" },
  { src: "/images/konstruksi/renov/struktur-ring-balok.webp", alt: "Dinding bata dan cetakan ring balok rumah", caption: "Dinding dan ring balok" },
  { src: "/images/konstruksi/renov/rangka-plafon.webp", alt: "Pekerja memasang rangka atap dan plafon baja ringan", caption: "Rangka atap dan plafon" },
  { src: "/images/konstruksi/renov/perbaikan-dam.webp", alt: "Pekerja memperbaiki konstruksi DAM", caption: "Perbaikan konstruksi DAM" },
];

// Karya desain rumah dan analisa struktur: strip geser otomatis. Gambar dipotong rapat ke modelnya
// (tampilan software dan pinggiran kosong dibuang), rasio asli dipertahankan supaya proporsional.
export interface Karya {
  src: string;
  w: number;
  h: number;
  alt: string;
  title: string;
  tag: "Desain rumah" | "Analisa struktur";
}
export const KARYA: Karya[] = [
  { src: "/images/karya/desain-rumah-tropis.webp", w: 1280, h: 658, alt: "Render 3D rumah bergaya tropis", title: "Rumah tropis", tag: "Desain rumah" },
  { src: "/images/karya/analisa-gedung-shelter.webp", w: 600, h: 480, alt: "Model struktur gedung shelter beton bertulang", title: "Gedung shelter", tag: "Analisa struktur" },
  { src: "/images/karya/desain-rumah-modern.webp", w: 1125, h: 720, alt: "Render 3D rumah modern dengan dua fasad miring", title: "Rumah modern", tag: "Desain rumah" },
  { src: "/images/karya/analisa-atap-lengkung.webp", w: 810, h: 370, alt: "Model struktur atap lengkung bentang lebar", title: "Atap lengkung", tag: "Analisa struktur" },
  { src: "/images/karya/desain-rumah-3-lantai.webp", w: 980, h: 719, alt: "Model 3D rumah tiga lantai", title: "Rumah tiga lantai", tag: "Desain rumah" },
  { src: "/images/karya/analisa-gedung-baja.webp", w: 525, h: 345, alt: "Model struktur gedung restoran baja", title: "Gedung restoran baja", tag: "Analisa struktur" },
  { src: "/images/karya/desain-rumah-1-lantai.webp", w: 1380, h: 570, alt: "Render 3D rumah satu lantai dengan carport", title: "Rumah satu lantai", tag: "Desain rumah" },
  { src: "/images/karya/analisa-rangka-jembatan.webp", w: 664, h: 584, alt: "Model rangka baja jembatan", title: "Rangka jembatan", tag: "Analisa struktur" },
];

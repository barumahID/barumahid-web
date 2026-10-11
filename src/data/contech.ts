// Isi halaman /layanan/contech (arahan user Okt 2026). Urutan halaman:
// 1. Hero: 4 foto saat konstruksi berganti pelan, copy general kontraktor.
// 2. Jejak proyek: wilayah satu baris, angka per lini jasa, peta + Base barumahID dan VO, lalu visual 3D.
// 3. Renovasi dan bangun (layanan unggulan): copy singkat + animasi proses membangun, cakupan, AHSP, alur kerja.
// 4. Gambar dan modelling + desain dan analisa struktur bersama partner Jururancang, dengan paket harga.
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
  title: "Renovasi dan bangun, langsung dari general kontraktornya.",
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

// Koridor foto 3D di bagian renovasi dan bangun: foto proyek saat konstruksi (bahan user + foto proyek yang ada).
export const KORIDOR_KONSTRUKSI = Array.from({ length: 16 }, (_, i) => ({
  src: `/images/konstruksi/galeri/konstruksi-${String(i + 1).padStart(2, "0")}.webp`,
  alt: "Foto proyek konstruksi barumahID",
}));

// Pembanding geser di bagian gambar dan struktur. Versi garis dibuat dari render yang sama (deteksi tepi),
// jadi sudut pandangnya persis sama.
export const COMPARE_PAIRS = [
  {
    id: "rumah",
    tab: "Rumah tinggal 2 lantai",
    before: { src: "/images/proyek/garis-render-rumah-2-lantai.webp", alt: "Gambar garis rumah tinggal 2 lantai", label: "Gambar garis" },
    after: { src: "/images/proyek/render-rumah-2-lantai.webp", alt: "Render 3D rumah tinggal 2 lantai", label: "Render 3D" },
  },
  {
    id: "pesantren",
    tab: "Gedung pesantren",
    before: { src: "/images/proyek/garis-render-pesantren.webp", alt: "Gambar garis gedung pesantren tiga lantai", label: "Gambar garis" },
    after: { src: "/images/proyek/render-pesantren.webp", alt: "Render 3D gedung pesantren tiga lantai", label: "Render 3D" },
  },
];

// Slider kartu bertumpuk: karya gambar, modelling, dan analisa struktur.
export const KARYA_GAMBAR_STRUKTUR = [
  { src: "/images/proyek/render-rumah-2-lantai.webp", alt: "Render 3D rumah tinggal 2 lantai", title: "Desain rumah tinggal 2 lantai", tag: "Gambar & Modelling" },
  { src: "/images/proyek/model-struktur-gedung-baja.webp", alt: "Model struktur gedung restoran baja di software analisa", title: "Struktur gedung restoran baja", tag: "Analisa Struktur" },
  { src: "/images/proyek/render-pesantren.webp", alt: "Render 3D gedung pesantren tiga lantai", title: "Desain dan struktur pesantren", tag: "Analisa Struktur" },
  { src: "/images/proyek/desain-saluran-precast.webp", alt: "Model 3D potongan saluran air precast", title: "Desain saluran precast", tag: "Gambar & Modelling" },
  { src: "/images/proyek/model-struktur-shelter.webp", alt: "Model struktur shelter di software analisa", title: "Struktur shelter", tag: "Analisa Struktur" },
  { src: "/images/proyek/analisa-struktur-jembatan.webp", alt: "Model struktur jembatan dengan pilar dan pondasi tiang", title: "Analisa struktur jembatan", tag: "Analisa Struktur" },
  { src: "/images/proyek/model-struktur-menara-masjid.webp", alt: "Model struktur menara masjid di software analisa", title: "Struktur menara masjid", tag: "Analisa Struktur" },
  { src: "/images/proyek/analisa-dermaga.webp", alt: "Tiang dan balok beton di bawah dermaga di tepi laut", title: "Analisa struktur dermaga", tag: "Analisa Struktur" },
];

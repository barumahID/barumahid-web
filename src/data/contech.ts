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

// Semua foto di bawah dari folder "Bahan Untuk Portofolio" (user, Okt 2026) dan masing-masing hanya dipakai
// di SATU tempat di halaman ini (arahan user: gambar selalu segar, tidak berulang).

// Koridor foto 3D di bagian renovasi dan bangun.
export const KORIDOR_KONSTRUKSI = Array.from({ length: 16 }, (_, i) => ({
  src: `/images/konstruksi/galeri/renov-bangun-${String(i + 1).padStart(2, "0")}.webp`,
  alt: "Foto proyek renovasi dan bangun barumahID",
}));

// Pembanding sebelum-sesudah di bagian gambar dan modelling. Versi garis dibuat dari render yang sama
// (deteksi tepi), jadi sudut pandangnya persis sama.
const pair = (id: string, tab: string, what: string) => ({
  id,
  tab,
  before: { src: `/images/gambar/${id}-garis.webp`, alt: `Gambar garis ${what}`, label: "Gambar garis" },
  after: { src: `/images/gambar/${id}-render.webp`, alt: `Render 3D ${what}`, label: "Render 3D" },
});
export const COMPARE_PAIRS = [
  pair("rumah-1-lantai", "Rumah 1 lantai", "rumah tinggal satu lantai"),
  pair("rumah-tropis", "Rumah tropis", "rumah bergaya tropis"),
  pair("gedung-serbaguna", "Gedung", "gedung berfasad kisi bata"),
];

// Slider kartu bertumpuk: karya desain dan analisa struktur (model dari software analisa).
export const KARYA_STRUKTUR = [
  { src: "/images/portofolio/struktur-shelter.webp", alt: "Model struktur shelter di software analisa", title: "Struktur shelter", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-pesantren.webp", alt: "Model struktur gedung pesantren", title: "Struktur gedung pesantren", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-gedung-baja.webp", alt: "Model struktur gedung restoran baja", title: "Struktur gedung restoran baja", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-ramp.webp", alt: "Model struktur ramp rumah sakit", title: "Struktur ramp rumah sakit", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-gedung-beton.webp", alt: "Model struktur gedung beton bertulang", title: "Pemodelan gedung beton", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-menara.webp", alt: "Model struktur menara masjid", title: "Struktur menara masjid", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-gedung-bertingkat.webp", alt: "Model struktur gedung bertingkat", title: "Pemodelan gedung bertingkat", tag: "Analisa Struktur" },
  { src: "/images/portofolio/struktur-rangka.webp", alt: "Model struktur rangka bangunan", title: "Pemodelan rangka bangunan", tag: "Analisa Struktur" },
];

// Bola foto portofolio: 3 foto terbaik per jasa.
export const PORTOFOLIO_JASA = [
  { name: "Renovasi & Bangun", body: "Kitchen set, taman, plafon, sampai bangun baru. Dikerjakan general kontraktor barumahID bersama mitra konstruksi." },
  { name: "Gambar & Modelling", body: "Desain dan model 3D rumah sampai gedung, supaya kamu bisa melihat hasilnya sebelum dibangun." },
  { name: "Desain & Analisa Struktur", body: "Model dan hitungan struktur jembatan, atap bentang lebar, dan gedung, bersama partner Jururancang." },
];
export const PORTOFOLIO_PILIHAN = [
  { src: "/images/portofolio/sphere-renov-kitchen-set.webp", alt: "Kitchen set putih dengan lampu gantung", title: "Renovasi dapur dan kitchen set", service: "Renovasi & Bangun" },
  { src: "/images/portofolio/sphere-gambar-rumah-modern.webp", alt: "Model 3D rumah modern dengan dua fasad miring", title: "Desain rumah modern", service: "Gambar & Modelling" },
  { src: "/images/portofolio/sphere-analisa-pilar-jembatan.webp", alt: "Model 3D pilar dan pondasi tiang jembatan", title: "Analisa pilar jembatan", service: "Desain & Analisa Struktur" },
  { src: "/images/portofolio/sphere-renov-taman.webp", alt: "Taman vertikal dan kolam di samping rumah", title: "Taman dan kolam rumah", service: "Renovasi & Bangun" },
  { src: "/images/portofolio/sphere-gambar-gedung.webp", alt: "Render 3D gedung dua lantai beratap merah", title: "Desain gedung dua lantai", service: "Gambar & Modelling" },
  { src: "/images/portofolio/sphere-analisa-atap-lengkung.webp", alt: "Model struktur atap lengkung bentang lebar", title: "Analisa atap lengkung", service: "Desain & Analisa Struktur" },
  { src: "/images/portofolio/sphere-renov-plafon.webp", alt: "Plafon dekoratif bermotif awan", title: "Renovasi plafon dekoratif", service: "Renovasi & Bangun" },
  { src: "/images/portofolio/sphere-gambar-rumah-3-lantai.webp", alt: "Model 3D rumah tiga lantai", title: "Desain rumah tiga lantai", service: "Gambar & Modelling" },
  { src: "/images/portofolio/sphere-analisa-rangka-jembatan.webp", alt: "Model rangka baja jembatan penyeberangan", title: "Analisa rangka jembatan", service: "Desain & Analisa Struktur" },
];

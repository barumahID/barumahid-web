// Isi halaman /layanan/contech (arahan user Okt 2026). Urutan halaman:
// 1. Hero: 4 foto saat konstruksi berganti pelan, copy general kontraktor.
// 2. Jejak proyek: peta + Base barumahID dan VO, ringkasan wilayah satu baris, angka per lini jasa.
// 3. Renovasi dan bangun (layanan unggulan): copy, cakupan pekerjaan, cara hitung AHSP, alur kerja.
// 4. Gambar dan modelling + desain dan analisa struktur bersama partner Jururancang, dengan paket harga.
import { STATS } from "./projects";

export const CONTECH_HERO = {
  label: "Jasa General Kontraktor",
  title: "Proyekmu, dibikin mudah aja.",
  subtitle:
    "barumahID bantu wujudkan proyekmu dengan mudah, dari renovasi sampai bangun konstruksi. Tersedia juga jasa gambar & modelling serta desain & analisa struktur bersama partner kami, Jururancang Engineering Mahaksa.",
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
  regions: ["Sumatera Barat", "Jambi", "Palembang", "Jabodetabek", "Kinabalu", "Mamuju"],
  stats: [
    { value: STATS.byService.renovasiBangun, label: "Proyek Renovasi dan Bangun Konstruksi" },
    { value: STATS.byService.gambar, label: "Proyek Gambar & Modelling" },
    { value: STATS.byService.struktur, label: "Proyek Desain dan Analisa Struktur" },
  ],
  mapHint: "Klik titik atau nama kota untuk melihat proyek di sana. Lingkaran putus-putus menandai Base barumahID dan VO.",
};

export const RENOVASI_BANGUN = {
  label: "Layanan unggulan",
  title: "Renovasi dan bangun konstruksi, langsung dari general kontraktornya.",
  body: [
    "barumahID hadir sebagai general kontraktor untuk mewujudkan proyekmu dengan mudah. Dari renovasi rumah, bangun baru, sampai pendampingan dan manajemen konstruksi, kami kelola sejak perencanaan sampai serah terima.",
    "Tidak ada harga borongan asal tebak. Biaya dihitung per item pekerjaan dengan AHSP (Analisa Harga Satuan Pekerjaan) sesuai Permen PUPR No. 1 Tahun 2022 dan harga satuan daerah. Angkanya kamu lihat dan setujui sebelum pekerjaan dimulai, lalu dikerjakan bersama mitra mandor yang sudah pernah bekerja dengan kami.",
  ],
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
  title: "Gambar kerja sampai hitungan struktur, bersama partner kami.",
  body: [
    "Untuk jasa gambar & modelling serta desain & analisa struktur, barumahID bekerja sama dengan Jururancang Engineering Mahaksa. Tim insinyurnya menyiapkan denah, gambar kerja, model 3D, sampai hitungan struktur berbasis SNI.",
    "Harganya per meter persegi luas bangunan, jelas di depan. Pilih paket sesuai kebutuhan dan tenggat proyekmu.",
  ],
  partnerTitle: "Paket harga dikerjakan oleh partner kami",
};

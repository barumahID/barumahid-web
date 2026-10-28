// Isi halaman /layanan/contech (arahan user Okt 2026). Urutan halaman:
// 1. Hero: 4 foto saat konstruksi berganti pelan, copy general kontraktor.
// 2. Jejak proyek: wilayah satu baris, angka per lini jasa, globe + Base barumahID dan VO.
// 3. Renovasi dan bangun (layanan unggulan): copy singkat + 4 foto konstruksi, cakupan, AHSP, alur kerja.
// 4. Gambar dan modelling + desain dan analisa struktur bersama partner Jururancang: karya (geser otomatis)
//    dan paket harga yang ringkas.
import { STATS } from "./projects";
import { BUILD_STEPS, TIERS, formatRupiah } from "./pricing";

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
    { src: "/images/konstruksi/bekisting-saluran-gang.webp", alt: "Pekerja memasang bekisting saluran beton di gang perumahan" },
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

// Dua layanan ConTech + miniCAD, tampil sebagai kartu di hero supaya terlihat tanpa scroll (masukan pelanggan Okt 2026:
// pengunjung tidak tahu ada jasa gambar dan struktur kalau tidak scroll ke bawah).
export const CONTECH_SERVICES = [
  { href: "#renovasi", tag: "Layanan 01", title: "Renovasi & Bangun", body: "Renovasi, bangun baru, dan manajemen konstruksi. RAB berbasis AHSP." },
  { href: "#harga", tag: "Layanan 02", title: "Gambar, Modelling & Struktur", body: "Gambar kerja, model 3D, dan analisa struktur bersama Jururancang." },
  { href: "#konsultasi", tag: "Gratis", title: "miniCAD", body: "Susun denah, tampak, 3D, dan estimasi biaya rumahmu sendiri." },
];

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

// 4 foto konstruksi di bagian renovasi dan bangun (rasio sama, 4:5). Pilihan user: survey pengukuran,
// saluran, dan pasangan batu kali, ditambah pembesian sloof. Urut sesuai alur proyek.
export const FOTO_RENOVASI = [
  { src: "/images/konstruksi/renov/survey-pengukuran.webp", alt: "Petugas melakukan survey pengukuran lahan dengan alat ukur", caption: "Survey pengukuran" },
  { src: "/images/konstruksi/renov/pembesian-sloof.webp", alt: "Pembesian sloof dan kolom rumah", caption: "Pembesian sloof dan kolom" },
  { src: "/images/konstruksi/renov/saluran.webp", alt: "Pekerjaan saluran sungai dengan ekskavator dan susunan batu", caption: "Saluran" },
  { src: "/images/konstruksi/renov/pasangan-batu-kali.webp", alt: "Pekerja memasang dinding pasangan batu kali di saluran", caption: "Pasangan batu kali" },
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

// FAQ di samping form "Ceritakan proyekmu" (arahan user: supaya kolom kiri tidak kosong).
// Jawaban hanya dari data yang sudah ada (paket, AHSP, alur kerja, wilayah proyek), tanpa janji baru.
const [BASIC, PLUS, PRO] = TIERS;
const WILAYAH = CONTECH_REACH.regions.slice(0, -1).join(", ") + ", dan " + CONTECH_REACH.regions.at(-1);
export const CONTECH_FAQ = [
  {
    question: "Konsultasinya beneran gratis?",
    answer: "Iya, konsultasi pertama gratis. Ceritakan kebutuhan dan anggaranmu dulu, kami bantu cek apa saja yang perlu dikerjakan sebelum ada penawaran.",
  },
  {
    question: "Apa yang perlu disiapkan sebelum konsultasi?",
    answer: "Cukup lokasi proyek, perkiraan luas bangunan, dan apa yang mau dikerjakan. Kalau ada sketsa, foto lokasi, atau gambar lama, kirim juga supaya kami lebih cepat paham.",
  },
  {
    question: "Bagaimana harga renovasi dan bangun dihitung?",
    answer: "Biaya dihitung per item pekerjaan dengan AHSP dan harga satuan daerah, lalu disusun jadi RAB yang kamu setujui sebelum pekerjaan dimulai. Pembayaran bertahap sesuai termin yang disepakati tertulis.",
  },
  {
    question: "Berapa biaya dan lama jasa gambar atau analisa struktur?",
    answer: `Gambar dan modelling mulai ${formatRupiah(BASIC.gambar)} per m², desain dan analisa struktur mulai ${formatRupiah(BASIC.struktur)} per m². Lama pengerjaan maksimal ${BASIC.maxDays} hari kerja untuk paket ${BASIC.name}, ${PLUS.maxDays} hari untuk ${PLUS.name}, dan ${PRO.maxDays} hari untuk ${PRO.name}.`,
  },
  {
    question: "Proyekku di luar Padang, bisa?",
    answer: `Proyek kami sudah tersebar di ${WILAYAH}. Ceritakan lokasi proyekmu, admin kami cek dulu apakah bisa dikerjakan.`,
  },
];

// Daftar "Setelah kamu kirim" di bawah form konsultasi (arahan user: sejajar dengan FAQ di sebelahnya).
// Isinya dari pesan sukses form konsultasi dan alur kerja BUILD_STEPS, tanpa janji baru.
// Catatan di "Ceritakan proyekmu" untuk proyek selain rumah (arahan user Okt 2026): miniCAD khusus rumah tinggal,
// proyek lain langsung cerita lewat form F01 (tanpa isian otomatis).
export const PROYEK_NON_RUMAH = {
  label: "Proyekmu bukan rumah?",
  body: "miniCAD di bawah khusus rumah tinggal. Untuk ruko, kantor, gudang, sekolah, shelter, atau bangunan lain, langsung ceritakan lewat form Survei Kebutuhan & Konsultasi Awal. Tim kami hubungi kamu untuk tanya detailnya.",
  cta: "Ceritakan lewat form",
};

export const SETELAH_KIRIM = [
  { title: "Kami balas lewat WhatsApp", body: "Di jam kerja, biasanya di hari yang sama. Kalau ada sketsa, kirim sekalian di chat." },
  BUILD_STEPS[1],
  BUILD_STEPS[2],
];

// Formulir klien layanan E2E (Google Form resmi, link di src/data/google-forms.ts). Diisi langsung oleh klien sesuai
// tahap proyeknya (arahan user Okt 2026: judul rapi dan singkat). Sejak masukan pelanggan Okt 2026 tidak lagi jadi
// bagian sendiri: tiap formulir menempel di langkah alur kerja (BUILD_STEPS) lewat STEP_FORMS, supaya tidak berulang.
export const FORM_KLIEN: { code: "F01" | "F02" | "F03"; stage: string; title: string; body: string }[] = [
  { code: "F01", stage: "Sebelum proyek", title: "Survei Kebutuhan & Konsultasi Awal", body: "Ceritakan kebutuhan, lokasi, dan anggaran proyekmu." },
  { code: "F02", stage: "Saat siap memesan", title: "Pemesanan Jasa Konstruksi", body: "Konfirmasi jasa yang dipilih beserta data proyek." },
  { code: "F03", stage: "Setelah proyek selesai", title: "Feedback Layanan (NPS)", body: "Nilai pengalamanmu bekerja bersama barumahID." },
];

/** Formulir per langkah alur kerja (indeks BUILD_STEPS): Konsultasi = F01, Kontrak = F02, Serah terima = F03 */
export const STEP_FORMS: Record<number, "F01" | "F02" | "F03"> = { 0: "F01", 3: "F02", 5: "F03" };

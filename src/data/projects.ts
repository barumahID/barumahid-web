// Data proyek untuk peta ConTech, portofolio, dan angka di beranda.
//
// SUMBER: sheet "Daftar Klien dan Mitra BarumahID" (20 baris), folder Drive "04. barumahID Projects",
// dan Katalog barumahID. Nama klien TIDAK ditampilkan sampai ada izin tertulis (kolom izin di sheet
// Daftar Proyek, lihat PRD). Proyek bertanda "From Other" bukan karya barumahID dan tidak boleh masuk.
//
// Nanti data ini pindah ke sheet "Daftar Proyek" (Fase 2). Sampai itu, edit di file ini.

export type Service = "gambar" | "struktur" | "renovasi" | "bangun";

export const SERVICE_LABEL: Record<Service, string> = {
  gambar: "Gambar & Modelling",
  struktur: "Desain & Analisa Struktur",
  renovasi: "Renovasi",
  bangun: "Bangun",
};

export interface ProjectCity {
  id: string;
  name: string;
  province: string;
  /** "lokasi" = proyek dikerjakan di kota ini, "klien" = klien berbasis di kota ini */
  basis: "lokasi" | "klien";
  /** false = belum dikonfirmasi, tidak tampil di peta */
  verified: boolean;
  /** Koordinat untuk globe di /layanan/contech */
  lat: number;
  lon: number;
  /** Diisi kalau proyek di luar Indonesia. Tidak dihitung di STATS.provinces. */
  country?: string;
  projects: { title: string; service: Service }[];
}

export const PROJECT_CITIES: ProjectCity[] = [
  {
    id: "padang",
    name: "Padang",
    province: "Sumatera Barat",
    lat: -0.9471,
    lon: 100.3543,
    basis: "lokasi",
    verified: true,
    projects: [
      { title: "Desain dan analisa struktur ramp rumah sakit", service: "struktur" },
      { title: "Desain dan analisa struktur pesantren, gedung A dan B", service: "struktur" },
      { title: "Desain dan analisa struktur shelter", service: "struktur" },
      { title: "Desain dan analisa struktur gedung restoran baja", service: "struktur" },
      { title: "Analisa struktur jembatan", service: "struktur" },
      { title: "Desain kanopi baja", service: "struktur" },
      { title: "Desain saluran precast", service: "gambar" },
      { title: "Desain rumah tinggal 1 dan 2 lantai", service: "gambar" },
      { title: "Desain kos 2 lantai", service: "gambar" },
      { title: "Renovasi rumah, plafon, taman, dan kitchen set", service: "renovasi" },
      { title: "Renovasi dapur dan lantai 2", service: "renovasi" },
      { title: "Bangun rumah 1 lantai", service: "bangun" },
      { title: "Bangun rumah 2 lantai", service: "bangun" },
    ],
  },
  {
    id: "painan",
    name: "Painan",
    province: "Sumatera Barat",
    lat: -1.3502,
    lon: 100.5753,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Analisa struktur baja komposit gudang pabrik es", service: "struktur" }],
  },
  {
    id: "bukittinggi",
    name: "Bukittinggi",
    province: "Sumatera Barat",
    lat: -0.3056,
    lon: 100.3692,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Desain drawing kawasan", service: "gambar" }],
  },
  {
    id: "batusangkar",
    name: "Batusangkar",
    province: "Sumatera Barat",
    lat: -0.4559,
    lon: 100.5953,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Desain dan modelling rumah (BIM)", service: "gambar" }],
  },
  {
    id: "dharmasraya",
    name: "Dharmasraya",
    province: "Sumatera Barat",
    lat: -1.0236,
    lon: 101.5469,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Desain drawing masjid", service: "gambar" }],
  },
  {
    id: "bandung",
    name: "Bandung",
    province: "Jawa Barat",
    lat: -6.9175,
    lon: 107.6191,
    basis: "klien",
    verified: true,
    projects: [
      { title: "Analisa struktur inlet bendungan", service: "struktur" },
      { title: "Desain dan analisa struktur menara masjid", service: "struktur" },
    ],
  },
  {
    id: "cimahi",
    name: "Cimahi",
    province: "Jawa Barat",
    lat: -6.8722,
    lon: 107.5425,
    basis: "klien",
    verified: true,
    projects: [
      { title: "Desain dan analisa sheetpile", service: "struktur" },
      { title: "Desain dan analisa jembatan gantung", service: "struktur" },
    ],
  },
  {
    id: "jonggol",
    name: "Jonggol",
    province: "Jawa Barat",
    lat: -6.4708,
    lon: 107.0544,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Analisa struktur gedung TPQ", service: "struktur" }],
  },
  {
    id: "tangerang",
    name: "Tangerang",
    province: "Banten",
    lat: -6.1783,
    lon: 106.6319,
    basis: "lokasi",
    verified: true,
    projects: [
      { title: "Desain dan analisa shoring girder jembatan", service: "struktur" },
      { title: "Desain dan analisa steel box", service: "struktur" },
    ],
  },
  {
    id: "mamuju",
    name: "Mamuju",
    province: "Sulawesi Barat",
    lat: -2.6806,
    lon: 118.8861,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Desain drawing dermaga", service: "gambar" }],
  },
  {
    // Dikonfirmasi user (Okt 2026). Jenis pekerjaan: analisa struktur. Judul proyek detail belum ada.
    id: "cikarang",
    name: "Cikarang",
    province: "Jawa Barat",
    lat: -6.2615,
    lon: 107.158,
    basis: "lokasi",
    verified: true,
    projects: [{ title: "Analisa struktur bangunan", service: "struktur" }],
  },
  {
    // Dikonfirmasi user (Okt 2026): folder arsip "Analisa Jembatan Kinibalu" = Kota Kinabalu, Sabah.
    id: "kinabalu",
    name: "Kota Kinabalu",
    province: "Sabah, Malaysia",
    lat: 5.9804,
    lon: 116.0735,
    basis: "lokasi",
    verified: true,
    country: "Malaysia",
    projects: [{ title: "Analisa struktur jembatan", service: "struktur" }],
  },
  {
    // Di katalog tercatat modelling BIM ruas tol Cisumdawu. Perlu konfirmasi apakah dikerjakan
    // atas nama barumahID atau sebagai pekerjaan di perusahaan lain sebelum boleh tampil.
    id: "sumedang",
    name: "Sumedang",
    province: "Jawa Barat",
    lat: -6.8381,
    lon: 107.9206,
    basis: "lokasi",
    verified: false,
    projects: [{ title: "Modelling BIM jembatan dan box tunnel", service: "gambar" }],
  },
  {
    // Ditambahkan atas info user (Okt 2026). Detail proyek belum ada; peta menampilkan "detail menyusul".
    id: "jambi",
    name: "Jambi",
    province: "Jambi",
    lat: -1.6101,
    lon: 103.6131,
    basis: "lokasi",
    verified: true,
    projects: [],
  },
  {
    id: "palembang",
    name: "Palembang",
    province: "Sumatera Selatan",
    lat: -2.9761,
    lon: 104.7458,
    basis: "lokasi",
    verified: true,
    projects: [],
  },
];

export const verifiedCities = () => PROJECT_CITIES.filter((c) => c.verified);

export interface PortfolioItem {
  slug: string;
  title: string;
  service: Service;
  city?: string;
  province?: string;
  year?: number;
  image: string;
  imageAlt: string;
  scope: string;
  software?: string[];
}

// Hanya proyek yang fotonya sudah pernah diposting di Instagram barumahID.
export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: "bangun-rumah-2-lantai-padang",
    title: "Bangun rumah 2 lantai",
    service: "bangun",
    city: "Padang",
    province: "Sumatera Barat",
    year: 2024,
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    imageAlt: "Rumah dua lantai tahap struktur selesai dengan atap genteng metal",
    scope: "Pekerjaan struktur, dinding, dan atap rumah tinggal dua lantai bersama mitra mandor.",
  },
  {
    slug: "renovasi-rangka-atap-plafon",
    title: "Renovasi rangka atap dan plafon",
    service: "renovasi",
    city: "Padang",
    province: "Sumatera Barat",
    year: 2024,
    image: "/images/proyek/renovasi-rangka-atap-padang.webp",
    imageAlt: "Rangka atap baja ringan dan rangka plafon baru di dalam rumah",
    scope: "Penggantian rangka atap dengan baja ringan dan pemasangan rangka plafon baru.",
  },
  {
    slug: "desain-rumah-2-lantai",
    title: "Desain rumah tinggal 2 lantai",
    service: "gambar",
    city: "Padang",
    province: "Sumatera Barat",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    imageAlt: "Render 3D rumah dua lantai dengan aksen kolom oranye dan pagar",
    scope: "Denah, tampak, gambar kerja, dan render 3D eksterior.",
    software: ["SketchUp", "AutoCAD"],
  },
  {
    slug: "analisa-struktur-gedung-restoran-baja",
    title: "Desain dan analisa struktur gedung restoran baja",
    service: "struktur",
    city: "Padang",
    province: "Sumatera Barat",
    image: "/images/proyek/model-struktur-gedung-baja.webp",
    imageAlt: "Model 3D struktur rangka baja gedung di software analisa struktur",
    scope: "Pemodelan struktur, analisa beban, dan dimensi elemen baja.",
    software: ["ETABS"],
  },
  {
    slug: "analisa-struktur-shelter",
    title: "Desain dan analisa struktur shelter",
    service: "struktur",
    city: "Padang",
    province: "Sumatera Barat",
    image: "/images/proyek/model-struktur-shelter.webp",
    imageAlt: "Model 3D struktur shelter bertingkat di software analisa struktur",
    scope: "Pemodelan struktur beton bertulang dan analisa beban gempa.",
    software: ["ETABS"],
  },
  {
    slug: "analisa-struktur-pesantren",
    title: "Desain dan analisa struktur pesantren",
    service: "struktur",
    city: "Padang",
    province: "Sumatera Barat",
    image: "/images/proyek/render-pesantren.webp",
    imageAlt: "Model 3D gedung pesantren tiga lantai",
    scope: "Desain dan analisa struktur dua gedung pesantren.",
    software: ["ETABS"],
  },
  {
    slug: "analisa-struktur-menara-masjid",
    title: "Desain dan analisa struktur menara masjid",
    service: "struktur",
    image: "/images/proyek/model-struktur-menara-masjid.webp",
    imageAlt: "Model 3D struktur menara masjid dan potongan penampangnya",
    scope: "Pemodelan menara beton dan pengecekan penampang.",
    software: ["ETABS"],
  },
  {
    slug: "analisa-struktur-dermaga",
    title: "Analisa struktur dermaga",
    service: "struktur",
    image: "/images/proyek/analisa-dermaga.webp",
    imageAlt: "Tiang dan balok beton di bawah dermaga di tepi laut",
    scope: "Pemeriksaan kondisi eksisting dan analisa struktur dermaga beton.",
  },
];

/** Angka di beranda. Ditarik dari data di atas plus arsip proyek. Ubah hanya kalau ada bukti. */
export const STATS = {
  // Ditampilkan "30+". Arsip Drive "04. barumahID Projects": 46 folder, jadi 43 setelah
  // dikurangi 2 folder From Other dan 1 renovasi kantor sendiri. Sengaja dibulatkan ke bawah.
  projects: 30,
  // Provinsi Indonesia saja. Kota luar negeri (country terisi) dihitung terpisah di `countries`.
  provinces: new Set(verifiedCities().filter((c) => !c.country).map((c) => c.province)).size,
  cities: verifiedCities().length,
  countries: 1 + new Set(verifiedCities().flatMap((c) => (c.country ? [c.country] : []))).size,
  since: 2018,
  // Jumlah proyek per lini jasa, dari user (Okt 2026). Tampil di halaman ConTech sebagai "10+", "15+", dst.
  byService: {
    renovasiBangun: 10,
    gambar: 15,
    struktur: 10,
  },
};

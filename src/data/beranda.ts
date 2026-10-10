// Isi dua beranda: Konstruksi ("/") dan Rent-to-Own ("/rent-to-own").
// Arahan user: barumahID punya 2 layanan utama, tampil sebagai 2 tab di beranda. UI tetap sama, isinya beda.
// Angka jangan ditulis di sini, ambil dari STATS di projects.ts.

export type BerandaId = "konstruksi" | "rto";

export const BERANDA_TABS: { id: BerandaId; href: string; label: string; hint: string }[] = [
  { id: "konstruksi", href: "/", label: "Konstruksi", hint: "Gambar, struktur, renovasi, bangun" },
  { id: "rto", href: "/rent-to-own", label: "Rent-to-Own", hint: "Sewa sambil menabung DP" },
];

export interface HeroCopy {
  tagline: string;
  mediaSrc: string;
  label: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export const HERO: Record<BerandaId, HeroCopy> = {
  konstruksi: {
    tagline: "Proyekmu, dibikin mudah aja.",
    mediaSrc: "/images/proyek/render-rumah-2-lantai.webp",
    label: "Layanan konstruksi barumahID",
    title: "Proyekmu, dibikin mudah aja.",
    body: "Butuh gambar rumah, hitungan struktur, renovasi, atau bangun dari nol? Dikerjakan insinyur, biayanya dihitung per item pekerjaan dan kamu setujui di awal.",
    primary: { label: "Lihat jasa dan harga", href: "/layanan/constech" },
    secondary: { label: "Lihat peta proyek", href: "#peta-proyek" },
  },
  rto: {
    tagline: "Sewa hari ini. Miliki hunian nantinya.",
    mediaSrc: "/images/hero-card.webp",
    label: "Program Rent-to-Own barumahID",
    title: "Sewa yang tidak sia-sia.",
    body: "Lewat Rent-to-Own, 25% dari sewa bulananmu dicatat jadi saldo DP. Saat saldonya cukup, kamu lanjut ke jalur kepemilikan.",
    primary: { label: "Mulai Perjalanan Saya", href: "/layanan/rto" },
    secondary: { label: "Pilih jalurmu", href: "#jalur-rto" },
  },
};

export interface Problem {
  title: string;
  body: string;
}

export const PROBLEMS: Record<BerandaId, { title: string; closing: string; items: Problem[] }> = {
  konstruksi: {
    title: "Membangun rumah sendiri masih terasa ribet.",
    closing: "barumahID mengerjakannya dari gambar sampai serah terima.",
    items: [
      { title: "Cari jasa bangun yang bisa dipercaya itu susah.", body: "Harga sering tidak jelas, hasil tidak sesuai gambar." },
      { title: "Biaya membengkak di tengah jalan.", body: "Tanpa RAB yang rinci, tambahan biaya muncul terus." },
      { title: "Bingung mulai dari mana.", body: "Desain, struktur, izin, dan biaya berjalan sendiri-sendiri." },
    ],
  },
  rto: {
    title: "Punya rumah sendiri masih terasa jauh.",
    closing: "barumahID menyatukan sewa, tabungan DP, dan jalur kepemilikan.",
    items: [
      { title: "DP rumah terasa makin jauh.", body: "Tiap bulan bayar sewa, tapi tidak ada yang jadi milik sendiri." },
      { title: "Syarat KPR berat.", body: "DP besar, slip gaji formal, dan riwayat kredit sering jadi penghalang." },
      { title: "Bingung mulai dari mana.", body: "Sewa, tabungan DP, dan KPR berjalan sendiri-sendiri." },
    ],
  },
};

export interface PhotoCard {
  href: string;
  audience: string;
  name: string;
  headline: string;
  body: string;
  cta: string;
  image: string;
  alt: string;
  badge?: string;
}

export const JASA_CARDS: PhotoCard[] = [
  {
    href: "/layanan/constech#harga",
    audience: "Mulai dari gambar",
    name: "Gambar & Modelling",
    headline: "Denah, tampak, gambar kerja, sampai 3D.",
    body: "Untuk rumah, kos, ruko, sampai fasilitas umum. Dipesan lewat Jururancang, mitra teknis barumahID.",
    cta: "Lihat paket dan harga",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    alt: "Render 3D desain rumah dua lantai karya tim barumahID",
  },
  {
    href: "/layanan/constech#harga",
    audience: "Biar bangunan aman",
    name: "Desain & Analisa Struktur",
    headline: "Hitungan struktur berbasis SNI.",
    body: "Dihitung dengan ETABS atau SAP2000, lengkap dengan dimensi dan penulangan.",
    cta: "Lihat paket dan harga",
    image: "/images/proyek/model-struktur-menara-masjid.webp",
    alt: "Model 3D struktur menara masjid dan potongan penampangnya",
  },
  {
    href: "/layanan/constech#renovasi",
    audience: "Sampai jadi bangunan",
    name: "Renovasi & Bangun",
    headline: "RAB per item pekerjaan dengan AHSP.",
    body: "Dikerjakan bersama mitra mandor. Biaya kamu lihat dan setujui sebelum pekerjaan dimulai.",
    cta: "Lihat cara hitung RAB",
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    alt: "Rumah dua lantai yang sedang dibangun bersama mitra mandor",
  },
];

// Hub /layanan: tiga layanan barumahID (isi asli revamp, dipindah dari komponen ke data).
export const LAYANAN_CARDS: PhotoCard[] = [
  {
    href: "/layanan/rto",
    audience: "Untuk calon pemilik rumah",
    name: "Rent-to-Own",
    headline: "Sewa hari ini. Miliki hunian nantinya.",
    body: "Sewa unit mitra, 25% dari sewa jadi saldo DP. Ada listing rumah, simulasi DP, dan tiga jalur kepemilikan.",
    cta: "Lihat program RTO",
    image: "/images/hero-card.webp",
    alt: "Rumah tinggal satu lantai dengan pagar dan taman depan",
  },
  {
    href: "/layanan/constech",
    audience: "Untuk pemilik proyek",
    name: "ConsTech",
    headline: "Proyekmu, dibikin mudah aja.",
    body: "Jasa gambar, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, dihitung transparan.",
    cta: "Lihat jasa dan harga",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    alt: "Render 3D desain rumah dua lantai karya tim barumahID",
  },
  {
    href: "/kemitraan",
    audience: "Untuk mitra dan profesional",
    name: "Kemitraan",
    headline: "Tumbuh bareng ekosistem barumahID.",
    body: "Penyedia kos, developer, kontraktor, tukang, supplier, freelancer, dan institusi pendidikan.",
    cta: "Pilih peran mitra",
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    alt: "Rumah dua lantai yang sedang dibangun bersama mitra mandor",
  },
];

// Status jalur mengikuti RTO_PATHS (rto.ts): Siap Berdaya & Siap Bangun inti program, Siap Beli segera.
export const RTO_CARDS: PhotoCard[] = [
  {
    href: "/layanan/rto#siap-berdaya",
    audience: "Belum punya DP",
    name: "Siap Berdaya",
    headline: "Sewa sambil menabung DP.",
    body: "Tinggal di unit mitra. 25% dari sewa jadi saldo DP, lalu lanjut ke KPR bersama developer mitra.",
    cta: "Pelajari Siap Berdaya",
    image: "/images/hero-card.webp",
    alt: "Rumah tinggal satu lantai dengan pagar dan taman depan",
    badge: "Inti program",
  },
  {
    href: "/layanan/rto#siap-bangun",
    audience: "Sudah punya lahan",
    name: "Siap Bangun",
    headline: "Punya lahan, siap membangun.",
    body: "Sewa sambil mengumpulkan modal, lalu bangun di tanahmu sendiri dengan RAB transparan dari tim ConsTech.",
    cta: "Pelajari Siap Bangun",
    image: "/images/proyek/bangun-rumah-2-lantai-padang-2.webp",
    alt: "Rumah dua lantai dalam tahap pembangunan",
    badge: "Inti program",
  },
  {
    href: "/layanan/rto#siap-beli",
    audience: "Mau langsung beli",
    name: "Siap Beli",
    headline: "Unit dijual, lengkap dengan simulasi KPR.",
    body: "Unit yang dijual pemiliknya lewat barumahID. Kami bantu hitung DP, cicilan KPR, dan biaya transaksi.",
    cta: "Pelajari Siap Beli",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    alt: "Ilustrasi render rumah dua lantai",
    badge: "Segera",
  },
];

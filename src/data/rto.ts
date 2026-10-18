// Konten program Rent-to-Own. Aturan wajib (PRD Produk v3.2 dan PRD Website v1):
// - Program masih tahap persiapan. Jangan tulis seolah sudah ada transaksi berjalan.
// - Rumah Beli BUKAN sewa-beli sampai legal opinion Option Buy selesai. Tulis sebagai unit dijual + simulasi KPR.
// - Jangan sebut nama BTN atau bank lain sebelum ada kerja sama tertulis.
// - Saldo DP disebut "dana titipan" atau "uang jaminan kepemilikan", bukan "simpanan" (saran Legal Kit).

export const RTO_RATE = 0.25;

// Keputusan user Okt 2026 (angka di PRD v3.2 dan Legal Kit sempat berbeda, ini yang dipakai):
// - Saldo DP baru dicatat setelah RTO terbuka dan Kontrak RTO ditandatangani (Level 3).
// - RTO terbuka setelah KTP terverifikasi, 6 bulan sewa tepat waktu di unit mitra, dan Skor Siap Punya Rumah >= 36.
// - Model dua harga, semuanya terbuka (keputusan user Okt 2026, "model yang paling aman"):
//   harga deal = hasil nego dengan penyedia kos, pemilik selalu menerima ini penuh;
//   sewa biasa = harga deal + biaya layanan barumahID (harga yang tampil di listing, dibayar 6 bulan pertama dan oleh penyewa
//   yang tidak ikut RTO). Sewa biasa dihitung di database (kolom rto_units.rent_regular), jadi persen biaya layanan tidak
//   ada di kode situs ini (repo publik) dan harga deal tidak keluar lewat API publik;
//   sewa program = sewa biasa + setoran DP, dibayar setelah RTO terbuka. 25% dari sewa program jadi saldo DP, jadi
//   setoran DP = sepertiga sewa biasa. Fungsi database mencatat 25% dari pembayaran setelah Kontrak RTO, jadi tim
//   mencatat sewa peserta RTO dengan harga sewa program.
// - Harga rumah tujuan DIKUNCI di MoU sejak awal sampai konversi. Ini keunggulan utama RTO: developer mitra sudah
//   memperhitungkan masa tunggunya, penyewa aman karena harga tidak naik.
// - Mundur dari program: lihat REFUND_POLICY (setoran kembali dipotong biaya administrasi; kembali penuh kalau KPR ditolak
//   bukan kelalaian penyewa atau force majeure; penuh plus kompensasi kalau barumahID wanprestasi).
export const RTO_UNLOCK_MONTHS = 6;
export const RTO_UNLOCK_SCORE = 36;

const round1k = (n: number) => Math.round(n / 1_000) * 1_000;
/** Sewa program RTO = sewa biasa + setoran DP, supaya 25% dari sewa program jadi saldo DP */
export const programRent = (rent: number) => round1k(rent / (1 - RTO_RATE));
/** Setoran DP per bulan = 25% dari sewa program = selisih sewa program dan sewa biasa */
export const dpPerMonth = (rent: number) => programRent(rent) - rent;
/** Contoh sewa biasa di halaman RTO (contoh sewa program dan FAQ), sama dengan nilai awal simulasi */
export const PRICE_EXAMPLE_RENT = 2_000_000;

// Konversi (arahan user Okt 2026): setelah RTO terbuka, rumah tujuan dipilih dan MoU dengan developer mitra
// ditandatangani di awal. 2 sampai 4 tahun kemudian saldo dikonversi jadi DP. Simulasi menghitung saldo saat konversi
// dan harga rumah yang DP-nya tertutup, bukan "berapa tahun sampai target" (hasilnya dulu bisa 6 tahun lebih).
// Aliran dana: dari sewa program, 25% ke rekening dana titipan (saldo DP), sisanya sewa biasa (pemilik + layanan barumahID).
export const RTO_CONVERT_YEARS = { min: 2, max: 4, default: 3 } as const;
export const RTO_CONVERT_OPTIONS = [2, 3, 4];
/** Persen DP rumah yang umum diminta developer, untuk pilihan di simulasi */
export const DP_PCT_OPTIONS = [5, 10, 15, 20];
/** Saldo DP setelah sekian tahun RTO dari sewa biasa `rent`: setoran DP tiap bulan, ditambah kanal percepatan */
export const saldoAfter = (rent: number, years: number, extraPerMonth = 0) => (dpPerMonth(rent) + extraPerMonth) * years * 12;
/** Harga rumah tertinggi yang DP-nya tertutup saldo, dibulatkan ke bawah per Rp5 juta */
export const maxHomePrice = (saldo: number, dpPct: number) => Math.floor(saldo / (dpPct / 100) / 5_000_000) * 5_000_000;
/** Tabungan tambahan per bulan untuk menutup kekurangan DP dalam sekian tahun, dibulatkan ke atas per Rp1.000 */
export const topUpPerMonth = (gap: number, years: number) => Math.ceil(gap / (years * 12) / 1_000) * 1_000;
/** Sewa biasa per bulan yang dibutuhkan supaya DP tertutup dalam sekian tahun */
export const rentForDp = (dp: number, years: number) => ((dp / (years * 12)) * (1 - RTO_RATE)) / RTO_RATE;
/** Ilustrasi KPR di simulasi: bunga tetap. Keputusan, bunga, dan biaya akhir ada di bank. */
export const KPR_ILUSTRASI = { ratePct: 8, tenorYears: 20 };
export function kprInstallment(loan: number, ratePct: number = KPR_ILUSTRASI.ratePct, tenorYears: number = KPR_ILUSTRASI.tenorYears) {
  if (loan <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = tenorYears * 12;
  return r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
}

const { min: CONV_MIN, max: CONV_MAX } = RTO_CONVERT_YEARS;
const juta = (n: number) => `Rp${(n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })} juta`;
const rpFull = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));

export type RtoCategory = "siap-berdaya" | "siap-bangun" | "siap-beli";

export interface RtoPath {
  id: RtoCategory;
  name: string;
  explainer: string;
  forWho: string;
  how: string;
  status: string;
}

export const RTO_PATHS: RtoPath[] = [
  {
    id: "siap-berdaya",
    name: "Rumah Berdaya",
    explainer: "Ngekos sambil menabung DP rumah",
    forWho: "Belum punya DP? Mulai dari ngekos di unit mitra.",
    how: "Harga rumah tujuan dikunci sejak MoU, DP-nya terkumpul dari sewa. Saldo DP untuk rumah developer mitra, bukan kos yang kamu tempati.",
    status: "Inti program",
  },
  {
    id: "siap-bangun",
    name: "Rumah Bangun",
    explainer: "Punya lahan, bangun rumah sendiri",
    forWho: "Punya lahan atau aset, tapi modal bangun belum cukup.",
    how: "Lahanmu jadi rumah. Saldo DP dari sewa ditambah tabunganmu jadi modal awal 25% RAB, lalu barumahID atau developer mitra yang membangun.",
    status: "Inti program",
  },
  {
    id: "siap-beli",
    name: "Rumah Beli",
    explainer: "Rumah siap huni, langsung jual beli",
    forWho: "Untuk penjual properti dan pembeli yang sudah siap KPR.",
    how: "Di luar program RTO. Properti dicek sebelum tayang, lalu kami pertemukan pembeli dan penjual sampai akad.",
    status: "Jual beli",
  },
];

/** Langkah singkat per jalur di platform listing (Rumah Berdaya memakai RTO_STEPS). Kalimat padat, tanpa pengulangan. */
export const PATH_STEPS: Record<Exclude<RtoCategory, "siap-berdaya">, { title: string; body: string }[]> = {
  "siap-bangun": [
    { title: "Ngekos di unit mitra", body: `${RTO_UNLOCK_MONTHS} bulan tepat waktu, skor minimal ${RTO_UNLOCK_SCORE}.` },
    { title: "Survei lahan dan RAB", body: "Desain dan RAB disusun bersama Jururancang." },
    { title: "Kumpulkan modal 25% RAB", body: `Saldo ${CONV_MIN}-${CONV_MAX} tahun ditambah tabunganmu.` },
    { title: "Mulai bangun", body: "Sisa biaya bertahap, atau mulai dari tahap pertama." },
  ],
  "siap-beli": [
    { title: "Pasang iklan", body: "Pemilik atau developer mendaftarkan properti." },
    { title: "Dicek tim", body: "Data, dokumen, dan foto dicek sebelum tayang." },
    { title: "Survei dan hitung", body: "DP, cicilan KPR, BPHTB, dan notaris." },
    { title: "Akad", body: "Kami dampingi sampai akad. KPR tetap keputusan bank." },
  ],
};

export const RTO_STEPS = [
  { title: "Ngekos di unit mitra", body: `${RTO_UNLOCK_MONTHS} bulan sewa biasa, bayar tepat waktu, KTP terverifikasi.` },
  { title: "Lolos Gerbang RTO", body: `Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE}. Kami kabari begitu terpenuhi.` },
  { title: "Pilih rumah, harga dikunci", body: "Kontrak RTO dan MoU Rumah Tujuan dengan developer mitra." },
  { title: `Jadi DP dalam ${CONV_MIN}-${CONV_MAX} tahun`, body: "25% sewa program masuk saldo, lalu PPJB dan KPR." },
];

// ---- Level perjalanan (gamifikasi): penyewa naik level dengan menyelesaikan misi; RTO terbuka di gerbang ----

export interface RtoLevel {
  id: string;
  /** Nomor level; null = gerbang */
  n: number | null;
  name: string;
  short: string;
  /** Yang harus diselesaikan untuk naik ke tahap ini */
  missions: string[];
  /** Yang terbuka setelah tahap ini tercapai */
  unlocks: string[];
  stage: "sewa" | "gerbang" | "rto";
}

export const RTO_LEVELS: RtoLevel[] = [
  {
    id: "l0",
    n: 0,
    name: "Penjelajah",
    short: "Akun dibuat",
    missions: ["Buat akun barumahID", "Lengkapi profil dan isi formulir calon penyewa (F11)"],
    unlocks: ["Simulasi DP pribadi", "Simpan unit favorit dari listing"],
    stage: "sewa",
  },
  {
    id: "l1",
    n: 1,
    name: "Terverifikasi",
    short: "KTP dan data dicek",
    missions: ["Unggah KTP", "Tim barumahID mengecek data dalam 1×24 jam kerja"],
    unlocks: ["Jadwalkan survei unit", "Sewa unit mitra lewat barumahID"],
    stage: "sewa",
  },
  {
    id: "l2",
    n: 2,
    name: "Penyewa Konsisten",
    short: `${RTO_UNLOCK_MONTHS} bulan bayar tepat waktu`,
    missions: ["Tinggal di unit mitra barumahID", `Bayar sewa tepat waktu ${RTO_UNLOCK_MONTHS} bulan berturut-turut`],
    unlocks: ["Riwayat bayar tercatat di dashboard", "Asesmen Skor Siap Punya Rumah"],
    stage: "sewa",
  },
  {
    id: "gerbang",
    n: null,
    name: "Gerbang RTO",
    short: `Skor minimal ${RTO_UNLOCK_SCORE}`,
    missions: [`Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE} dari 100`, "Tim menjelaskan jalur yang paling cocok untukmu"],
    unlocks: ["Boleh mengajukan program RTO"],
    stage: "gerbang",
  },
  {
    id: "l3",
    n: 3,
    name: "Peserta RTO",
    short: "Kontrak RTO, 25% jadi DP",
    missions: ["Tanda tangani Kontrak RTO", "Bayar sewa program setiap bulan"],
    unlocks: ["25% sewa program dicatat jadi saldo DP", "Laporan saldo DP setiap bulan"],
    stage: "rto",
  },
  {
    id: "l4",
    n: 4,
    name: "Rumah Terpilih",
    short: "MoU rumah tujuan",
    missions: ["Pilih rumah dari developer mitra", "MoU ditandatangani: unit, harga terkunci, dan jadwal konversi"],
    unlocks: ["Harga rumah tujuan tidak naik sampai konversi", "Target DP dan jadwal konversi tampil di dashboard"],
    stage: "rto",
  },
  {
    id: "l5",
    n: 5,
    name: "Siap Akad",
    short: `Konversi setelah ${CONV_MIN}-${CONV_MAX} tahun`,
    missions: [`Masa RTO minimal ${CONV_MIN} tahun, sesuai jadwal di MoU`, "Saldo DP mencapai target di MoU"],
    unlocks: ["Saldo dikonversi jadi DP, lanjut PPJB dan KPR", "Atau mulai bangun di lahanmu (Rumah Bangun)"],
    stage: "rto",
  },
];

// ---- Skor Siap Punya Rumah (rules-based V1, PRD v3.2 bagian 06) ----

export const READINESS_ASPECTS = [
  { name: "Kestabilan penghasilan", max: 35, hint: "Tetap dengan slip gaji, kontrak rutin, atau belum menentu." },
  { name: "Kebiasaan menabung", max: 30, hint: "Berapa persen penghasilan yang rutin kamu sisihkan." },
  { name: "Riwayat bayar", max: 20, hint: "Dari 3 bulan rekening koran, lalu dari riwayat sewa di barumahID." },
  { name: "Kepemilikan aset", max: 10, hint: "Tanah atas nama sendiri, tanah keluarga, atau belum ada." },
  { name: "Komitmen dan target", max: 5, hint: "Seberapa jelas target rumah yang kamu tuju." },
];

export const READINESS_BANDS = [
  { range: "0-35", title: "Belum siap", body: "Edukasi keuangan dulu. Tetap bisa sewa biasa." },
  { range: "36-75", title: "Rumah Berdaya atau Rumah Bangun", body: "RTO terbuka. Rumah Bangun kalau punya lahan." },
  { range: "76-100", title: "Rumah Beli", body: "Penghasilan kuat, bisa langsung KPR." },
];

// ---- Peran di platform ----

export interface RtoRole {
  id: "penyewa" | "penyedia" | "developer";
  name: string;
  tagline: string;
  gets: string[];
  form: { code: "F11" | "F14" | "F16"; label: string };
  /** Akun Portal untuk peran ini (dashboard penyewa, penyedia kos, atau developer) */
  portal: { href: string; label: string };
}

export const RTO_ROLES: RtoRole[] = [
  {
    id: "penyewa",
    name: "Penyewa",
    tagline: "Ngekos dulu, naik level, buka RTO.",
    gets: ["Unit yang sudah dicek tim", "Harga rumah tujuan dikunci", "Dashboard level dan saldo DP"],
    form: { code: "F11", label: "Formulir calon penyewa" },
    portal: { href: "/portal/daftar?akun=penyewa", label: "Buat akun penyewa" },
  },
  {
    id: "penyedia",
    name: "Penyedia kos",
    tagline: "Kamar terisi penyewa terverifikasi yang betah lama.",
    gets: ["Listing gratis", "Harga yang disepakati, disetor tiap bulan", "Dashboard unit dan penyewa"],
    form: { code: "F14", label: "Formulir penyedia" },
    portal: { href: "/portal/daftar?akun=mitra", label: "Buat akun mitra" },
  },
  {
    id: "developer",
    name: "Developer mitra",
    tagline: "Pasokan calon pembeli yang DP-nya sedang terkumpul.",
    gets: ["Calon pembeli terverifikasi", "Dashboard rumah tujuan dan calon pembeli", "Imbal jasa hanya saat akad"],
    form: { code: "F16", label: "Formulir developer" },
    portal: { href: "/portal/daftar?akun=mitra", label: "Buat akun mitra" },
  },
];

// Formulir publik RTO (Google Form resmi, link di google-forms.ts). F12 (skoring) dan F17 (lanjutan developer)
// diisi tim saat wawancara, jadi tidak ditampilkan. F15 dan F18 (feedback mitra) ada di halaman Kemitraan.
export const RTO_FORMS: { code: "F11" | "F13" | "F14" | "F16"; who: string; title: string; body: string }[] = [
  { code: "F11", who: "Calon penyewa", title: "Pendaftaran Calon Penyewa", body: "Data diri, hunian sekarang, kesiapan, dan unit yang dicari." },
  { code: "F14", who: "Pemilik kos", title: "Pendaftaran Penyedia Kos dan Rumah Sewa", body: "Properti, jumlah kamar, harga, dan fasilitas." },
  { code: "F16", who: "Developer", title: "Pendaftaran Developer Mitra", body: "Perusahaan, proyek, kisaran harga, dan unit siap." },
  { code: "F13", who: "Peserta aktif", title: "Feedback Peserta RTO", body: "Untuk peserta yang sudah 3 bulan di program." },
];

// ---- Panduan per peran (diringkas dari SOP RTO/01-15, QC/01, FIN/01, CS/01) ----

export interface GuideStep {
  title: string;
  body: string;
}

export const GUIDES: Record<RtoRole["id"], { intro: string; steps: GuideStep[]; notes: string[] }> = {
  penyewa: {
    intro: "Dari ngekos sampai akad. Semua tahap tercatat di dashboard akunmu.",
    steps: [
      { title: "Buat akun dan isi F11", body: "Tim menghubungimu dalam 1×24 jam kerja." },
      { title: "Verifikasi KTP dan survei unit", body: "Setelah KTP dicek, pilih kamar atau rumah sewa mitra." },
      { title: "Check-in", body: "Tanda tangan Perjanjian Sewa dan Berita Acara Serah Terima. Kondisi unit difoto bersama." },
      { title: "Bayar sewa biasa ke barumahID", body: `Tepat waktu ${RTO_UNLOCK_MONTHS} bulan berturut-turut. Pengingat dikirim 3 hari sebelum jatuh tempo.` },
      { title: "Lolos Gerbang RTO", body: `Isi asesmen, capai Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE}, lalu ajukan RTO dari dashboard.` },
      { title: "Kontrak RTO dan MoU Rumah Tujuan", body: "Pilih rumah developer mitra. Harganya dikunci sampai konversi." },
      { title: "Bayar sewa program", body: "Sewa biasa + setoran DP. 25% dari sewa program tercatat jadi saldo DP setiap bulan." },
      { title: "Konversi dan akad", body: `Setelah ${CONV_MIN}-${CONV_MAX} tahun, saldo jadi DP. Lanjut PPJB dan KPR, atau mulai bangun (Rumah Bangun).` },
    ],
    notes: [
      "Sewa biasa sudah termasuk biaya layanan barumahID. Semua angka tertulis di kontrak sebelum kamu tanda tangan.",
      "Mundur sebelum konversi: setoranmu kembali dipotong biaya administrasi, bonus dan harga terkunci hangus.",
      "barumahID tidak menjamin persetujuan KPR. Keputusan tetap ada di bank.",
      "Telat bayar? Tim menghubungimu dulu untuk mencari jalan keluar, misalnya cicil atau perpanjangan tenggat.",
    ],
  },
  penyedia: {
    intro: "Daftarkan unit, kami cek, lalu kami isi dengan penyewa terverifikasi.",
    steps: [
      { title: "Buat akun mitra dan isi F14", body: "Properti, jumlah kamar, harga, dan fasilitas. Tim menghubungimu dalam 1×24 jam kerja." },
      { title: "Negosiasi harga", body: "Dibandingkan dengan 3-5 unit sejenis di sekitarnya, lalu disepakati bersama." },
      { title: "Inspeksi unit", body: "Paling lambat 5 hari kerja. Hasilnya Layak, Layak dengan Catatan, atau Tidak Layak." },
      { title: "MoU Mitra Penyedia", body: "Harga yang disepakati, jadwal setor, dan standar unit tertulis di MoU." },
      { title: "Unit tayang", body: "Foto dan deskripsi dikelola di Portal, lalu unit tampil di listing barumahID." },
      { title: "Penyewa masuk, sewa disetor", body: "Sewa ditagih barumahID, lalu disetorkan ke kamu setiap bulan sesuai jadwal di MoU." },
    ],
    notes: [
      "Kamu menerima harga yang disepakati, penuh, baik penyewanya ikut RTO atau tidak.",
      "Ikut program RTO itu pilihan, diatur lewat addendum.",
      "Harga sewa tidak diubah sepihak selama kontrak penyewa berjalan.",
    ],
  },
  developer: {
    intro: "Pasokan calon pembeli terverifikasi yang DP-nya sedang terkumpul.",
    steps: [
      { title: "Buat akun mitra dan isi F16", body: "Perusahaan, proyek, kisaran harga, dan unit siap. Tim menghubungi dalam 3 hari kerja." },
      { title: "Due diligence", body: "Kami cek proyek dan legalitasnya, lalu bahas alokasi unit untuk program." },
      { title: "NDA dan MoU Developer", body: "Harga dikunci sampai konversi, imbal jasa dibayar saat akad." },
      { title: "Rumah tayang", body: "Daftarkan rumah tujuan dan fotonya di Portal. Tayang setelah ditinjau tim." },
      { title: "MoU Rumah Tujuan", body: `Peserta memilih rumahmu. Konversi ${CONV_MIN}-${CONV_MAX} tahun kemudian.` },
      { title: "Konversi dan akad", body: "Saldo peserta dicairkan sebagai DP, lalu PPJB dan KPR." },
    ],
    notes: [
      "Pantau calon pembeli di Portal. Identitasnya dibuka lewat tim setelah NDA.",
      "Kalau unit di MoU ditarik sebelum konversi, developer menyiapkan unit pengganti yang setara.",
      "Kerja sama tidak eksklusif.",
    ],
  },
};

// ---- Aturan dana ----

/** Tahapan dari sewa sampai konversi (dulu bertahap per persen DP; sekarang MoU dan harga terkunci di awal, konversi setelah 2-4 tahun) */
export const PRICE_LOCK_STAGES = [
  { at: `Bulan 1-${RTO_UNLOCK_MONTHS}`, body: "Sewa biasa di unit mitra sambil memenuhi syarat RTO." },
  { at: "RTO terbuka", body: "Pilih rumah dari developer mitra. MoU ditandatangani dan harga rumah dikunci sejak hari itu." },
  { at: `${CONV_MIN}-${CONV_MAX} tahun`, body: "Bayar sewa program, 25%-nya jadi saldo DP setiap bulan. Tim bantu siapkan berkas KPR." },
  { at: "Konversi", body: "Saldo dikonversi jadi DP. PPJB, lalu akad KPR dengan harga yang sama seperti di MoU." },
];

/**
 * Aturan mundur (usulan Claude atas permintaan user Okt 2026: saldo tetap uang penyewa, tapi tidak bisa dipakai untuk
 * keluar-masuk sesuka hati). Setoran sendiri kembali dipotong biaya administrasi; bonus ekosistem dan harga terkunci
 * hangus; ikut lagi mulai dari Gerbang RTO. Nominal biaya administrasi ditulis di Kontrak RTO, tidak di website.
 */
export const REFUND_POLICY = [
  { when: "Mundur atas keinginan sendiri", rule: "Setoranmu kembali, dipotong biaya administrasi. Bonus dan harga terkunci hangus." },
  { when: "Ikut lagi setelah mundur", rule: "Mulai lagi dari Gerbang RTO, dengan MoU dan harga baru." },
  { when: "KPR ditolak bank, bukan kelalaianmu", rule: "Saldo kembali penuh, tanpa potongan." },
  { when: "Force majeure atau bencana", rule: "Saldo kembali penuh, tanpa potongan." },
  { when: "barumahID tidak memenuhi kewajibannya", rule: "Saldo kembali penuh plus kompensasi." },
];
export const REFUND_PROCESS = "Ajukan mundur 1 bulan sebelumnya. Dana dicairkan paling lambat 14 hari kerja setelah itu.";

// ---- Dokumen dan perjanjian ----

/** Dokumen per peran, selaras dengan alur di halaman RTO dan Portal */
export const RTO_DOCUMENTS = [
  { name: "Syarat dan Ketentuan", who: "Semua pengguna", when: "Saat membuat akun", what: "Akun, data pribadi, dan aturan program." },
  { name: "Perjanjian Sewa", who: "Penyewa", when: "Saat check-in", what: "Sewa biasa, jadwal bayar, aturan unit, serah terima." },
  { name: "Kontrak RTO", who: "Penyewa", when: "Setelah lolos Gerbang RTO", what: "Sewa program, saldo DP, laporan bulanan, aturan mundur." },
  { name: "MoU Rumah Tujuan", who: "Penyewa, developer mitra, barumahID", when: "Saat memilih rumah tujuan", what: "Unit, harga terkunci, jadwal konversi." },
  { name: "MoU Mitra Penyedia", who: "Pemilik kos dan rumah sewa", when: "Sebelum unit tayang", what: "Harga yang disepakati, jadwal setor, standar unit." },
  { name: "MoU Developer", who: "Developer mitra", when: "Sebelum rumah tayang", what: "Penguncian harga, alokasi unit, imbal jasa saat akad." },
  { name: "NDA", who: "Developer, penyedia, dan tim", when: "Sebelum data dibuka", what: "Data calon pembeli dan penyewa, harga khusus program." },
];

export interface DpChannel {
  name: string;
  body: string;
  status: "inti" | "segera";
}

// Channel percepatan DP sesuai PRD v3.2. Hanya Sewa Core yang jadi inti program. Nama layanan ekosistem memakai merek
// Kosanesia (arahan user Okt 2026: jasa titip dan pindahan digabung jadi Kosanesia Angkut).
export const DP_CHANNELS: DpChannel[] = [
  { name: "Sewa Core", body: "25% dari sewa program jadi saldo DP.", status: "inti" },
  { name: "Kosanesia Laundry", body: "Cuci di laundry mitra, cashback masuk saldo DP.", status: "segera" },
  { name: "Kosanesia Angkut", body: "Jasa titip barang dan pindahan kos, cashback masuk saldo DP.", status: "segera" },
  { name: "Kosanesia GreenPoint", body: "Pilah sampah rutin, poinnya jadi tambahan DP.", status: "segera" },
];

/** Perkiraan tambahan saldo per bulan dari channel percepatan, angka simulasi PRD v3.2 (belum berjalan) */
export const DP_BOOST = [
  { id: "laundry", label: "Kosanesia Laundry (±30 kg)", value: 21_000 },
  { id: "sampah", label: "Kosanesia GreenPoint (±20 kg)", value: 24_000 },
  { id: "titip", label: "Kosanesia Angkut", value: 15_000 },
];
export const DP_BOOST_TOTAL = DP_BOOST.reduce((s, c) => s + c.value, 0);

export const FUND_SAFETY = [
  { title: "Rekening terpisah", body: "Dana titipan atas namamu, tidak dicampur kas perusahaan." },
  { title: "Tercatat tiap bulan", body: "Setiap setoran tampil di dashboard, laporannya dikirim tiap bulan." },
  { title: "Perjanjian tertulis", body: "Hak, kewajiban, dan aturan mundur ada di Kontrak RTO." },
];

/** Kenapa menabung DP lewat barumahID, bukan sendiri di bank (pertanyaan user Okt 2026) */
export const WHY_RTO = [
  { title: "Harga rumah dikunci", body: "Tabungan bank tidak bisa mengunci harga rumah. Di sini harganya tertulis di MoU sampai konversi." },
  { title: "Jalan untuk yang belum bankable", body: "Riwayat sewa dan Skor Siap Punya Rumah jadi bukti kelayakan saat KPR. Berkasnya kami dampingi." },
  { title: "Disiplin otomatis", body: "Setoran DP satu tagihan dengan sewa. Tidak terpakai untuk hal lain." },
  { title: "Rumah yang sudah dicek", body: "Developer dan legalitas rumah dicek tim sebelum tayang." },
];

const EX = PRICE_EXAMPLE_RENT;

export const RTO_FAQ = [
  {
    question: "Apakah program RTO sudah berjalan?",
    answer: "Belum. Program pertama sedang disiapkan bersama mitra. Daftar sekarang untuk dapat kabar pertama.",
  },
  {
    question: "Kenapa nabung DP di barumahID, bukan di bank?",
    answer:
      "Di bank kamu menabung sendiri, sementara harga rumah terus naik. Di sini harga rumah tujuan dikunci di MoU, setoran DP satu tagihan dengan sewa, dan riwayat sewamu jadi bukti kelayakan KPR. Dananya di rekening terpisah atas namamu. Sudah siap KPR? Langsung lewat Rumah Beli.",
  },
  {
    question: "Berapa lama sampai saldo jadi DP?",
    answer: `${CONV_MIN}-${CONV_MAX} tahun setelah RTO terbuka, sesuai MoU. Contoh: sewa biasa Rp2 juta, setelah ${RTO_CONVERT_YEARS.default} tahun saldo sekitar ${juta(saldoAfter(2_000_000, RTO_CONVERT_YEARS.default))}, cukup untuk DP 10% rumah sampai ${juta(maxHomePrice(saldoAfter(2_000_000, RTO_CONVERT_YEARS.default), 10))}.`,
  },
  {
    question: "Apakah harga rumah bisa naik selama saya menabung?",
    answer: "Tidak. Harga rumah tujuan dikunci di MoU sampai konversi. Developer mitra sudah memperhitungkan masa tunggunya.",
  },
  {
    question: "Kenapa sewa program lebih tinggi dari sewa biasa?",
    answer: `Selisihnya setoran DP, dan itu uangmu. Contoh: sewa biasa ${rpFull(EX)}, sewa program ${rpFull(programRent(EX))}, ${rpFull(dpPerMonth(EX))} tercatat jadi saldo DP. Tidak ada biaya tambahan lain.`,
  },
  {
    question: "Bagaimana kalau saya mundur sebelum konversi?",
    answer:
      "Setoranmu kembali, dipotong biaya administrasi sesuai Kontrak RTO. Bonus dan harga terkunci hangus, rumah tujuan dilepas. Kalau KPR ditolak bukan karena kelalaianmu, saldo kembali penuh.",
  },
  {
    question: "Kalau saldo belum cukup saat konversi?",
    answer: `Tambah dari tabungan, perpanjang sampai ${CONV_MAX} tahun, atau pilih rumah yang lebih pas. Dihitung bersama tim sebelum MoU.`,
  },
  {
    question: "Saldo DP saya untuk rumah yang mana?",
    answer: "Rumah tujuan dari developer mitra, atau modal bangun di lahanmu (Rumah Bangun). Bukan untuk kos yang sedang kamu tempati.",
  },
  {
    question: "Di kota mana program ini dibuka?",
    answer: "Mulai dari Padang. Jambi, Palembang, dan Pekanbaru menyusul bertahap, mengikuti unit mitra di tiap kota.",
  },
];

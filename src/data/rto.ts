// Konten program Rent-to-Own. Aturan wajib (PRD Produk v3.2 dan PRD Website v1):
// - Program masih tahap persiapan. Jangan tulis seolah sudah ada transaksi berjalan.
// - Siap Beli BUKAN sewa-beli sampai legal opinion Option Buy selesai. Tulis sebagai unit dijual + simulasi KPR.
// - Jangan sebut nama BTN atau bank lain sebelum ada kerja sama tertulis.
// - Saldo DP disebut "dana titipan" atau "uang jaminan kepemilikan", bukan "simpanan" (saran Legal Kit).

export const RTO_RATE = 0.25;

// Keputusan user Okt 2026 (angka di PRD v3.2 dan Legal Kit sempat berbeda, ini yang dipakai):
// - Saldo DP baru dicatat setelah RTO terbuka dan Kontrak RTO ditandatangani (Level 3).
// - RTO terbuka setelah KTP terverifikasi, 6 bulan sewa tepat waktu di unit mitra, dan Skor Siap Punya Rumah >= 36.
// - Model dua harga, semuanya terbuka (keputusan user Okt 2026, "model yang paling aman"):
//   harga deal = hasil nego dengan penyedia kos, pemilik selalu menerima ini penuh;
//   sewa biasa = harga deal + biaya layanan barumahID 9% (harga yang tampil di listing, dibayar 6 bulan pertama dan
//   oleh penyewa yang tidak ikut RTO);
//   sewa program = sewa biasa + setoran DP, dibayar setelah RTO terbuka. 25% dari sewa program jadi saldo DP, jadi
//   setoran DP = sepertiga sewa biasa. Fungsi database mencatat 25% dari pembayaran setelah Kontrak RTO, jadi tim
//   mencatat sewa peserta RTO dengan harga sewa program.
// - Harga rumah tujuan DIKUNCI di MoU sejak awal sampai konversi. Ini keunggulan utama RTO: developer mitra sudah
//   memperhitungkan masa tunggunya, penyewa aman karena harga tidak naik.
// - Pengembalian saldo DP: TIDAK ditahan. Saldo sepenuhnya hak penyewa, bisa ditarik 100% kapan saja (keputusan user
//   Okt 2026, menggantikan potongan 70/80/90% dari PRD). 105% kalau barumahID wanprestasi tetap berlaku (REFUND_POLICY).
export const RTO_UNLOCK_MONTHS = 6;
export const RTO_UNLOCK_SCORE = 36;
export const RTO_PROGRAM_FEE = 0.09;

const round1k = (n: number) => Math.round(n / 1_000) * 1_000;
/** Sewa biasa (yang tampil di listing) dari harga deal dengan pemilik: ditambah biaya layanan barumahID */
export const regularRent = (deal: number) => round1k(deal * (1 + RTO_PROGRAM_FEE));
/** Harga deal yang diterima pemilik dari sewa biasa */
export const ownerDeal = (rent: number) => round1k(rent / (1 + RTO_PROGRAM_FEE));
/** Sewa program RTO = sewa biasa + setoran DP, supaya 25% dari sewa program jadi saldo DP */
export const programRent = (rent: number) => round1k(rent / (1 - RTO_RATE));
/** Setoran DP per bulan = 25% dari sewa program = selisih sewa program dan sewa biasa */
export const dpPerMonth = (rent: number) => programRent(rent) - rent;
/** Contoh pembagian yang ditampilkan terbuka di halaman RTO: harga deal dengan pemilik Rp1,8 juta */
export const PRICE_EXAMPLE_DEAL = 1_800_000;

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
    name: "Siap Berdaya",
    explainer: "Sewa kos sambil menabung DP",
    forWho: "Untuk kamu yang belum punya DP dan ingin mulai dari sewa.",
    how: `Tinggal di kos atau rumah sewa mitra dengan sewa biasa. Setelah syarat terpenuhi, RTO terbuka: kamu memilih rumah dari developer mitra lewat MoU, harganya dikunci, dan mulai bayar sewa program (sewa biasa + setoran DP). 25% dari sewa program jadi saldo DP, lalu setelah ${CONV_MIN} sampai ${CONV_MAX} tahun dikonversi jadi DP rumah itu. Bukan untuk unit yang kamu sewa.`,
    status: "Inti program",
  },
  {
    id: "siap-bangun",
    name: "Siap Bangun",
    explainer: "Punya lahan, siap membangun",
    forWho: "Untuk kamu yang sudah punya lahan atau aset, tapi modal bangun belum cukup.",
    how: `Selama sewa kos atau ngontrak di unit mitra, kamu ikut program RTO. Setelah ${CONV_MIN} sampai ${CONV_MAX} tahun, saldo DP jadi modal awal. Begitu modal mencapai 25% dari RAB (boleh ditambah tabunganmu), barumahID atau developer mitra mulai membangun di lahanmu.`,
    status: "Inti program",
  },
  {
    id: "siap-beli",
    name: "Siap Beli",
    explainer: "Properti dijual, kami pertemukan pembeli dan penjual",
    forWho: "Untuk pemilik yang ingin menjual propertinya dan pembeli yang mencari rumah siap huni.",
    how: "Pemilik mengiklankan properti lewat barumahID. Kami cek, tayangkan, lalu menghubungkan pembeli dan penjual, termasuk bantu hitung DP dan KPR. Jalur ini listing jual beli, di luar program RTO.",
    status: "Jual beli",
  },
];

/** Langkah singkat per jalur, tampil di platform listing halaman RTO (Siap Berdaya memakai RTO_STEPS) */
export const PATH_STEPS: Record<Exclude<RtoCategory, "siap-berdaya">, { title: string; body: string }[]> = {
  "siap-bangun": [
    { title: "Sewa di unit mitra", body: `Ngekos atau ngontrak di unit mitra sambil memenuhi syarat RTO: ${RTO_UNLOCK_MONTHS} bulan tepat waktu dan skor minimal ${RTO_UNLOCK_SCORE}.` },
    { title: "Ceritakan lahan atau asetmu", body: "Tim survei lokasi, lalu desain dan RAB disusun bersama Jururancang, partner desain barumahID." },
    { title: `Saldo ${CONV_MIN}-${CONV_MAX} tahun jadi modal`, body: "Bayar sewa program, 25%-nya terkumpul jadi saldo DP. Saat konversi, saldo ditambah tabunganmu sampai 25% dari RAB." },
    { title: "Pembangunan dimulai", body: "barumahID atau developer mitra membangun di lahanmu. Sisanya dibayar bertahap, atau mulai dari tahap pertama yang lebih kecil." },
  ],
  "siap-beli": [
    { title: "Pemilik pasang iklan", body: "Pemilik atau developer mendaftarkan properti yang ingin dijual." },
    { title: "Dicek dan ditayangkan", body: "Tim mengecek data dan foto sebelum properti tayang." },
    { title: "Pembeli ajukan minat", body: "Pembeli survei, lalu hitung DP, cicilan, BPHTB, dan biaya notaris bersama tim." },
    { title: "Kami pertemukan", body: "barumahID menghubungkan pembeli dan penjual sampai akad. Keputusan KPR tetap ada di bank." },
  ],
};

export const RTO_STEPS = [
  {
    title: "Ngekos di unit mitra",
    body: `${RTO_UNLOCK_MONTHS} bulan pertama bayar sewa biasa. KTP terverifikasi, bayar tepat waktu, dan Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE}. Kami kabari begitu syaratnya terpenuhi.`,
  },
  {
    title: "Buka RTO, pilih rumah tujuan",
    body: "Risiko dan aturan pengembalian dijelaskan dulu. Kamu pilih rumah dari developer mitra, lalu Kontrak RTO dan MoU ditandatangani di awal. Harga rumahnya dikunci sampai konversi.",
  },
  {
    title: "Sewa program, 25% jadi DP",
    body: `Selama ${CONV_MIN} sampai ${CONV_MAX} tahun kamu bayar sewa program: sewa biasa + setoran DP. 25%-nya tercatat atas namamu tiap bulan, untuk rumah tujuan, bukan kos yang kamu sewa.`,
  },
  {
    title: "Konversi jadi DP, lanjut KPR",
    body: "Sesuai jadwal di MoU, saldo dikonversi jadi DP rumah tujuan. Lalu PPJB dan akad KPR, didampingi tim.",
  },
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
    unlocks: ["Saldo dikonversi jadi DP, lanjut PPJB dan KPR", "Atau mulai bangun di lahanmu (Siap Bangun)"],
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
  { range: "0–35", title: "Belum siap", body: "Kami bantu dulu lewat edukasi keuangan. Kamu tetap bisa sewa biasa." },
  { range: "36–75", title: "Siap Berdaya atau Siap Bangun", body: "Siap Bangun kalau punya lahan, Siap Berdaya kalau belum." },
  { range: "76–100", title: "Siap Beli", body: "Penghasilan sudah kuat, tinggal menyiapkan transaksi. Jalur ini segera dibuka." },
];

// ---- Peran di platform ----

export interface RtoRole {
  id: "penyewa" | "penyedia" | "developer";
  name: string;
  tagline: string;
  gets: string[];
  form: { code: "F11" | "F14" | "F16"; label: string };
}

export const RTO_ROLES: RtoRole[] = [
  {
    id: "penyewa",
    name: "Penyewa",
    tagline: "Sewa dulu, naik level, lalu buka RTO.",
    gets: ["Unit yang sudah dicek tim", "Dashboard level dan saldo DP", "Laporan saldo setiap bulan"],
    form: { code: "F11", label: "Daftar calon penyewa" },
  },
  {
    id: "penyedia",
    name: "Penyedia kos dan rumah sewa",
    tagline: "Kamar terisi penyewa terverifikasi yang betah lama.",
    gets: ["Listing gratis, tanpa biaya awal", "Terima harga yang disepakati, penuh", "Laporan unit dan penyewa"],
    form: { code: "F14", label: "Daftarkan properti" },
  },
  {
    id: "developer",
    name: "Developer mitra",
    tagline: "Calon pembeli dengan DP yang sudah terkumpul.",
    gets: ["Pipeline pembeli tervalidasi", "MoU dan jadwal konversi per pembeli", "Tanpa biaya pemasaran di depan"],
    form: { code: "F16", label: "Daftar developer mitra" },
  },
];

// Formulir publik RTO (Google Form resmi, link di google-forms.ts). F12 (skoring) dan F17 (lanjutan developer)
// diisi tim saat wawancara, jadi tidak ditampilkan. F15 dan F18 (feedback mitra) ada di halaman Kemitraan.
export const RTO_FORMS: { code: "F11" | "F13" | "F14" | "F16"; who: string; title: string; body: string }[] = [
  { code: "F11", who: "Calon penyewa", title: "Pendaftaran Calon Penyewa", body: "Data diri, hunian sekarang, kesiapan, dan unit yang kamu cari." },
  { code: "F14", who: "Pemilik kos", title: "Pendaftaran Penyedia Kos dan Rumah Sewa", body: "Daftarkan kamar atau rumah sewamu. Listing gratis, tanpa biaya awal." },
  { code: "F16", who: "Developer", title: "Pendaftaran Developer Mitra", body: "Data perusahaan, proyek, kisaran harga, dan unit yang siap dijual." },
  { code: "F13", who: "Peserta aktif", title: "Feedback Peserta RTO", body: "Untuk peserta yang sudah 3 bulan di program. Masukanmu bikin program makin baik." },
];

// ---- Panduan per peran (diringkas dari SOP RTO/01-15, QC/01, FIN/01, CS/01) ----

export interface GuideStep {
  title: string;
  body: string;
}

export const GUIDES: Record<RtoRole["id"], { intro: string; steps: GuideStep[]; notes: string[] }> = {
  penyewa: {
    intro: "Dari daftar sampai akad. Setiap tahap tercatat di dashboard akunmu.",
    steps: [
      { title: "Daftar dan isi profil", body: "Buat akun, lalu isi formulir calon penyewa (F11). Tim menghubungimu dalam 1×24 jam kerja." },
      { title: "Verifikasi", body: "Unggah KTP. Setelah dicek, kamu bisa jadwalkan survei unit dan memilih kamar atau rumah." },
      {
        title: "Check-in",
        body: "Tanda tangan Perjanjian Sewa dan Berita Acara Serah Terima. Kondisi unit difoto bersama, minimal 8 foto.",
      },
      {
        title: "Bayar sewa tiap bulan",
        body: "Pengingat dikirim 3 hari sebelum jatuh tempo. Untuk tahap awal, transfer ke rekening resmi perusahaan lalu unggah bukti bayar.",
      },
      {
        title: `Buka RTO setelah ${RTO_UNLOCK_MONTHS} bulan`,
        body: `Bayar tepat waktu ${RTO_UNLOCK_MONTHS} bulan berturut-turut, isi asesmen, dan capai skor minimal ${RTO_UNLOCK_SCORE}. Lalu ajukan RTO dari dashboard.`,
      },
      {
        title: "Kontrak RTO",
        body: "Mulai bulan pertama program, kamu bayar sewa program (sewa biasa + setoran DP). 25%-nya dicatat jadi saldo DP, laporannya dikirim di awal bulan berikutnya.",
      },
      {
        title: "Pilih rumah dan MoU",
        body: "Pilih rumah dari developer mitra, bukan unit yang kamu sewa. MoU ditandatangani di awal, dan harga rumahnya dikunci sampai konversi.",
      },
      {
        title: "Konversi dan akad",
        body: `Setelah ${CONV_MIN} sampai ${CONV_MAX} tahun sesuai MoU, saldo dikonversi jadi DP. Lanjut PPJB dan KPR, atau mulai bangun (Siap Bangun).`,
      },
    ],
    notes: [
      "Sewa biasa = harga yang disepakati dengan pemilik + biaya layanan barumahID 9%. Sewa program = sewa biasa + setoran DP. Semua angkanya tertulis di kontrak sebelum kamu tanda tangan.",
      "barumahID tidak menjamin persetujuan KPR. Keputusan tetap ada di bank.",
      "Kalau terlambat bayar, tim menghubungimu dulu untuk mencari jalan keluar, misalnya cicil atau perpanjangan tenggat.",
    ],
  },
  penyedia: {
    intro: "Daftarkan unit, kami cek, lalu kami carikan penyewa yang sudah terverifikasi.",
    steps: [
      { title: "Isi formulir penyedia (F14)", body: "Data pemilik, jenis properti, jumlah kamar, harga sewa, dan fasilitas. Tim menghubungimu dalam 1×24 jam kerja." },
      {
        title: "Penetapan harga",
        body: "Harga dibandingkan dengan 3 sampai 5 unit sejenis di sekitarnya, lalu dinegosiasikan dan disepakati bersama. Kamu menerima harga ini penuh.",
      },
      {
        title: "Inspeksi unit",
        body: "Paling lambat 5 hari setelah daftar. Dicek struktur, air dan listrik, kamar mandi, dan keamanan. Hasilnya Layak, Layak dengan Catatan, atau Tidak Layak.",
      },
      { title: "MoU Mitra Penyedia", body: "Tanda tangan MoU. Listing gratis, kamu tetap pemilik penuh unitmu." },
      { title: "Unit tayang", body: "Unit masuk listing barumahID dan kami tawarkan ke calon penyewa yang sudah diverifikasi." },
      { title: "Penyewa masuk", body: "Check-in didampingi tim, dengan Berita Acara Serah Terima. Laporan unit dikirim setiap bulan." },
    ],
    notes: [
      "Kamu menerima harga yang disepakati saat negosiasi, penuh, baik penyewanya ikut RTO atau tidak. Biaya layanan barumahID 9% dan setoran DP dibayar penyewa di atas harga itu.",
      "Ikut program RTO itu pilihan. Kalau bersedia, dibuat addendum khusus.",
      "Harga sewa tidak diubah sepihak selama kontrak penyewa berjalan.",
    ],
  },
  developer: {
    intro: "Terima calon pembeli dengan DP yang terkumpul dan riwayat bayar yang tercatat.",
    steps: [
      { title: "Isi formulir developer (F16)", body: "Data perusahaan, proyek, kisaran harga, dan unit yang siap. Tim menghubungimu dalam 3 hari kerja." },
      { title: "Pertemuan dan due diligence", body: "Kami pelajari proyek dan legalitasnya, lalu membahas alokasi unit untuk program." },
      { title: "NDA dan MoU Developer", body: "NDA ditandatangani sebelum data calon pembeli dibuka. MoU mengatur harga, jadwal konversi, dan fee konversi." },
      { title: "Unit masuk katalog", body: "Peserta yang RTO-nya sudah terbuka bisa memilih unit dari katalog sebagai rumah tujuan." },
      {
        title: "MoU dan harga terkunci",
        body: `MoU tiga pihak (developer, peserta, barumahID) di awal: unit, harga yang dikunci sampai konversi, dan jadwal konversi ${CONV_MIN} sampai ${CONV_MAX} tahun.`,
      },
      { title: "Konversi", body: "Sesuai jadwal, saldo peserta dicairkan sebagai DP. PPJB dan KPR menyusul. Fee konversi dibayar setelah transaksi selesai." },
    ],
    notes: [
      "Calon pembeli yang dikirim sudah melalui verifikasi dan profil kelayakan tim barumahID.",
      `Harga di MoU tidak berubah sampai konversi. Perhitungkan masa tunggu ${CONV_MIN} sampai ${CONV_MAX} tahun saat menentukan harga unit untuk program.`,
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

export const REFUND_POLICY = [
  { when: "Mundur kapan saja, di bulan berapa pun", back: "100%" },
  { when: "KPR ditolak bank", back: "100%" },
  { when: "Force majeure atau bencana", back: "100%" },
  { when: "barumahID tidak memenuhi kewajibannya", back: "105%" },
];

// ---- Dokumen dan perjanjian ----

export const RTO_DOCUMENTS = [
  { name: "Syarat dan Ketentuan Platform", who: "Semua pengguna", when: "Saat membuat akun" },
  { name: "Perjanjian Sewa", who: "Penyewa", when: "Saat check-in, bersama Berita Acara Serah Terima" },
  { name: "Kontrak RTO", who: "Peserta RTO", when: "Setelah lolos Gerbang RTO" },
  { name: "MoU Mitra Penyedia", who: "Pemilik kos dan rumah sewa", when: "Setelah inspeksi lolos, sebelum unit tayang" },
  { name: "MoU Developer", who: "Developer mitra", when: "Sebelum menerima calon pembeli" },
  { name: "NDA (perjanjian kerahasiaan)", who: "Developer, mitra, dan tim yang melihat data penyewa", when: "Sebelum akses data dibuka" },
];

export interface DpChannel {
  name: string;
  body: string;
  status: "inti" | "segera";
}

// Channel percepatan DP sesuai PRD v3.2. Hanya Sewa Core yang jadi inti program.
// Jasa titip dan jasa pindahan digabung jadi satu (arahan user Okt 2026).
export const DP_CHANNELS: DpChannel[] = [
  { name: "Sewa Core", body: "25% dari sewa program jadi saldo DP.", status: "inti" },
  { name: "Kosanesia Laundry", body: "Cuci di laundry mitra, cashback masuk saldo DP.", status: "segera" },
  { name: "Jasa Titip dan Pindahan", body: "Titip barang antarkota atau pindahan, cashback masuk saldo DP.", status: "segera" },
  { name: "GreenPoint", body: "Pilah sampah rutin, poinnya jadi tambahan DP.", status: "segera" },
];

/** Perkiraan tambahan saldo per bulan dari channel percepatan, angka simulasi PRD v3.2 (belum berjalan) */
export const DP_BOOST = [
  { id: "laundry", label: "Laundry di mitra Kosanesia (±30 kg)", value: 21_000 },
  { id: "sampah", label: "Pilah sampah GreenPoint (±20 kg)", value: 24_000 },
  { id: "titip", label: "Jasa titip dan pindahan", value: 15_000 },
];
export const DP_BOOST_TOTAL = DP_BOOST.reduce((s, c) => s + c.value, 0);

export const FUND_SAFETY = [
  {
    title: "Rekening terpisah",
    body: "Saldo DP disimpan sebagai dana titipan di rekening terpisah atas nama perusahaan, tidak dicampur dengan dana operasional.",
  },
  {
    title: "Tercatat di dashboard",
    body: "Setiap pembayaran dan bagian DP-nya tercatat di akunmu. Laporan saldo juga dikirim setiap bulan.",
  },
  {
    title: "Perjanjian tertulis",
    body: "Hak dan kewajiban, termasuk pengembalian saldo kalau kamu mundur, diatur di Kontrak RTO sebelum kamu mulai.",
  },
];

export const RTO_FAQ = [
  {
    question: "Apakah program RTO sudah berjalan?",
    answer:
      "Belum. Program pertama sedang kami siapkan bersama mitra penyedia unit. Daftar sekarang supaya kamu dapat kabar pertama, lengkap dengan syarat dan simulasinya.",
  },
  {
    question: "Apakah harga rumah bisa naik selama saya menabung DP?",
    answer:
      "Tidak. Harga rumah tujuan dikunci di MoU sejak RTO dimulai sampai konversi. Developer mitra sudah memperhitungkan masa tunggunya, jadi kamu tidak dikejar kenaikan harga.",
  },
  {
    question: "Kenapa harus sewa dulu sebelum bisa RTO?",
    answer: `Riwayat bayar ${RTO_UNLOCK_MONTHS} bulan menunjukkan kamu siap berkomitmen. Riwayat ini juga yang nanti membantu saat pengajuan KPR.`,
  },
  {
    question: "Kenapa tidak langsung KPR saja?",
    answer:
      "Banyak pekerja punya penghasilan cukup untuk cicilan, tapi tertahan di DP atau syarat administrasi. Lewat RTO, DP terkumpul dari sewa yang memang kamu bayar setiap bulan.",
  },
  {
    question: "Berapa lama sampai saldo bisa jadi DP?",
    answer: `${CONV_MIN} sampai ${CONV_MAX} tahun setelah RTO terbuka, sesuai jadwal di MoU. Contoh: sewa biasa Rp2 juta per bulan, setelah ${RTO_CONVERT_YEARS.default} tahun saldo DP sekitar ${juta(saldoAfter(2_000_000, RTO_CONVERT_YEARS.default))}. Cukup untuk DP 10% rumah sampai sekitar ${juta(maxHomePrice(saldoAfter(2_000_000, RTO_CONVERT_YEARS.default), 10))}.`,
  },
  {
    question: "Kalau saldo belum cukup saat konversi?",
    answer: `Ada tiga pilihan: tambah dari tabunganmu, perpanjang masa RTO sampai ${CONV_MAX} tahun, atau pilih rumah tujuan yang harganya lebih pas. Semuanya dihitung bersama tim sebelum MoU ditandatangani.`,
  },
  {
    question: "Apakah ada biaya tambahan?",
    answer:
      "Daftar gratis. Sewa biasa sudah termasuk biaya layanan barumahID 9% dari harga yang disepakati dengan pemilik. Setelah RTO terbuka, kamu bayar sewa program: sewa biasa ditambah setoran DP. Setoran itu tetap uangmu, tercatat sebagai saldo DP.",
  },
  {
    question: "Kenapa sewa program lebih tinggi dari sewa biasa?",
    answer: `Selisihnya adalah setoran DP. Contoh: sewa biasa ${rpFull(regularRent(PRICE_EXAMPLE_DEAL))}, sewa program ${rpFull(programRent(regularRent(PRICE_EXAMPLE_DEAL)))}. ${rpFull(dpPerMonth(regularRent(PRICE_EXAMPLE_DEAL)))} (25% dari sewa program) masuk saldo DP atas namamu. Pemilik tetap terima harga yang disepakati, biaya layanan barumahID tidak bertambah.`,
  },
  {
    question: "Bagaimana kalau saya mundur sebelum konversi?",
    answer:
      "Saldo DP itu uangmu, jadi tidak ditahan. Kamu bisa menariknya kembali 100%, tanpa potongan, di bulan berapa pun. Dicairkan paling lambat 14 hari kerja setelah pengajuan, dan rumah tujuan di MoU dilepas.",
  },
  {
    question: "Saldo DP saya untuk rumah yang mana?",
    answer:
      "Untuk uang muka rumah tujuan dari developer mitra RTO, atau modal pembangunan di lahanmu sendiri (Siap Bangun). Bukan untuk kos atau rumah sewa yang sedang kamu tempati.",
  },
  {
    question: "Apa bedanya Siap Beli dengan program RTO?",
    answer:
      "Siap Beli adalah listing properti yang dijual pemiliknya. barumahID mempertemukan pembeli dan penjual, lalu membantu hitung DP dan KPR. Jalur ini tidak memakai saldo DP dari sewa.",
  },
  {
    question: "Di kota mana program ini akan dibuka?",
    answer:
      "Kami mulai dari Padang. Jambi, Palembang, dan Pekanbaru menyusul bertahap, mengikuti ketersediaan unit mitra di tiap kota.",
  },
];

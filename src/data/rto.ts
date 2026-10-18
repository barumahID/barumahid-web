// Konten program Rent-to-Own. Aturan wajib (PRD Produk v3.2 dan PRD Website v1):
// - Program masih tahap persiapan. Jangan tulis seolah sudah ada transaksi berjalan.
// - Siap Beli BUKAN sewa-beli sampai legal opinion Option Buy selesai. Tulis sebagai unit dijual + simulasi KPR.
// - Jangan sebut nama BTN atau bank lain sebelum ada kerja sama tertulis.
// - Saldo DP disebut "dana titipan" atau "uang jaminan kepemilikan", bukan "simpanan" (saran Legal Kit).

export const RTO_RATE = 0.25;

// Keputusan user Okt 2026 (angka di PRD v3.2 dan Legal Kit sempat berbeda, ini yang dipakai):
// - Saldo DP baru dicatat setelah RTO terbuka dan Kontrak RTO ditandatangani (Level 3).
// - RTO terbuka setelah KTP terverifikasi, 6 bulan sewa tepat waktu di unit mitra, dan Skor Siap Punya Rumah >= 36.
// - Biaya program 9% di atas harga sewa mitra (pemilik tetap terima harga yang disepakati).
// - Pengembalian saldo DP: persentase PRD + kasus 100% dan 105% dari Kontrak RTO (REFUND_POLICY).
export const RTO_UNLOCK_MONTHS = 6;
export const RTO_UNLOCK_SCORE = 36;
export const RTO_PROGRAM_FEE = 0.09;

/** Sewa program RTO = harga sewa mitra + biaya program. Saldo DP dicatat dari sewa program yang lunas. */
export const programRent = (rent: number) => Math.round(rent * (1 + RTO_PROGRAM_FEE));
export const dpPerMonth = (rent: number) => Math.round(programRent(rent) * RTO_RATE);

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
    how: "Tinggal di kos atau rumah sewa mitra. Setelah syarat terpenuhi dan RTO terbuka, 25% dari sewa jadi saldo DP untuk rumah tujuan dari developer mitra, bukan untuk unit yang kamu sewa.",
    status: "Inti program",
  },
  {
    id: "siap-bangun",
    name: "Siap Bangun",
    explainer: "Punya lahan, siap membangun",
    forWho: "Untuk kamu yang sudah punya lahan atau aset, tapi modal bangun belum cukup.",
    how: "Selama sewa kos atau ngontrak di unit mitra, kamu ikut program RTO. Saldo DP dari sewa dikumpulkan sampai 25% dari RAB, lalu barumahID atau developer mitra mulai membangun di lahanmu.",
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
    { title: "Saldo DP sampai 25% RAB", body: "Setelah masuk program RTO, 25% sewa terkumpul jadi saldo DP sampai mencapai 25% dari RAB." },
    { title: "Pembangunan dimulai", body: "barumahID atau developer mitra membangun di lahanmu. Sisanya dibayar bertahap." },
  ],
  "siap-beli": [
    { title: "Pemilik pasang iklan", body: "Pemilik atau developer mendaftarkan properti yang ingin dijual." },
    { title: "Dicek dan ditayangkan", body: "Tim mengecek data dan foto sebelum properti tayang." },
    { title: "Pembeli ajukan minat", body: "Pembeli survei, lalu hitung DP, cicilan, BPHTB, dan biaya notaris bersama tim." },
    { title: "Kami pertemukan", body: "barumahID menghubungkan pembeli dan penjual sampai akad. Keputusan KPR tetap ada di bank." },
  ],
};

export const RTO_STEPS = [
  { title: "Ngekos di unit mitra", body: "Pilih kos atau rumah sewa dari penyedia mitra barumahID yang sudah kami cek kondisinya." },
  {
    title: "Penuhi syarat RTO",
    body: `KTP terverifikasi, ${RTO_UNLOCK_MONTHS} bulan bayar tepat waktu, dan Skor Siap Punya Rumah minimal ${RTO_UNLOCK_SCORE}. Kami kabari begitu syaratnya terpenuhi.`,
  },
  {
    title: "Ajukan RTO, 25% jadi DP",
    body: "Risiko dan aturan pengembalian dijelaskan dulu. Setelah Kontrak RTO ditandatangani, 25% sewamu dicatat jadi saldo DP atas namamu.",
  },
  {
    title: "Pilih rumah developer mitra",
    body: "Saldo DP untuk uang muka rumah tujuan dari developer mitra, bukan kos yang kamu sewa. Harga dikunci lewat PPJB, lalu akad KPR.",
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
    unlocks: ["25% sewa dicatat jadi saldo DP", "Laporan saldo DP setiap bulan"],
    stage: "rto",
  },
  {
    id: "l4",
    n: 4,
    name: "Harga Terkunci",
    short: "DP 50%, PPJB",
    missions: ["Pilih unit target dari developer mitra", "Saldo DP mencapai 50% target, lalu PPJB ditandatangani"],
    unlocks: ["Harga unit target tidak berubah lagi", "Dokumen KPR mulai disiapkan"],
    stage: "rto",
  },
  {
    id: "l5",
    n: 5,
    name: "Siap Akad",
    short: "DP 100%, lanjut KPR",
    missions: ["Saldo DP mencapai 100% target"],
    unlocks: ["Pengajuan KPR didampingi", "Atau mulai bangun di lahanmu (Siap Bangun)"],
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
    gets: ["Listing gratis, tanpa biaya awal", "Tetap terima harga sewa yang disepakati", "Laporan unit dan penyewa"],
    form: { code: "F14", label: "Daftarkan properti" },
  },
  {
    id: "developer",
    name: "Developer mitra",
    tagline: "Calon pembeli dengan DP yang sudah terkumpul.",
    gets: ["Pipeline pembeli tervalidasi", "Status price lock dan PPJB per unit", "Tanpa biaya pemasaran di depan"],
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
        body: "Mulai bulan pertama program, 25% sewa dicatat jadi saldo DP. Laporan saldo dikirim di awal bulan berikutnya.",
      },
      { title: "Kunci harga dan akad", body: "Pilih unit target dari developer mitra, bukan unit yang kamu sewa. DP 50% berarti PPJB dan harga terkunci. DP 100% berarti lanjut KPR atau bangun." },
    ],
    notes: [
      "Sewa program sudah termasuk biaya program 9% di atas harga sewa mitra. Angkanya tertulis jelas sebelum kamu tanda tangan.",
      "barumahID tidak menjamin persetujuan KPR. Keputusan tetap ada di bank.",
      "Kalau terlambat bayar, tim menghubungimu dulu untuk mencari jalan keluar, misalnya cicil atau perpanjangan tenggat.",
    ],
  },
  penyedia: {
    intro: "Daftarkan unit, kami cek, lalu kami carikan penyewa yang sudah terverifikasi.",
    steps: [
      { title: "Isi formulir penyedia (F14)", body: "Data pemilik, jenis properti, jumlah kamar, harga sewa, dan fasilitas. Tim menghubungimu dalam 1×24 jam kerja." },
      { title: "Penetapan harga", body: "Harga dibandingkan dengan 3 sampai 5 unit sejenis di sekitarnya, lalu disepakati bersama." },
      {
        title: "Inspeksi unit",
        body: "Paling lambat 5 hari setelah daftar. Dicek struktur, air dan listrik, kamar mandi, dan keamanan. Hasilnya Layak, Layak dengan Catatan, atau Tidak Layak.",
      },
      { title: "MoU Mitra Penyedia", body: "Tanda tangan MoU. Listing gratis, kamu tetap pemilik penuh unitmu." },
      { title: "Unit tayang", body: "Unit masuk listing barumahID dan kami tawarkan ke calon penyewa yang sudah diverifikasi." },
      { title: "Penyewa masuk", body: "Check-in didampingi tim, dengan Berita Acara Serah Terima. Laporan unit dikirim setiap bulan." },
    ],
    notes: [
      "Biaya program 9% dibayar penyewa, bukan kamu. Kamu tetap menerima harga sewa yang disepakati.",
      "Ikut program RTO itu pilihan. Kalau bersedia, dibuat addendum khusus.",
      "Harga sewa tidak diubah sepihak selama kontrak penyewa berjalan.",
    ],
  },
  developer: {
    intro: "Terima calon pembeli dengan DP yang terkumpul dan riwayat bayar yang tercatat.",
    steps: [
      { title: "Isi formulir developer (F16)", body: "Data perusahaan, proyek, kisaran harga, dan unit yang siap. Tim menghubungimu dalam 3 hari kerja." },
      { title: "Pertemuan dan due diligence", body: "Kami pelajari proyek dan legalitasnya, lalu membahas alokasi unit untuk program." },
      { title: "NDA dan MoU Developer", body: "NDA ditandatangani sebelum data calon pembeli dibuka. MoU mengatur price lock dan fee konversi." },
      { title: "Unit masuk katalog", body: "Calon pembeli bisa memilih unit target dan melakukan reservasi awal saat DP mencapai 30% target." },
      { title: "PPJB dan price lock", body: "Saat DP 50% target, PPJB ditandatangani dan harga unit dikunci." },
      { title: "Konversi", body: "Saat DP 100% target, pembeli lanjut KPR. Fee konversi dibayar setelah transaksi selesai." },
    ],
    notes: [
      "Calon pembeli yang dikirim sudah melalui verifikasi dan profil kelayakan tim barumahID.",
      "Kalau unit yang sudah direservasi ditarik sebelum PPJB, developer menyiapkan unit pengganti yang setara.",
      "Kerja sama tidak eksklusif.",
    ],
  },
};

// ---- Aturan dana ----

export const PRICE_LOCK_STAGES = [
  { at: "Masuk program", body: "Pilih unit target dari katalog developer. Reservasi awal, harga belum dikunci." },
  { at: "DP 30%", body: "Tim mulai membahas PPJB dengan developer." },
  { at: "DP 50%", body: "PPJB ditandatangani di notaris. Harga resmi dikunci." },
  { at: "DP 100%", body: "Proses KPR dimulai dengan harga sesuai PPJB." },
];

export const REFUND_POLICY = [
  { when: "Mundur sebelum 6 bulan program", back: "70%" },
  { when: "Mundur di bulan ke-6 sampai 12", back: "80%" },
  { when: "Mundur setelah 12 bulan", back: "90%" },
  { when: "KPR ditolak bank, bukan karena kelalaianmu", back: "100%" },
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

// Lima channel percepatan DP sesuai PRD v3.2. Hanya Sewa Core yang jadi inti program.
export const DP_CHANNELS: DpChannel[] = [
  { name: "Sewa Core", body: "25% dari sewa bulanan jadi saldo DP.", status: "inti" },
  { name: "Kosanesia Laundry", body: "Cuci di laundry mitra, cashback masuk saldo DP.", status: "segera" },
  { name: "Jasa Titip", body: "Titip barang antarkota, cashback masuk saldo DP.", status: "segera" },
  { name: "Jasa Pindahan", body: "Pindahan lebih mudah, cashback masuk saldo DP.", status: "segera" },
  { name: "GreenPoint", body: "Pilah sampah rutin, poinnya jadi tambahan DP.", status: "segera" },
];

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
    question: "Kenapa harus sewa dulu sebelum bisa RTO?",
    answer: `Riwayat bayar ${RTO_UNLOCK_MONTHS} bulan menunjukkan kamu siap berkomitmen. Riwayat ini juga yang nanti membantu saat pengajuan KPR.`,
  },
  {
    question: "Kenapa tidak langsung KPR saja?",
    answer:
      "Banyak pekerja punya penghasilan cukup untuk cicilan, tapi tertahan di DP atau syarat administrasi. Lewat RTO, DP terkumpul dari sewa yang memang kamu bayar setiap bulan.",
  },
  {
    question: "Apakah ada biaya tambahan?",
    answer:
      "Daftar dan sewa biasa tidak ada biaya tambahan. Setelah masuk program RTO, sewa program sudah termasuk biaya program 9% di atas harga sewa mitra, tertulis jelas di kontrak.",
  },
  {
    question: "Bagaimana kalau saya mundur sebelum DP cukup?",
    answer:
      "Saldo DP dikembalikan sesuai lama program: 70% sebelum 6 bulan, 80% di bulan ke-6 sampai 12, 90% setelah 12 bulan. Kalau KPR ditolak bukan karena kelalaianmu, kembali 100%.",
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

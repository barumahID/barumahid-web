// FAQ beranda, maksimal 6 pertanyaan (PRD Website v1, bagian Beranda).
// Jawaban mengikuti guardrail PRD v3.2: RTO masih tahap persiapan, Option Buy belum dibuka.

export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    question: "Apa itu Rent-to-Own di barumahID?",
    answer:
      "Program sewa sambil menabung DP. Kamu ngekos di unit mitra barumahID. Setelah RTO terbuka, kamu memilih rumah dari developer mitra yang harganya dikunci, lalu 25% dari sewa program dicatat sebagai saldo DP atas namamu. Setelah 2 sampai 4 tahun, saldo itu dikonversi jadi DP rumah tersebut. Program ini masih tahap persiapan, jadi daftar minat dulu supaya dapat kabar pertama.",
  },
  {
    question: "Uang DP saya nanti disimpan di mana?",
    answer:
      "Saat program berjalan, saldo DP disimpan di rekening terpisah atas nama perusahaan dan tidak dicampur dengan dana operasional. Laporan saldo dikirim tiap bulan lewat WhatsApp sampai dashboard pelanggan siap. Skema lengkapnya kami umumkan sebelum unit pertama dibuka.",
  },
  {
    question: "Berapa lama sampai DP terkumpul?",
    answer:
      "2 sampai 4 tahun setelah RTO terbuka, sesuai jadwal di MoU. Besar saldonya tergantung sewamu. Harga rumah tujuan dikunci sejak awal, jadi tidak naik selama kamu menabung. Coba simulasi di halaman Rent-to-Own untuk melihat perkiraannya.",
  },
  {
    question: "Berapa biaya jasa gambar dan analisa struktur?",
    answer:
      "Gambar dan modelling mulai Rp15.000 per m², desain dan analisa struktur mulai Rp18.000 per m². Ada paket Basic, Plus, dan Pro. Harga akhir menyesuaikan kerumitan proyek, dan konsultasi pertama gratis.",
  },
  {
    question: "Bagaimana sistem pembayaran renovasi dan bangun?",
    answer:
      "Biaya dihitung per item pekerjaan dengan AHSP (Permen PUPR No. 1 Tahun 2022) dan harga satuan daerah, lalu disepakati dalam RAB sebelum mulai. Pembayaran bertahap mengikuti termin progres yang dicek bersama.",
  },
  {
    question: "Bagaimana cara jadi mitra barumahID?",
    answer:
      "Buka halaman Kemitraan, pilih peranmu (penyedia kos, developer, kontraktor dan mandor, tenaga kerja, supplier, freelancer, atau institusi), lalu isi formulir singkat. Tim kami menghubungi lewat WhatsApp.",
  },
];

/** Testimoni hanya dari form F03 dengan izin tampil. Selama kosong, slider tidak muncul. */
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  service: string;
}

export const TESTIMONIALS: Testimonial[] = [];

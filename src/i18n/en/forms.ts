import { FORMS } from "@/lib/leads";

// Terjemahan Inggris: form (LeadForm), pesan validasi, dan pesan dari /api/leads.
// Hanya teks yang TAMPIL yang diterjemahkan. Nilai pilihan yang dikirim tetap bahasa Indonesia, karena
// dicocokkan dengan kolom dan isian di Google Sheet CRM Master.

// "Maksimal N karakter." dibuat dari maxLength tiap kolom, jadi semua angka yang mungkin ikut didaftarkan
const maxLengths = new Set<number>([200, 1500]);
for (const def of Object.values(FORMS)) for (const f of def.fields) if (f.maxLength) maxLengths.add(f.maxLength);
const maxMessages: Record<string, string> = {};
for (const n of maxLengths) maxMessages[`Maksimal ${n} karakter.`] = `Maximum ${n} characters.`;

export const FORMS_EN: Record<string, string> = {
  ...maxMessages,

  // Komponen form
  Pilih: "Select",
  "Website perusahaan": "Company website",
  "Sembunyikan info tambahan": "Hide extra info",
  "Tambah info (opsional), biar kami lebih cepat bantu": "Add more info (optional) so we can help faster",
  "Saya setuju data ini dipakai barumahID untuk menghubungi saya terkait permintaan ini, sesuai":
    "I agree that barumahID may use this data to contact me about this request, in line with the",
  "Kebijakan Privasi": "Privacy Policy",
  "Centang persetujuan dulu ya.": "Please tick the consent box first.",
  "Supaya datamu tidak hilang, kirim isian ini lewat WhatsApp. Pesannya sudah kami siapkan.":
    "So your details are not lost, send them via WhatsApp. We have prepared the message for you.",
  "Mengirim...": "Sending...",
  "Kolom bertanda * wajib diisi.": "Fields marked * are required.",
  "Data belum berhasil terkirim.": "Your details could not be sent yet.",
  "Koneksi terputus. Data belum terkirim.": "The connection dropped. Your details were not sent.",

  // Validasi (src/lib/leads.ts)
  "Wajib diisi.": "Required.",
  "Nomor WhatsApp belum valid. Contoh: 081234567890.": "This WhatsApp number is not valid yet. Example: 081234567890.",
  "Format email belum valid.": "This email format is not valid yet.",
  "Isi dengan angka.": "Please enter a number.",
  "Link belum valid.": "This link is not valid yet.",
  "Pilih salah satu opsi.": "Please choose one option.",

  // Pesan dari /api/leads
  "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.": "Too many attempts. Please try again in a few minutes.",
  "Format data tidak dikenali.": "The data format was not recognized.",
  "Jenis form tidak dikenali.": "The form type was not recognized.",
  "Persetujuan pemrosesan data wajib dicentang.": "You must tick the data processing consent box.",
  "Ada isian yang perlu diperbaiki.": "Some fields need to be fixed.",
  "Verifikasi anti-spam gagal. Muat ulang halaman lalu coba lagi.": "Anti-spam verification failed. Reload the page and try again.",
  "Form sedang dalam perbaikan. Kirim lewat WhatsApp dulu ya.": "The form is under maintenance. Please send it via WhatsApp for now.",
  "Data belum berhasil disimpan. Kirim lewat WhatsApp dulu ya.": "Your details could not be saved yet. Please send them via WhatsApp for now.",

  // Kolom umum
  "Nama lengkap": "Full name",
  "Nama kamu": "Your name",
  "No. WhatsApp aktif": "Active WhatsApp number",
  "08xxxxxxxxxx": "08xxxxxxxxxx",
  "Email (opsional)": "Email (optional)",
  "nama@email.com": "name@email.com",
  "Kota domisili": "City of residence",
  "Contoh: Padang": "Example: Padang",
  "Catatan (opsional)": "Notes (optional)",
  "Ceritakan hal lain yang perlu kami tahu": "Tell us anything else we should know",
  Instagram: "Instagram",
  TikTok: "TikTok",
  LinkedIn: "LinkedIn",
  "Teman atau keluarga": "Friends or family",
  Event: "Event",
  Google: "Google",
  Lainnya: "Other",

  // Form konsultasi (ConTech)
  "Konsultasi proyek konstruksi": "Construction project consultation",
  "Kirim permintaan konsultasi": "Send consultation request",
  "Permintaan konsultasi terkirim.": "Your consultation request has been sent.",
  "Tim kami membalas lewat WhatsApp di jam kerja, biasanya di hari yang sama.":
    "Our team replies on WhatsApp during working hours, usually the same day.",
  "Lokasi proyek (kota)": "Project location (city)",
  "Layanan yang dibutuhkan": "Service needed",
  Renovasi: "Renovation",
  "Bangun rumah atau bangunan": "Build a house or building",
  "Pendampingan dan manajemen konstruksi": "Construction supervision and management",
  "Belum tahu, mau konsultasi dulu": "Not sure yet, I want to consult first",
  "Jenis bangunan": "Building type",
  "Rumah tinggal": "House",
  "Kos atau kontrakan": "Boarding house or rental",
  "Ruko atau bangunan komersial": "Shophouse or commercial building",
  "Gudang atau industri": "Warehouse or industrial",
  "Masjid, sekolah, atau fasilitas umum": "Mosque, school, or public facility",
  "Infrastruktur (jembatan, saluran, dermaga)": "Infrastructure (bridge, channel, pier)",
  "Perkiraan luas (m²)": "Approximate area (m²)",
  "Contoh: 120": "Example: 120",
  "Kapan mau mulai?": "When do you want to start?",
  Secepatnya: "As soon as possible",
  "1-3 bulan lagi": "In 1-3 months",
  "3-6 bulan lagi": "In 3-6 months",
  "Lebih dari 6 bulan atau belum pasti": "More than 6 months or not sure yet",
  "Perkiraan anggaran": "Approximate budget",
  "Di bawah Rp10 juta": "Under Rp10 million",
  "Rp10-50 juta": "Rp10-50 million",
  "Rp50-200 juta": "Rp50-200 million",
  "Rp200-500 juta": "Rp200-500 million",
  "Di atas Rp500 juta": "Over Rp500 million",
  "Belum tahu": "Not sure yet",
  "Tahu barumahID dari mana?": "How did you hear about barumahID?",
  "Ceritakan proyeknya (opsional)": "Tell us about the project (optional)",
};

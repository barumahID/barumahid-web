import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { ADDRESSES, EMAIL, SITE, WA_ADMIN_1_LABEL } from "@/data/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Cara barumahID dan PT Inditek Bluprim Mahaksa mengumpulkan, memakai, dan melindungi data pribadimu.",
  alternates: { canonical: "/kebijakan-privasi" },
};

// DRAF v1. Wajib dicek konsultan hukum sebelum dianggap final (UU No. 27 Tahun 2022 tentang
// Pelindungan Data Pribadi). Kalau ada perubahan alur data (misalnya pindah ke Supabase), perbarui halaman ini.
const UPDATED = "Oktober 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Siapa kami",
    body: (
      <p>
        Website ini dikelola oleh {SITE.company} (&quot;kami&quot;), pemilik brand {SITE.name}, beralamat di{" "}
        {ADDRESSES.hq.lines.join(", ")}. Kami adalah pengendali data pribadi yang kamu kirim lewat website ini.
      </p>
    ),
  },
  {
    title: "Data yang kami kumpulkan",
    body: (
      <ul>
        <li>Data yang kamu isi di formulir: nama, nomor WhatsApp, email, kota, dan isian lain sesuai formulir.</li>
        <li>
          Untuk program Rent-to-Own: pekerjaan, kisaran penghasilan, besar sewa sekarang, dan rencana hunian. Data ini
          kami pakai untuk menilai kecocokan program, bukan untuk keputusan kredit.
        </li>
        <li>Untuk mitra: data usaha, keahlian, properti, atau institusi yang kamu daftarkan.</li>
        <li>Data teknis terbatas untuk keamanan, misalnya alamat IP saat mengirim formulir, untuk mencegah spam.</li>
      </ul>
    ),
  },
  {
    title: "Untuk apa data dipakai",
    body: (
      <ul>
        <li>Menghubungimu soal permintaan atau pendaftaran yang kamu kirim.</li>
        <li>Menyiapkan penawaran, simulasi, atau jadwal survei.</li>
        <li>Mengelola kemitraan dan proyek yang sedang berjalan.</li>
        <li>Menjaga keamanan website dan mencegah penyalahgunaan.</li>
      </ul>
    ),
  },
  {
    title: "Dasar pemrosesan",
    body: (
      <p>
        Kami memproses data berdasarkan persetujuanmu saat mencentang kotak persetujuan di formulir, dan untuk
        menjalankan permintaan yang kamu ajukan. Kamu bisa menarik persetujuan kapan saja lewat kontak di bawah.
      </p>
    ),
  },
  {
    title: "Di mana data disimpan dan siapa yang bisa mengakses",
    body: (
      <>
        <p>
          Data formulir disimpan di Google Sheets milik perusahaan dan hanya bisa dibuka tim barumahID yang bertugas.
          Website berjalan di Vercel, dan anti-spam memakai layanan Cloudflare bila diaktifkan.
        </p>
        <p>
          Kami tidak menjual data pribadimu. Data hanya dibagikan ke mitra bila diperlukan untuk layanan yang kamu minta,
          misalnya ke Jururancang Engineering Mahaksa untuk jasa gambar dan struktur, atau bila diwajibkan hukum.
        </p>
      </>
    ),
  },
  {
    title: "Berapa lama data disimpan",
    body: (
      <p>
        Selama hubungan kerja atau program berjalan. Untuk permintaan yang tidak berlanjut, data kami hapus paling lama
        2 tahun sejak kontak terakhir, kecuali ada kewajiban hukum untuk menyimpannya lebih lama.
      </p>
    ),
  },
  {
    title: "Hakmu",
    body: (
      <>
        <p>Sesuai Undang-Undang Pelindungan Data Pribadi, kamu berhak:</p>
        <ul>
          <li>meminta salinan data pribadimu yang kami simpan,</li>
          <li>memperbaiki data yang salah atau tidak lengkap,</li>
          <li>meminta data dihapus atau pemrosesannya dihentikan,</li>
          <li>menarik persetujuan yang sudah diberikan.</li>
        </ul>
        <p>
          Kirim permintaan ke {EMAIL} atau WhatsApp {WA_ADMIN_1_LABEL}. Kami konfirmasi penerimaan permintaanmu paling lambat 3
          hari kerja.
        </p>
      </>
    ),
  },
  {
    title: "Cookie dan analitik",
    body: (
      <p>
        Saat ini website tidak memakai cookie iklan. Kalau nanti kami memakai alat analitik untuk mengukur kunjungan,
        halaman ini akan diperbarui lebih dulu.
      </p>
    ),
  },
  {
    title: "Usia pengguna",
    body: <p>Layanan kami ditujukan untuk pengguna berusia 18 tahun ke atas.</p>,
  },
  {
    title: "Perubahan kebijakan",
    body: <p>Kebijakan ini bisa diperbarui. Tanggal pembaruan terakhir selalu tercantum di bagian atas halaman.</p>,
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      <PageHero
        label="Kebijakan privasi"
        title="Data pribadimu, kami jaga."
        subtitle={<p>Diperbarui {UPDATED}. Ringkasnya: data dipakai untuk menghubungimu, tidak dijual, dan bisa kamu minta hapus.</p>}
        size="sm"
      />
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-20">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.title}>
                <h2 className="text-[20px] font-extrabold text-brand-dark">
                  {i + 1}. {s.title}
                </h2>
                <div className="prose-legal mt-3 space-y-3 text-[15.5px] leading-[1.75] text-brand-dark/80 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

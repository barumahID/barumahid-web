import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Link from "@/i18n/Link";
import { EMAIL, SITE, WA_ADMIN_1_LABEL } from "@/data/site";
import { REFUND_POLICY, RTO_PROGRAM_FEE, RTO_RATE, RTO_UNLOCK_MONTHS, RTO_UNLOCK_SCORE } from "@/data/rto";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description: "Syarat dan ketentuan penggunaan website dan Portal barumahID, termasuk akun penyewa program Rent-to-Own.",
  alternates: { canonical: "/syarat-ketentuan" },
};

// DRAF v1, disusun dari Legal Kit barumahID (Dokumen 11, Syarat dan Ketentuan Platform). Wajib dicek konsultan hukum
// sebelum dianggap final. Versi ini yang dicatat saat pengguna membuat akun (rto_agreements, versi "v1").
// Kalau isi berubah secara berarti, naikkan versi dan minta persetujuan ulang di dashboard.
const UPDATED = "Oktober 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Tentang barumahID",
    body: (
      <p>
        {SITE.name} adalah platform Jasa Konstruksi dan Rent-to-Own yang dikelola oleh {SITE.company} (&quot;kami&quot;). Platform ini
        menghubungkan pemilik properti, calon penyewa, developer, dan mitra konstruksi dalam ekosistem kepemilikan hunian.
      </p>
    ),
  },
  {
    title: "Penerimaan syarat",
    body: (
      <p>
        Dengan membuat akun, mengisi formulir, atau memakai layanan barumahID, kamu dianggap sudah membaca dan menyetujui syarat ini serta{" "}
        <Link href="/kebijakan-privasi" className="font-semibold text-brand-dark underline underline-offset-2">
          kebijakan privasi
        </Link>
        . Persetujuan saat membuat akun dicatat beserta versi dan waktunya.
      </p>
    ),
  },
  {
    title: "Akun Portal",
    body: (
      <ul>
        <li>Akun dibuat dengan data yang benar dan terkini. Satu orang satu akun.</li>
        <li>Kamu bertanggung jawab menjaga kata sandi. Beri tahu kami segera kalau akunmu dipakai orang lain.</li>
        <li>Peran akun (penyewa, mitra, atau tim) ditentukan barumahID. Akun mitra aktif setelah diverifikasi.</li>
        <li>Kami bisa menangguhkan akun yang memberi data palsu atau menyalahgunakan layanan.</li>
      </ul>
    ),
  },
  {
    title: "Program Rent-to-Own",
    body: (
      <>
        <p>Program masih tahap persiapan. Ketentuan yang mengikat tertulis di Perjanjian Sewa dan Kontrak RTO yang kamu tanda tangani. Ringkasnya:</p>
        <ul>
          <li>
            Pengajuan RTO terbuka setelah KTP terverifikasi, {RTO_UNLOCK_MONTHS} bulan sewa tepat waktu di unit mitra, dan Skor Siap Punya Rumah minimal{" "}
            {RTO_UNLOCK_SCORE}. Persetujuan tetap melalui peninjauan tim.
          </li>
          <li>
            Setelah Kontrak RTO ditandatangani, {Math.round(RTO_RATE * 100)}% dari setiap sewa yang lunas dicatat sebagai saldo DP atas namamu.
          </li>
          <li>
            Saldo DP dipakai untuk uang muka rumah dari developer mitra RTO (jalur Siap Berdaya), atau untuk modal awal pembangunan sampai 25% dari
            RAB (jalur Siap Bangun). Saldo DP tidak dipakai untuk unit kos atau rumah sewa yang sedang kamu tempati.
          </li>
          <li>Sewa program sudah termasuk biaya program {Math.round(RTO_PROGRAM_FEE * 100)}% di atas harga sewa mitra.</li>
          <li>
            Saldo DP adalah dana titipan untuk uang muka kepemilikan, disimpan di rekening terpisah atas nama perusahaan. Saldo ini bukan simpanan
            perbankan dan tidak berbunga.
          </li>
          <li>
            Kalau program berhenti, saldo DP dikembalikan dengan ketentuan berikut:
            <ul className="mt-2 list-[circle] space-y-1 pl-5">
              {REFUND_POLICY.map((r) => (
                <li key={r.when}>
                  {r.when}: {r.back}
                </li>
              ))}
            </ul>
          </li>
          <li>barumahID tidak menjamin persetujuan KPR. Keputusan tetap ada di bank.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Pemilik properti dan developer",
    body: (
      <ul>
        <li>Unit yang didaftarkan wajib sesuai kondisi sebenarnya dan lolos inspeksi sebelum tayang.</li>
        <li>Kerja sama diatur dalam MoU Mitra Penyedia atau MoU Developer. Data calon penyewa dan pembeli hanya dibuka setelah NDA ditandatangani.</li>
        <li>Dilarang menghubungi pengguna barumahID di luar platform untuk melewati program.</li>
        <li>
          Listing Siap Beli adalah iklan jual beli di luar program RTO. barumahID mempertemukan pembeli dan penjual. Harga, dokumen, dan transaksi tetap
          kesepakatan kedua pihak.
        </li>
      </ul>
    ),
  },
  {
    title: "Data pribadi",
    body: (
      <p>
        Data dipakai untuk menjalankan layanan, tidak diperjualbelikan, dan bisa kamu minta salin, perbaiki, atau hapus sesuai Undang-Undang
        Pelindungan Data Pribadi. Rinciannya ada di kebijakan privasi.
      </p>
    ),
  },
  {
    title: "Batasan tanggung jawab",
    body: (
      <ul>
        <li>Informasi harga, ketersediaan unit, dan simulasi di website bersifat perkiraan dan bisa berubah.</li>
        <li>barumahID tidak bertanggung jawab atas sengketa antara pemilik dan penyewa yang terjadi di luar program.</li>
        <li>Gambar konsep gratis dari miniCAD bukan gambar kerja dan tidak untuk dibangun langsung.</li>
      </ul>
    ),
  },
  {
    title: "Hukum yang berlaku",
    body: (
      <p>
        Syarat ini tunduk pada hukum Republik Indonesia. Perselisihan diselesaikan dulu secara musyawarah. Kalau tidak tercapai, melalui Pengadilan
        Negeri yang berwenang.
      </p>
    ),
  },
  {
    title: "Kontak",
    body: (
      <p>
        Pertanyaan soal syarat ini bisa dikirim ke {EMAIL} atau WhatsApp {WA_ADMIN_1_LABEL}.
      </p>
    ),
  },
];

export default function SyaratKetentuanPage() {
  return (
    <>
      <PageHero
        label="Syarat dan ketentuan"
        title="Aturan main yang jelas sejak awal."
        subtitle={<p>Versi 1, diperbarui {UPDATED}. Berlaku untuk website dan Portal barumahID.</p>}
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

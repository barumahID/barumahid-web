# Menunggu konfirmasi

Isi website yang sengaja belum diisi, disembunyikan, atau masih perlu dicek. Jangan mengarang jawabannya. Kalau user sudah menjawab, ubah datanya, lalu hapus barisnya dari daftar ini.

## Konten

| Hal | Kondisi sekarang | File |
|---|---|---|
| Ejaan nama tim, terutama "Hariyanto" atau "Haryanto" | Ditulis "Hariyanto Djalil" | `src/data/company.ts` |
| Jabatan dan bio singkat tiap anggota tim | Draf | `src/data/company.ts` |
| Foto tim | Pakai inisial | `src/data/company.ts` (`photo`) |
| Kota proyek Sumedang | `verified: false`, tidak tampil di peta | `src/data/projects.ts` |
| Lokasi proyek "Bangun rumah 2 lantai" | Dimasukkan ke Padang | `src/data/projects.ts` |
| Beda isi paket Basic dan Plus selain harga dan durasi | Isi paket sama, beda di harga dan lama kerja | `src/data/pricing.ts` |
| Link YouTube dan Facebook | `active: false`, tidak tampil | `src/data/site.ts` |
| Link DM Instagram Jururancang (`ig.me`) | Belum dites di HP | `src/data/site.ts` |
| Testimoni pelanggan | Kosong, menunggu izin tampil dari pemberi testimoni | `src/data/faq.ts` |
| Logo program, event, dan unit grup | Tampil sebagai teks | `src/data/partners.ts` |
| Listing RTO pertama | Kosong, menunggu izin tertulis pemilik dan cek dokumen legal | `src/data/listings.ts` |
| Kebijakan privasi | DRAF v1, perlu review orang hukum | `src/app/kebijakan-privasi/page.tsx` |
| Batch rekrutmen berikutnya | Batch Juli 2026 sudah tutup. Halaman tampil status tutup dan email untuk kirim CV. | `src/app/rekrutmen/page.tsx` (`BATCH`) |

## Teknis

| Hal | Kondisi sekarang | Rujukan |
|---|---|---|
| Apps Script ke CRM Master | Belum di-deploy. Form tetap tersimpan di Supabase. | `docs/backend/README.md` |
| Tempat kerja harian lead: sheet CRM atau Supabase | Belum diputuskan | `docs/backend/README.md` |
| Notifikasi lead baru ke admin | Belum ada. Lead di Supabase tidak mengabari siapa pun. | `docs/backend/README.md` |
| Error `#REF!` di sheet Dashboard CRM Master | Belum diperbaiki | Sheet CRM Master |
| Paket Vercel | Kemungkinan Hobby. Menurut ketentuan Vercel, Hobby untuk penggunaan non-komersial. | Dashboard Vercel > Settings > Billing |

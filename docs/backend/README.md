# Backend form website

Semua form website dikirim ke `POST /api/leads` (`src/app/api/leads/route.ts`). Dari sana data disimpan ke dua tujuan:

| Tujuan | Status | Untuk apa |
|---|---|---|
| Supabase, tabel `public.barumahid_leads` | Utama, sudah jalan | Arsip semua lead. Aman: publishable key hanya boleh INSERT. |
| Google Sheet CRM Master lewat Apps Script | Opsional, belum di-deploy | Baris masuk ke sheet kerja tim (Status, Next Action) dan notifikasi email atau WA ke admin. |

Pengiriman dianggap berhasil kalau minimal satu tujuan menerima data. Kalau dua-duanya gagal, pengunjung melihat tombol "Kirim lewat WhatsApp" berisi isian form yang sudah disiapkan.

## 1. Supabase

Sudah dikonfigurasi. Env di Vercel: `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` (Production, Preview, Development).

Pemetaan peran form ke kolom `jenis`:

| Peran form (`data.form`) | `jenis` |
|---|---|
| `konsultasi`, `customer-rto` | `customer` |
| `penyedia-kos`, `kontraktor`, `tenaga-kerja`, `supplier`, `projectlink`, `knowledges` | `mitra` |
| `developer` | `developer` |
| `pesan` | `kontak` |

Kolom ringkas: `nama` (untuk developer, supplier, knowledges berisi "Nama usaha / PIC"), `kontak` (WA format 62xxx), `kota`, `sumber` (path halaman). Semua isian lengkap ada di `data`, termasuk `judul_form` dan `sheet_crm` (sheet tujuan di CRM Master).

Status lead (`status`): `baru`, `dihubungi`, `selesai`, `tidak_relevan`. Ubah lewat Table Editor.

Catatan: project Supabase gratis bisa di-pause otomatis kalau lama tidak ada aktivitas. Kalau itu terjadi, insert gagal. Itulah alasan jalur Apps Script dan tombol WhatsApp tetap disiapkan.

## 2. Apps Script ke CRM Master (opsional)

Kode: `docs/backend/apps-script-leads.gs`. Skrip mencocokkan nama field dengan judul kolom di baris 1 tiap sheet, lalu menambah satu baris dengan `Status = Baru`. Field yang tidak punya kolom masuk ke kolom Catatan. Sheet `💬 Pesan Website` dibuat otomatis kalau belum ada.

Langkah pasang (sekitar 15 menit, dikerjakan oleh pemilik spreadsheet):

1. Buka spreadsheet **barumahID — CRM Master** dengan akun pemiliknya.
2. Extensions > Apps Script. Hapus isi `Code.gs`, tempel seluruh isi `apps-script-leads.gs`, simpan.
3. Project Settings (ikon gerigi) > Script Properties, tambahkan:
   - `WEBHOOK_SECRET`: string acak panjang, minimal 32 karakter. Simpan, nanti dipakai lagi di Vercel.
   - `NOTIFY_EMAIL`: email admin penerima notifikasi (boleh lebih dari satu, pisahkan koma).
   - `FONNTE_TOKEN` dan `NOTIFY_WA` (opsional): kalau mau notifikasi WhatsApp lewat Fonnte. `NOTIFY_WA` format 628xxx.
4. Jalankan fungsi `testTulis` sekali dari editor. Google akan minta izin akses spreadsheet dan email, setujui. Cek ada baris "Uji Coba" di sheet `💬 Pesan Website` (dibuat otomatis), lalu hapus barisnya.
5. Deploy > New deployment > Type: Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Salin URL Web App (berakhiran `/exec`).
6. Di Vercel, project `barumahid` > Settings > Environment Variables, tambahkan untuk Production dan Preview:
   - `LEADS_WEBHOOK_URL` = URL Web App
   - `LEADS_WEBHOOK_SECRET` = nilai `WEBHOOK_SECRET` dari langkah 3
7. Redeploy. Tes satu form di preview dengan nama "TEST", cek baris masuk di Supabase dan di sheet, lalu hapus dua-duanya.

Kalau kode skrip diubah: Deploy > Manage deployments > Edit > Version: New version. URL tetap sama.

Sebelum dipakai, perbaiki dulu error `#REF!` di sheet Dashboard (hitungan BARU dan AKTIF untuk Leads Konstruksi), supaya angka dashboard benar saat lead mulai masuk.

## Keputusan yang perlu diambil

Dua tempat penyimpanan berarti status lead bisa beda antara Supabase dan sheet. Pilih satu sebagai tempat kerja harian tim:
- **Sheet CRM Master sebagai tempat kerja**, Supabase sebagai arsip. Tim cukup buka satu sheet yang sudah biasa dipakai. Ini yang paling masuk akal selama tim masih kecil.
- **Supabase sebagai tempat kerja**, matikan Apps Script. Perlu cara notifikasi lain, karena sekarang lead di Supabase tidak mengabari siapa pun.

## Anti-spam

- Honeypot `company_website` dan rate limit 6 kiriman per 10 menit per IP sudah aktif.
- Cloudflare Turnstile opsional: isi `NEXT_PUBLIC_TURNSTILE_SITE_KEY` dan `TURNSTILE_SECRET_KEY` di Vercel kalau mulai banyak spam.

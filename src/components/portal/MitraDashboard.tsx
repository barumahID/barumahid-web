import { GFORMS } from "@/data/google-forms";
import { WA_ADMIN_1, waLink } from "@/data/site";
import { CATEGORY_FORMS, CATEGORY_LABEL, CATEGORY_LINE, STATUS_LABEL, STATUS_TONE, isCategory, type Mitra, type Profile } from "@/lib/portal";

// Dashboard mitra: status verifikasi, data mitra yang tercatat (hanya setelah diverifikasi tim), formulir, kontak.

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-brand-dark/[0.07] py-2.5 text-[13.5px] last:border-b-0">
      <dt className="text-brand-gray">{label}</dt>
      <dd className="font-semibold text-brand-dark">{value || "-"}</dd>
    </div>
  );
}

export default function MitraDashboard({ profile, mitra }: { profile: Profile; mitra: Mitra | null }) {
  const category = mitra?.category ?? (isCategory(profile.requested_category) ? profile.requested_category : null);
  const forms = category ? CATEGORY_FORMS[category] : null;
  const verified = mitra && (mitra.status === "terverifikasi" || mitra.status === "aktif");
  const inactive = mitra?.status === "nonaktif";
  const waAdmin = waLink(`Halo Admin barumahID, saya ${profile.full_name ?? ""} (akun Portal Mitra ${profile.email}).`, WA_ADMIN_1);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Dashboard mitra</p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">Halo, {profile.full_name || profile.email}.</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-brand-dark/10 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[16px] font-extrabold">Status kemitraan</h2>
            {mitra ? (
              <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${STATUS_TONE[mitra.status]}`}>{STATUS_LABEL[mitra.status]}</span>
            ) : (
              <span className="rounded-full bg-brand-dark/[0.06] px-3 py-1 text-[12px] font-bold text-brand-gray">Menunggu verifikasi</span>
            )}
          </div>

          {verified && mitra ? (
            <>
              <p className="mt-2 text-[13.5px] leading-relaxed text-brand-gray">Data Anda sudah diverifikasi tim barumahID. Berikut data mitra yang tercatat.</p>
              <dl className="mt-4">
                <Row label="Nama" value={mitra.name} />
                <Row label="Jenis kemitraan" value={CATEGORY_LABEL[mitra.category]} />
                <Row label="Lini bisnis" value={CATEGORY_LINE[mitra.category]} />
                <Row label="Spesialisasi" value={mitra.specialty} />
                <Row label="Nama usaha" value={mitra.company} />
                <Row label="Kota" value={mitra.city} />
                <Row label="Terverifikasi" value={mitra.verified_at ? new Date(mitra.verified_at).toLocaleDateString("id-ID", { dateStyle: "long" }) : null} />
              </dl>
            </>
          ) : inactive ? (
            <p className="mt-3 text-[13.5px] leading-relaxed text-brand-gray">
              Status kemitraan Anda saat ini nonaktif. Hubungi admin barumahID untuk informasi lebih lanjut.
            </p>
          ) : (
            <>
              <p className="mt-2 text-[13.5px] leading-relaxed text-brand-gray">
                Akun Anda sudah dibuat. Dashboard lengkap aktif setelah tim barumahID memverifikasi data Anda.
              </p>
              <ol className="mt-4 border-t border-brand-dark/10">
                {[
                  {
                    title: "Lengkapi formulir pendaftaran",
                    body: forms ? (
                      <a href={GFORMS[forms.register]} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-red underline underline-offset-2">
                        Buka formulir {category ? CATEGORY_LABEL[category] : ""} ({forms.register})
                      </a>
                    ) : (
                      "Pilih formulir sesuai jalur Anda di halaman Kemitraan."
                    ),
                  },
                  { title: "Verifikasi oleh tim barumahID", body: `Kami menghubungi Anda melalui WhatsApp ${profile.phone ?? ""}.` },
                  { title: "Dashboard mitra aktif", body: "Data mitra, status, dan formulir umpan balik tampil di halaman ini." },
                ].map((s, i) => (
                  <li key={s.title} className="flex gap-4 border-b border-brand-dark/10 py-3.5">
                    <span className="pt-0.5 font-mono text-[12px] font-bold text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-[14px] font-bold">{s.title}</span>
                      <span className="mt-0.5 block text-[13px] text-brand-gray">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-brand-dark/10 bg-white p-6">
            <h2 className="text-[16px] font-extrabold">Data akun</h2>
            <dl className="mt-3">
              <Row label="Email" value={profile.email} />
              <Row label="WhatsApp" value={profile.phone} />
              <Row label="Jenis diajukan" value={profile.requested_category ? CATEGORY_LABEL[profile.requested_category] : null} />
            </dl>
          </section>
          <section className="rounded-2xl border border-brand-dark/10 bg-white p-6">
            <h2 className="text-[16px] font-extrabold">Formulir dan kontak</h2>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              {verified && forms?.feedback && (
                <li>
                  <a href={GFORMS[forms.feedback]} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-red">
                    Formulir umpan balik mitra ({forms.feedback}) ↗
                  </a>
                </li>
              )}
              <li>
                <a href={GFORMS.F19} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-red">
                  Kontak &amp; pertanyaan umum (F19) ↗
                </a>
              </li>
              <li>
                <a href={waAdmin} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f9d55] hover:underline">
                  WhatsApp admin barumahID ↗
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

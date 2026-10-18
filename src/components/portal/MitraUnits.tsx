import { UNIT_OWNER_EDITABLE, UNIT_STATUS_LABEL, UNIT_STATUS_TONE, monthLabel, rupiah, type RtoPayment, type RtoTenancy, type RtoUnit } from "@/lib/rto";
import { unitPhotoUrl } from "@/lib/rto-listing";
import { regularRent } from "@/data/rto";
import { DescriptionForm, UnitSubmitForm } from "./RtoForms";
import UnitPhotos from "./UnitPhotos";

// Bagian unit untuk mitra penyedia kos (arahan user Okt 2026: listing kos dengan penyedia dan penyewa).
// Penyedia melihat unitnya, status inspeksi, sewa aktif, dan pembayaran di unitnya. Data penyewa (nama, kontak)
// tidak dibuka di sini; pembayaran ke penyedia mengikuti harga yang disepakati.

const card = "rounded-2xl border border-brand-dark/10 bg-white p-5 md:p-6";
const INSPECTION = { layak: "Layak", layak_catatan: "Layak dengan catatan", tidak_layak: "Tidak layak" } as const;

export default function MitraUnits({ units, tenancies, payments }: { units: RtoUnit[]; tenancies: RtoTenancy[]; payments: RtoPayment[] }) {
  const thisMonth = new Date().toISOString().slice(0, 7) + "-01";
  const paidThisMonth = payments.filter((p) => p.status === "lunas" && p.period === thisMonth);
  const activeByUnit = new Map<string, number>();
  for (const t of tenancies) if (t.status === "aktif" && t.unit_id) activeByUnit.set(t.unit_id, (activeByUnit.get(t.unit_id) ?? 0) + 1);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Unit terdaftar", value: String(units.length) },
          { label: "Unit tayang", value: String(units.filter((u) => u.status === "tayang" || u.status === "penuh").length) },
          { label: `Sewa lunas ${monthLabel(thisMonth)}`, value: String(paidThisMonth.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-brand-cream px-5 py-4">
            <p className="text-[12px] text-brand-gray">{s.label}</p>
            <p className="mt-1 text-[24px] font-black text-brand-dark">{s.value}</p>
          </div>
        ))}
      </div>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Unit Anda</h2>
        {units.length ? (
          <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
            {units.map((u) => (
              <li key={u.id} className="grid gap-1 py-3 md:grid-cols-12 md:items-center md:gap-3">
                <div className="md:col-span-5">
                  <p className="text-[14px] font-bold text-brand-dark">{u.title}</p>
                  <p className="text-[12.5px] text-brand-gray">
                    {u.kind === "kos" ? "Kos" : "Rumah sewa"} · {[u.kelurahan, u.kecamatan, u.city].filter(Boolean).join(", ")}
                  </p>
                </div>
                <p className="text-[13px] font-semibold text-brand-dark md:col-span-2">
                  {rupiah(u.rent_monthly)}/bln
                  <span className="block text-[11.5px] font-normal text-brand-gray">diterima Anda · tampil {rupiah(regularRent(u.rent_monthly))}</span>
                </p>
                <p className="text-[12.5px] text-brand-gray md:col-span-2">{activeByUnit.get(u.id) ?? 0} penyewa aktif</p>
                <div className="flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
                  {u.inspection_result && <span className="text-[12px] text-brand-gray">{INSPECTION[u.inspection_result]}</span>}
                  <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${UNIT_STATUS_TONE[u.status]}`}>{UNIT_STATUS_LABEL[u.status]}</span>
                </div>
                {u.inspection_note && <p className="text-[12.5px] text-brand-gray md:col-span-12">Catatan inspeksi: {u.inspection_note}</p>}
                <details className="md:col-span-12" open={UNIT_OWNER_EDITABLE.includes(u.status) && u.photos.length === 0}>
                  <summary className="cursor-pointer text-[12.5px] font-bold text-brand-dark">
                    Foto dan deskripsi untuk website ({u.photos.length} foto)
                    {(u.status === "tayang" || u.status === "penuh") && (
                      <>
                        {" · "}
                        <a href={`/layanan/rto/${u.slug}`} target="_blank" rel="noopener" className="underline underline-offset-2">
                          Lihat di website
                        </a>
                      </>
                    )}
                  </summary>
                  <div className="mt-3 grid gap-4 lg:grid-cols-2">
                    <UnitPhotos
                      unitId={u.id}
                      editable={UNIT_OWNER_EDITABLE.includes(u.status)}
                      photos={u.photos.flatMap((p) => {
                        const url = unitPhotoUrl(p);
                        return url ? [{ path: p, url }] : [];
                      })}
                    />
                    {UNIT_OWNER_EDITABLE.includes(u.status) ? (
                      <DescriptionForm unit={u} />
                    ) : (
                      <div className="text-[13px] text-brand-gray">
                        <p className="whitespace-pre-line text-brand-dark">{u.description || "Belum ada deskripsi."}</p>
                        <p className="mt-2 text-[12px]">Unit sudah diperiksa. Untuk mengubah foto atau deskripsi, hubungi tim barumahID.</p>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13.5px] text-brand-gray">Belum ada unit. Daftarkan unit pertama Anda di bawah.</p>
        )}
      </section>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Daftarkan unit</h2>
        <p className="mb-4 mt-0.5 text-[12.5px] text-brand-gray">
          Unit diperiksa tim paling lambat 5 hari kerja setelah dikirim. Unit tayang di website setelah inspeksi dan MoU Mitra Penyedia.
        </p>
        <UnitSubmitForm />
      </section>
    </div>
  );
}

import { RTO_CONVERT_YEARS } from "@/data/rto";
import {
  DEV_OWNER_EDITABLE,
  DEV_UNIT_STATUS_LABEL,
  DEV_UNIT_STATUS_TONE,
  RTO_STATUS_LABEL,
  dateLabel,
  earliestConversion,
  rupiah,
  type DevPipelineRow,
  type RtoDevUnit,
} from "@/lib/rto";
import { unitPhotoUrl } from "@/lib/rto-listing";
import { DescriptionForm, DevUnitForm } from "./RtoForms";
import UnitPhotos from "./UnitPhotos";

// Dashboard developer mitra (Portal tahap 3): rumah tujuan yang didaftarkan, status tinjauan, foto dan deskripsi, dan
// pipeline peserta RTO yang memilih rumahnya. Pipeline tanpa identitas (fungsi rto_dev_pipeline): data pribadi calon
// pembeli dibuka lewat tim barumahID setelah NDA.

const card = "rounded-2xl border border-brand-dark/10 bg-white p-5 md:p-6";
const monthYear = (d: Date | null) => (d ? d.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" }) : "-");

export default function DevUnits({ units, pipeline }: { units: RtoDevUnit[]; pipeline: DevPipelineRow[] }) {
  const active = pipeline.filter((p) => p.rto_status === "disetujui");
  const saldo = pipeline.reduce((s, p) => s + Number(p.balance), 0);
  const steps = [
    { t: "Daftarkan rumah", b: "Isi data, harga, dan DP minimal. Tambahkan foto atau render." },
    { t: "Tinjauan dan MoU", b: "Tim mengecek legalitas, lalu NDA dan MoU Developer ditandatangani." },
    { t: "Tayang sebagai rumah tujuan", b: "Peserta RTO bisa memilih rumah Anda dari halaman Rent-to-Own." },
    {
      t: "MoU Rumah Tujuan, harga terkunci",
      b: `Harga dikunci sampai konversi. Setelah ${RTO_CONVERT_YEARS.min} sampai ${RTO_CONVERT_YEARS.max} tahun, saldo peserta jadi DP, lalu PPJB dan KPR.`,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Rumah terdaftar", value: String(units.length) },
          { label: "Rumah tayang", value: String(units.filter((u) => u.status === "tayang").length) },
          { label: "Peserta memilih rumah Anda", value: String(active.length) },
          { label: "Saldo DP calon pembeli", value: rupiah(saldo) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-brand-cream px-5 py-4">
            <p className="text-[12px] text-brand-gray">{s.label}</p>
            <p className="mt-1 text-[22px] font-black text-brand-dark">{s.value}</p>
          </div>
        ))}
      </div>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Alur developer mitra RTO</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-xl border border-brand-dark/10 p-4">
              <span className="font-mono text-[12px] font-bold text-brand-red">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 text-[14px] font-bold">{s.t}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-brand-gray">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Rumah tujuan Anda</h2>
        {units.length ? (
          <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
            {units.map((u) => {
              const editable = DEV_OWNER_EDITABLE.includes(u.status);
              const live = u.status === "tayang" || u.status === "habis";
              const interested = pipeline.filter((p) => p.unit_id === u.id).length;
              return (
                <li key={u.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
                    <span className="min-w-[200px] font-bold text-brand-dark">{u.title}</span>
                    <span className="text-brand-gray">{[u.project, u.kelurahan, u.city].filter(Boolean).join(", ")}</span>
                    <span className="font-semibold text-brand-dark">
                      {rupiah(u.price)} · DP min {u.dp_min_pct}%
                    </span>
                    <span className="text-[12.5px] text-brand-gray">{interested} peserta</span>
                    <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${DEV_UNIT_STATUS_TONE[u.status]}`}>{DEV_UNIT_STATUS_LABEL[u.status]}</span>
                  </div>
                  {u.review_note && <p className="mt-1.5 rounded-lg bg-brand-cream px-3 py-2 text-[12.5px] text-brand-dark">Catatan tim: {u.review_note}</p>}
                  <details className="mt-2" open={editable && u.photos.length === 0}>
                    <summary className="cursor-pointer text-[12.5px] font-bold text-brand-dark">
                      Foto dan deskripsi untuk website ({u.photos.length} foto)
                      {live && (
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
                        kind="dev"
                        unitId={u.id}
                        editable={editable}
                        photos={u.photos.flatMap((p) => {
                          const url = unitPhotoUrl(p);
                          return url ? [{ path: p, url }] : [];
                        })}
                      />
                      {editable ? (
                        <DescriptionForm unit={u} kind="dev" />
                      ) : (
                        <div className="text-[13px] text-brand-gray">
                          <p className="whitespace-pre-line text-brand-dark">{u.description || "Belum ada deskripsi."}</p>
                          <p className="mt-2 text-[12px]">Rumah sudah ditinjau. Untuk mengubah foto, deskripsi, atau harga, hubungi tim barumahID.</p>
                        </div>
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-[13.5px] text-brand-gray">Belum ada rumah. Daftarkan rumah pertama Anda di bawah.</p>
        )}
      </section>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Calon pembeli dari program RTO</h2>
        <p className="mt-0.5 text-[12.5px] text-brand-gray">
          Peserta yang memilih rumah Anda lewat MoU. Identitas calon pembeli dibuka lewat tim barumahID setelah NDA ditandatangani.
        </p>
        {pipeline.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13px]">
              <thead>
                <tr className="text-[12px] text-brand-gray">
                  <th className="py-2 pr-3 font-semibold">Peserta</th>
                  <th className="py-2 pr-3 font-semibold">Rumah</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 pr-3 font-semibold">Mulai RTO</th>
                  <th className="py-2 pr-3 font-semibold">Saldo DP</th>
                  <th className="py-2 font-semibold">Konversi paling cepat</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((p, i) => {
                  const pct = p.dp_target ? Math.min(100, Math.round((Number(p.balance) / Number(p.dp_target)) * 100)) : null;
                  return (
                    <tr key={`${p.unit_id}-${i}`} className="border-t border-brand-dark/10">
                      <td className="py-2.5 pr-3 font-bold">Peserta {i + 1}</td>
                      <td className="py-2.5 pr-3">{p.unit_title}</td>
                      <td className="py-2.5 pr-3">{RTO_STATUS_LABEL[p.rto_status]}</td>
                      <td className="py-2.5 pr-3">{dateLabel(p.contract_signed_at)}</td>
                      <td className="py-2.5 pr-3">
                        {rupiah(Number(p.balance))}
                        {pct !== null && <span className="text-brand-gray"> · {pct}% dari {rupiah(Number(p.dp_target))}</span>}
                      </td>
                      <td className="py-2.5">{monthYear(earliestConversion(p.contract_signed_at))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-brand-mute">Belum ada peserta yang memilih rumah Anda. Peserta baru bisa memilih setelah rumah tayang.</p>
        )}
      </section>

      <section className={card}>
        <h2 className="text-[16px] font-extrabold">Daftarkan rumah tujuan</h2>
        <p className="mb-4 mt-0.5 text-[12.5px] text-brand-gray">
          Rumah ditinjau tim barumahID, lalu tayang di halaman Rent-to-Own setelah NDA dan MoU Developer. Imbal jasa dibayar saat akad, sesuai MoU Developer.
        </p>
        <DevUnitForm />
      </section>
    </div>
  );
}

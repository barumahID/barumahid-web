import { confirmPayment, endTenancy, rejectPayment, setDevUnitStatus, setRtoStatus, setUnitStatus, verifyKtp } from "@/app/portal/rto-actions";
import { RTO_LEVELS, RTO_PATHS, programRent, regularRent } from "@/data/rto";
import type { Profile } from "@/lib/portal";
import {
  DEV_UNIT_STATUS_LABEL,
  DEV_UNIT_STATUS_TONE,
  LEDGER_LABEL,
  PAYMENT_STATUS_LABEL,
  RTO_STATUS_LABEL,
  UNIT_STATUS_LABEL,
  UNIT_STATUS_TONE,
  computeJourney,
  computeStreak,
  dateLabel,
  monthLabel,
  rupiah,
  type DevUnitStatus,
  type RtoAssessment,
  type RtoDevUnit,
  type RtoLedgerEntry,
  type RtoPayment,
  type RtoStatus,
  type RtoTenancy,
  type RtoTenant,
  type RtoUnit,
  type UnitStatus,
} from "@/lib/rto";
import AutoSelect from "./AutoSelect";
import { waHref } from "./PortalShell";
import {
  ActionButton,
  DescriptionForm,
  DevReviewForm,
  DevUnitForm,
  InspectionForm,
  LedgerForm,
  LocationForm,
  RecordPaymentForm,
  TenancyForm,
  TenantPlanForm,
} from "./RtoForms";
import UnitPhotos from "./UnitPhotos";
import { unitPhotoUrl } from "@/lib/rto-listing";

// Tab Rent-to-Own di Portal tim: penyewa (verifikasi KTP, rencana, keputusan RTO, sewa, pembayaran, saldo DP) dan unit
// penyedia kos (inspeksi, tayang), dan rumah tujuan dari developer mitra (tinjauan, tayang, dihubungkan ke penyewa lewat
// rencana DP). Pencatatan 25% sewa jadi saldo DP dilakukan fungsi database saat pembayaran dikonfirmasi.

export interface RtoTeamData {
  tenants: RtoTenant[];
  assessments: RtoAssessment[];
  tenancies: RtoTenancy[];
  payments: RtoPayment[];
  ledger: RtoLedgerEntry[];
  units: RtoUnit[];
  devUnits: RtoDevUnit[];
}

const card = "rounded-2xl border border-brand-dark/10 bg-white";
const RTO_OPTIONS = (Object.keys(RTO_STATUS_LABEL) as RtoStatus[]).map((v) => ({ value: v, label: RTO_STATUS_LABEL[v] }));
const UNIT_OPTIONS = (Object.keys(UNIT_STATUS_LABEL) as UnitStatus[]).map((v) => ({ value: v, label: UNIT_STATUS_LABEL[v] }));
const DEV_OPTIONS = (Object.keys(DEV_UNIT_STATUS_LABEL) as DevUnitStatus[]).map((v) => ({ value: v, label: DEV_UNIT_STATUS_LABEL[v] }));

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-dark/10 p-4">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">{title}</p>
      {children}
    </div>
  );
}

export default function TeamRto({ data, accounts }: { data: RtoTeamData; accounts: Profile[] }) {
  const { tenants, assessments, tenancies, payments, ledger, units, devUnits } = data;
  const profileOf = new Map(accounts.map((a) => [a.user_id, a]));
  const tenantOf = new Map(tenants.map((t) => [t.user_id, t]));
  const penyewa = accounts.filter((a) => a.role === "penyewa");
  const latestScore = new Map<string, RtoAssessment>();
  for (const a of [...assessments].sort((x, y) => (x.created_at < y.created_at ? 1 : -1))) if (!latestScore.has(a.user_id)) latestScore.set(a.user_id, a);
  const balanceOf = (id: string) => ledger.filter((e) => e.tenant_user_id === id).reduce((s, e) => s + Number(e.amount), 0);
  const unitOf = new Map(units.map((u) => [u.id, u]));
  const reported = payments.filter((p) => p.status === "dilaporkan");
  const applied = tenants.filter((t) => t.rto_status === "diajukan");
  const newUnits = units.filter((u) => u.status === "diajukan");
  const newDevUnits = devUnits.filter((u) => u.status === "diajukan");
  const developers = accounts
    .filter((a) => a.role === "mitra" && a.requested_category === "developer")
    .map((a) => ({ id: a.user_id, name: a.company || a.full_name || a.email }));
  const pickable = (current: string | null) => devUnits.filter((u) => u.status === "tayang" || u.status === "habis" || u.id === current);
  const totalBalance = ledger.reduce((s, e) => s + Number(e.amount), 0);
  const nameOf = (id: string) => profileOf.get(id)?.full_name || profileOf.get(id)?.email || "Penyewa";

  const stats = [
    { label: "Akun penyewa", value: penyewa.length },
    { label: "KTP terverifikasi", value: tenants.filter((t) => t.ktp_verified_at).length },
    { label: "Sewa aktif", value: tenancies.filter((t) => t.status === "aktif").length },
    { label: "Peserta RTO", value: tenants.filter((t) => t.rto_status === "disetujui").length },
    { label: "Total saldo DP", value: rupiah(totalBalance) },
    { label: "Unit kos tayang", value: units.filter((u) => u.status === "tayang" || u.status === "penuh").length },
    { label: "Rumah tujuan tayang", value: devUnits.filter((u) => u.status === "tayang").length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {stats.map((s) => (
          <div key={s.label} className={`${card} px-4 py-3.5`}>
            <p className="text-[12px] text-brand-gray">{s.label}</p>
            <p className="mt-1 text-[20px] font-black text-brand-dark">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Perlu tindakan */}
      <section className={`${card} p-5`}>
        <h2 className="text-[15px] font-extrabold">Perlu tindakan</h2>
        {reported.length + applied.length + newUnits.length + newDevUnits.length === 0 ? (
          <p className="mt-2 text-[13px] text-brand-mute">Tidak ada yang menunggu.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
            {reported.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[13.5px]">
                <span>
                  <span className="font-bold">{nameOf(p.tenant_user_id)}</span> melaporkan sewa {monthLabel(p.period)}: {rupiah(p.amount)}, dibayar{" "}
                  {dateLabel(p.paid_at)}
                  {p.reference ? ` · ${p.reference}` : ""}
                </span>
                <span className="flex gap-2">
                  <ActionButton action={confirmPayment} fields={{ id: p.id, paid_at: p.paid_at ?? "" }}>
                    Konfirmasi lunas
                  </ActionButton>
                  <ActionButton action={rejectPayment} fields={{ id: p.id }} tone="ghost">
                    Tolak
                  </ActionButton>
                </span>
              </li>
            ))}
            {applied.map((t) => (
              <li key={t.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[13.5px]">
                <span>
                  <span className="font-bold">{nameOf(t.user_id)}</span> mengajukan RTO ({RTO_PATHS.find((p) => p.id === t.path)?.name ?? "jalur belum dipilih"}),{" "}
                  {dateLabel(t.rto_applied_at)}
                </span>
                <a href={`#penyewa-${t.user_id}`} className="text-[12.5px] font-bold text-brand-red hover:underline">
                  Tinjau
                </a>
              </li>
            ))}
            {newUnits.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[13.5px]">
                <span>
                  Unit baru <span className="font-bold">{u.title}</span> · {u.city} dari {u.owner_user_id ? nameOf(u.owner_user_id) : "tim"}
                </span>
                <a href={`#unit-${u.id}`} className="text-[12.5px] font-bold text-brand-red hover:underline">
                  Jadwalkan inspeksi
                </a>
              </li>
            ))}
            {newDevUnits.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[13.5px]">
                <span>
                  Rumah tujuan baru <span className="font-bold">{u.title}</span> · {u.city} dari {u.owner_user_id ? nameOf(u.owner_user_id) : "tim"}
                </span>
                <a href={`#dev-${u.id}`} className="text-[12.5px] font-bold text-brand-red hover:underline">
                  Tinjau
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Penyewa */}
      <section className={`${card} p-5`}>
        <h2 className="text-[15px] font-extrabold">Penyewa</h2>
        <p className="mt-0.5 text-[12.5px] text-brand-gray">Buka satu penyewa untuk verifikasi, rencana DP, keputusan RTO, sewa, dan pembayaran.</p>
        {penyewa.length === 0 ? (
          <p className="mt-3 text-[13px] text-brand-mute">Belum ada akun penyewa.</p>
        ) : (
          <div className="mt-3 divide-y divide-brand-dark/[0.07]">
            {penyewa.map((a) => {
              const t = tenantOf.get(a.user_id);
              const myTenancies = tenancies.filter((x) => x.tenant_user_id === a.user_id);
              const active = myTenancies.find((x) => x.status === "aktif") ?? null;
              const myPayments = payments.filter((p) => p.tenant_user_id === a.user_id);
              const myLedger = ledger.filter((e) => e.tenant_user_id === a.user_id);
              const streak = computeStreak(myPayments);
              const score = latestScore.get(a.user_id)?.score ?? null;
              const balance = balanceOf(a.user_id);
              const journey = computeJourney({
                ktpVerified: !!t?.ktp_verified_at,
                hasTenancy: !!active,
                streak,
                score,
                rtoStatus: t?.rto_status ?? "belum",
                contractSigned: !!t?.contract_signed_at,
                contractSignedAt: t?.contract_signed_at ?? null,
                dpBalance: balance,
                dpTarget: t?.dp_target ?? null,
              });
              const lv = RTO_LEVELS[journey.reached];
              const wa = waHref(a.phone);
              return (
                <details key={a.user_id} id={`penyewa-${a.user_id}`} className="group scroll-mt-24 py-3">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
                    <span className="min-w-[180px] font-bold text-brand-dark">{a.full_name || a.email}</span>
                    <span className="text-brand-gray">{t?.city ?? "-"}</span>
                    <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-[11.5px] font-bold text-white">{lv.n === null ? lv.name : `Lv ${lv.n} ${lv.name}`}</span>
                    <span className="text-[12.5px] text-brand-gray">{streak} bln tepat waktu</span>
                    <span className="text-[12.5px] text-brand-gray">Skor {score ?? "-"}</span>
                    <span className="text-[12.5px] font-semibold text-brand-dark">{RTO_STATUS_LABEL[t?.rto_status ?? "belum"]}</span>
                    <span className="ml-auto font-extrabold text-brand-dark">{rupiah(balance)}</span>
                  </summary>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <Panel title="Kontak dan verifikasi">
                      <p className="text-[13px]">
                        {a.email}
                        {a.phone && (
                          <>
                            {" · "}
                            {wa ? (
                              <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f9d55] hover:underline">
                                {a.phone}
                              </a>
                            ) : (
                              a.phone
                            )}
                          </>
                        )}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                        {t?.ktp_verified_at ? (
                          <>
                            <span className="font-semibold text-[#2D7A4F]">KTP terverifikasi {dateLabel(t.ktp_verified_at)}</span>
                            <ActionButton action={verifyKtp} fields={{ user_id: a.user_id, on: "0" }} tone="ghost">
                              Batalkan
                            </ActionButton>
                          </>
                        ) : (
                          <ActionButton action={verifyKtp} fields={{ user_id: a.user_id, on: "1" }}>
                            Tandai KTP terverifikasi
                          </ActionButton>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
                        <span className="text-brand-gray">Status RTO</span>
                        {t ? (
                          <AutoSelect action={setRtoStatus} fields={{ user_id: a.user_id }} name="rto_status" value={t.rto_status} label={`Status RTO ${a.email}`} options={RTO_OPTIONS} />
                        ) : (
                          <span className="text-brand-mute">Data penyewa belum ada</span>
                        )}
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-brand-mute">
                        Setujui hanya setelah syarat terpenuhi dan kontrak dijelaskan. Saldo DP mulai tercatat untuk sewa sejak bulan Kontrak RTO ditandatangani.
                      </p>
                    </Panel>
                    {t && (
                      <Panel title="Rencana DP dan dokumen">
                        <TenantPlanForm tenant={t} devUnits={pickable(t.target_dev_unit_id)} />
                      </Panel>
                    )}
                    <Panel title="Sewa">
                      {myTenancies.length ? (
                        <ul className="mb-3 space-y-1.5 text-[13px]">
                          {myTenancies.map((x) => (
                            <li key={x.id} className="flex flex-wrap items-center justify-between gap-2">
                              <span>
                                {x.unit_id ? unitOf.get(x.unit_id)?.title ?? "Unit mitra" : x.unit_label} · mulai {dateLabel(x.start_date)} · {rupiah(x.rent_monthly)} · tgl {x.due_day}
                              </span>
                              {x.status === "aktif" ? (
                                <ActionButton action={endTenancy} fields={{ id: x.id }} tone="ghost">
                                  Akhiri
                                </ActionButton>
                              ) : (
                                <span className="text-[12px] text-brand-mute">Selesai</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {!active && <TenancyForm userId={a.user_id} units={units.filter((u) => u.status === "tayang" || u.status === "penuh")} />}
                    </Panel>
                    <Panel title="Catat pembayaran lunas">
                      <RecordPaymentForm tenancies={myTenancies.filter((x) => x.status === "aktif")} />
                    </Panel>
                    <Panel title="Riwayat pembayaran">
                      {myPayments.length ? (
                        <ul className="space-y-1 text-[12.5px]">
                          {myPayments.slice(0, 8).map((p) => (
                            <li key={p.id} className="flex justify-between gap-2">
                              <span>
                                {monthLabel(p.period)} · {rupiah(p.amount)}
                              </span>
                              <span className={p.status === "lunas" ? "text-[#2D7A4F]" : "text-brand-gray"}>
                                {PAYMENT_STATUS_LABEL[p.status]}
                                {p.dp_amount > 0 ? ` · DP ${rupiah(p.dp_amount)}` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[12.5px] text-brand-mute">Belum ada.</p>
                      )}
                    </Panel>
                    <Panel title="Saldo DP">
                      <p className="text-[20px] font-black">{rupiah(balance)}</p>
                      {myLedger.length > 0 && (
                        <ul className="mt-2 space-y-1 text-[12.5px]">
                          {myLedger.slice(0, 6).map((e) => (
                            <li key={e.id} className="flex justify-between gap-2">
                              <span>
                                {LEDGER_LABEL[e.kind]} · {dateLabel(e.created_at)}
                              </span>
                              <span className="font-semibold">{rupiah(Number(e.amount))}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 border-t border-brand-dark/10 pt-3">
                        <LedgerForm userId={a.user_id} />
                      </div>
                    </Panel>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      {/* Unit penyedia kos */}
      <section className={`${card} p-5`}>
        <h2 className="text-[15px] font-extrabold">Unit penyedia kos</h2>
        <p className="mt-0.5 text-[12.5px] text-brand-gray">Alur: diajukan, jadwal inspeksi, hasil inspeksi, MoU, lalu tayang.</p>
        {units.length === 0 ? (
          <p className="mt-3 text-[13px] text-brand-mute">Belum ada unit.</p>
        ) : (
          <div className="mt-3 divide-y divide-brand-dark/[0.07]">
            {units.map((u) => (
              <details key={u.id} id={`unit-${u.id}`} className="scroll-mt-24 py-3">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
                  <span className="min-w-[200px] font-bold text-brand-dark">{u.title}</span>
                  <span className="text-brand-gray">{[u.kelurahan, u.kecamatan, u.city].filter(Boolean).join(", ")}</span>
                  <span className="text-brand-dark">
                    {rupiah(u.rent_monthly)}/bln ke pemilik · sewa biasa {rupiah(regularRent(u.rent_monthly))} · sewa program {rupiah(programRent(regularRent(u.rent_monthly)))}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${UNIT_STATUS_TONE[u.status]}`}>{UNIT_STATUS_LABEL[u.status]}</span>
                  {u.rto_ready && <span className="text-[12px] font-semibold text-[#2D7A4F]">Bersedia RTO</span>}
                </summary>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <Panel title="Data unit">
                    <p className="text-[13px]">
                      Pemilik: {u.owner_user_id ? nameOf(u.owner_user_id) : "-"} · {u.kind === "kos" ? "Kos" : "Rumah sewa"}
                      {u.rooms ? ` · ${u.rooms} kamar/unit` : ""}
                    </p>
                    {u.address_private && <p className="mt-1 text-[13px] text-brand-gray">Alamat: {u.address_private}</p>}
                    {u.facilities.length > 0 && <p className="mt-1 text-[12.5px] text-brand-gray">{u.facilities.join(", ")}</p>}
                    <div className="mt-3 flex items-center gap-2 text-[13px]">
                      <span className="text-brand-gray">Status</span>
                      <AutoSelect action={setUnitStatus} fields={{ id: u.id }} name="status" value={u.status} label={`Status unit ${u.title}`} options={UNIT_OPTIONS} />
                    </div>
                    <p className="mt-1.5 text-[12px] text-brand-gray">
                      Tayang dan Penuh butuh hasil inspeksi Layak. Unit tayang langsung muncul di halaman cari unit.
                      {(u.status === "tayang" || u.status === "penuh") && (
                        <>
                          {" "}
                          <a href={`/layanan/rto/${u.slug}`} target="_blank" rel="noopener" className="font-bold text-brand-dark underline underline-offset-2">
                            Lihat di website
                          </a>
                        </>
                      )}
                    </p>
                    {(u.status === "tayang" || u.status === "penuh") && u.photos.length === 0 && (
                      <p className="mt-1.5 text-[12px] font-semibold text-brand-red">Unit tayang tanpa foto. Tambahkan foto di bawah.</p>
                    )}
                  </Panel>
                  <Panel title="Inspeksi (20 poin, minimal 8 foto)">
                    <InspectionForm unit={u} />
                  </Panel>
                  <Panel title={`Foto listing (${u.photos.length})`}>
                    <UnitPhotos
                      unitId={u.id}
                      editable
                      photos={u.photos.flatMap((p) => {
                        const url = unitPhotoUrl(p);
                        return url ? [{ path: p, url }] : [];
                      })}
                    />
                  </Panel>
                  <div className="grid gap-3">
                    <Panel title="Deskripsi listing">
                      <DescriptionForm unit={u} />
                    </Panel>
                    <Panel title="Titik peta (area perkiraan)">
                      <LocationForm unit={u} />
                    </Panel>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Rumah tujuan dari developer mitra */}
      <section className={`${card} p-5`}>
        <h2 className="text-[15px] font-extrabold">Rumah tujuan developer mitra</h2>
        <p className="mt-0.5 text-[12.5px] text-brand-gray">
          Alur: diajukan, ditinjau (legalitas, NDA, MoU Developer), lalu tayang. Penyewa dihubungkan ke rumah lewat Rencana DP; harganya dikunci di MoU.
        </p>
        {devUnits.length === 0 ? (
          <p className="mt-3 text-[13px] text-brand-mute">Belum ada rumah tujuan.</p>
        ) : (
          <div className="mt-3 divide-y divide-brand-dark/[0.07]">
            {devUnits.map((u) => {
              const chosen = tenants.filter((t) => t.target_dev_unit_id === u.id);
              const live = u.status === "tayang" || u.status === "habis";
              return (
                <details key={u.id} id={`dev-${u.id}`} className="scroll-mt-24 py-3">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
                    <span className="min-w-[200px] font-bold text-brand-dark">{u.title}</span>
                    <span className="text-brand-gray">{[u.project, u.kelurahan, u.kecamatan, u.city].filter(Boolean).join(", ")}</span>
                    <span className="text-brand-dark">
                      {rupiah(u.price)} · DP min {u.dp_min_pct}%
                    </span>
                    <span className="text-[12.5px] text-brand-gray">{chosen.length} peserta</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${DEV_UNIT_STATUS_TONE[u.status]}`}>{DEV_UNIT_STATUS_LABEL[u.status]}</span>
                  </summary>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <Panel title="Data dan status">
                      <p className="text-[13px]">
                        Developer: {u.owner_user_id ? nameOf(u.owner_user_id) : "dikelola tim"}
                        {u.tipe ? ` · Tipe ${u.tipe}` : ""}
                        {u.land_area ? ` · LT ${u.land_area} m²` : ""}
                        {u.building_area ? ` · LB ${u.building_area} m²` : ""}
                        {u.bedrooms ? ` · ${u.bedrooms} KT` : ""}
                        {u.bathrooms ? ` · ${u.bathrooms} KM` : ""}
                        {u.units_available ? ` · ${u.units_available} unit untuk program` : ""}
                      </p>
                      {u.legal && <p className="mt-1 text-[13px] text-brand-gray">Legalitas: {u.legal}</p>}
                      {u.address_private && <p className="mt-1 text-[13px] text-brand-gray">Alamat: {u.address_private}</p>}
                      {u.facilities.length > 0 && <p className="mt-1 text-[12.5px] text-brand-gray">{u.facilities.join(", ")}</p>}
                      {chosen.length > 0 && (
                        <p className="mt-1 text-[12.5px] text-brand-gray">Dipilih: {chosen.map((t) => nameOf(t.user_id)).join(", ")}</p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-[13px]">
                        <span className="text-brand-gray">Status</span>
                        <AutoSelect action={setDevUnitStatus} fields={{ id: u.id }} name="status" value={u.status} label={`Status rumah ${u.title}`} options={DEV_OPTIONS} />
                      </div>
                      <p className="mt-1.5 text-[12px] text-brand-gray">
                        Tayangkan setelah legalitas dicek dan MoU Developer ditandatangani. Rumah tayang muncul di tab Rumah Berdaya sebagai rumah tujuan.
                        {live && (
                          <>
                            {" "}
                            <a href={`/layanan/rto/${u.slug}`} target="_blank" rel="noopener" className="font-bold text-brand-dark underline underline-offset-2">
                              Lihat di website
                            </a>
                          </>
                        )}
                      </p>
                      {live && u.photos.length === 0 && <p className="mt-1.5 text-[12px] font-semibold text-brand-red">Rumah tayang tanpa foto. Tambahkan foto di bawah.</p>}
                    </Panel>
                    <Panel title="Catatan untuk developer">
                      <DevReviewForm unit={u} />
                    </Panel>
                    <Panel title={`Foto dan render (${u.photos.length})`}>
                      <UnitPhotos
                        kind="dev"
                        unitId={u.id}
                        editable
                        photos={u.photos.flatMap((p) => {
                          const url = unitPhotoUrl(p);
                          return url ? [{ path: p, url }] : [];
                        })}
                      />
                    </Panel>
                    <div className="grid gap-3">
                      <Panel title="Deskripsi listing">
                        <DescriptionForm unit={u} kind="dev" />
                      </Panel>
                      <Panel title="Titik peta (area perkiraan)">
                        <LocationForm unit={u} kind="dev" />
                      </Panel>
                    </div>
                    <div className="lg:col-span-2">
                      <Panel title="Ubah data rumah">
                        <DevUnitForm unit={u} />
                      </Panel>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
        <details className="mt-4 rounded-xl border border-dashed border-brand-dark/20 p-4">
          <summary className="cursor-pointer text-[13.5px] font-bold text-brand-dark">+ Tambah rumah tujuan</summary>
          <div className="mt-3">
            <DevUnitForm owners={developers} />
          </div>
        </details>
      </section>
    </div>
  );
}

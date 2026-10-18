import Link from "next/link";
import { GFORMS } from "@/data/google-forms";
import { WA_ADMIN_1, waLink } from "@/data/site";
import { RTO_LEVELS, RTO_PATHS, RTO_UNLOCK_MONTHS, RTO_UNLOCK_SCORE } from "@/data/rto";
import type { Profile } from "@/lib/portal";
import {
  ASSESSMENT_MAX,
  ASSESSMENT_QUESTIONS,
  DOC_LABEL,
  LEDGER_LABEL,
  PAYMENT_STATUS_LABEL,
  RTO_STATUS_LABEL,
  computeJourney,
  dateLabel,
  earliestConversion,
  monthLabel,
  rupiah,
  type AgreementDoc,
  type RtoAgreement,
  type RtoAssessment,
  type RtoLedgerEntry,
  type RtoPayment,
  type RtoTenancy,
  type RtoTenant,
} from "@/lib/rto";
import { ApplyRtoForm, AssessmentForm, ReportPaymentForm } from "./RtoForms";

// Dashboard penyewa (arahan user Okt 2026): akun sendiri, level perjalanan seperti game, monitoring saldo DP (dana titipan),
// riwayat sewa, asesmen Skor Siap Punya Rumah, dokumen. Data hanya milik akun ini (RLS).

const card = "rounded-2xl border border-brand-dark/10 bg-white p-5 md:p-6";

function Lock() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export interface PenyewaData {
  tenant: RtoTenant | null;
  assessment: RtoAssessment | null;
  tenancy: (RtoTenancy & { unit_title?: string | null; unit_city?: string | null }) | null;
  payments: RtoPayment[];
  ledger: RtoLedgerEntry[];
  agreements: RtoAgreement[];
  streak: number;
}

export default function PenyewaDashboard({ profile, data }: { profile: Profile; data: PenyewaData }) {
  const { tenant, assessment, tenancy, payments, ledger, agreements, streak } = data;
  const balance = ledger.reduce((s, e) => s + Number(e.amount), 0);
  const rtoStatus = tenant?.rto_status ?? "belum";
  const journey = computeJourney({
    ktpVerified: !!tenant?.ktp_verified_at,
    hasTenancy: !!tenancy,
    streak,
    score: assessment?.score ?? null,
    rtoStatus,
    contractSigned: !!tenant?.contract_signed_at,
    contractSignedAt: tenant?.contract_signed_at ?? null,
    dpBalance: balance,
    dpTarget: tenant?.dp_target ?? null,
  });
  const current = RTO_LEVELS[journey.reached];
  const nextLevel = RTO_LEVELS[journey.reached + 1];
  const target = tenant?.dp_target ?? 0;
  const pct = target > 0 ? Math.min(100, Math.round((balance / target) * 100)) : 0;
  const inProgram = rtoStatus === "disetujui" && !!tenant?.contract_signed_at;
  const conversionAt = inProgram
    ? earliestConversion(tenant?.contract_signed_at ?? null)?.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" })
    : null;
  const path = RTO_PATHS.find((p) => p.id === tenant?.path);
  const name = profile.full_name || profile.email.split("@")[0];
  const waAdmin = waLink(`Halo Admin barumahID, saya ${name} (akun penyewa ${profile.email}).`, WA_ADMIN_1);
  const waKtp = waLink(`Halo Admin barumahID, saya ${name} (akun penyewa ${profile.email}). Saya mau verifikasi KTP.`, WA_ADMIN_1);
  const signedDocs = new Map(agreements.map((a) => [a.doc, a]));
  const docsForTenant: AgreementDoc[] = ["syarat_ketentuan", "perjanjian_sewa", "bast", "kontrak_rto"];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Dashboard penyewa</p>
          <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">Halo, {name}.</h1>
        </div>
        <span className="rounded-full bg-brand-dark px-4 py-2 text-[13px] font-bold text-white">
          {current.n === null ? current.name : `Level ${current.n}`} · {current.n === null ? "RTO diajukan" : current.name}
        </span>
      </div>

      {/* Perjalanan level pribadi */}
      <section className="rounded-2xl bg-brand-dark p-5 text-white md:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">Perjalananmu</p>
        <ol className="mt-4 grid grid-cols-7 gap-1" aria-label="Level perjalanan">
          {RTO_LEVELS.map((l, i) => {
            const done = i <= journey.reached;
            const isNext = i === journey.reached + 1;
            return (
              <li key={l.id} className="flex flex-col items-center text-center">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 text-[13px] font-black md:h-11 md:w-11 ${
                    done
                      ? "border-brand-red bg-brand-red text-white"
                      : isNext
                        ? "animate-pulse-dot border-white text-white"
                        : "border-white/20 text-white/35"
                  }`}
                  title={l.name}
                >
                  {done ? <Check /> : isNext ? (l.n ?? "★") : <Lock />}
                </span>
                <span className={`mt-1.5 hidden text-[11px] font-semibold leading-tight sm:block ${done ? "text-white" : "text-white/45"}`}>{l.name}</span>
              </li>
            );
          })}
        </ol>
        {nextLevel ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-[18px] font-extrabold">Misi menuju {nextLevel.name}</p>
              <ul className="mt-3 space-y-3">
                {journey.next.map((m) => (
                  <li key={m.label}>
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${m.done ? "bg-[#2D7A4F] text-white" : "border-2 border-white/30"}`}>
                        {m.done && <Check />}
                      </span>
                      <span>
                        <span className={`block text-[14.5px] font-semibold ${m.done ? "text-white/60 line-through" : ""}`}>{m.label}</span>
                        {m.note && <span className="block text-[12.5px] text-white/55">{m.note}</span>}
                      </span>
                    </div>
                    {m.progress !== undefined && !m.done && (
                      <div className="ml-7 mt-2 h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-brand-red" style={{ width: `${Math.round(m.progress * 100)}%` }} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              {!tenant?.ktp_verified_at && (
                <a href={waKtp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-lg bg-[#1f9d55] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#188a49]">
                  Verifikasi KTP lewat WhatsApp
                </a>
              )}
              {!tenancy && tenant?.ktp_verified_at && (
                <Link href="/layanan/rto#listing" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-brand-dark hover:bg-brand-cream">
                  Lihat unit mitra
                </Link>
              )}
            </div>
            <div className="rounded-xl bg-white/[0.06] p-4">
              {journey.canApply ? (
                <>
                  <p className="text-[15px] font-extrabold">Gerbang RTO terbuka untukmu.</p>
                  <p className="mt-1 mb-4 text-[13px] text-white/65">Pilih jalur, lalu tim kami menghubungimu untuk menjelaskan Kontrak RTO.</p>
                  <ApplyRtoForm />
                </>
              ) : rtoStatus === "diajukan" ? (
                <p className="text-[14px] leading-relaxed text-white/80">Pengajuan RTO sedang ditinjau tim. Kami menghubungimu lewat WhatsApp {profile.phone ?? ""}.</p>
              ) : rtoStatus === "ditolak" ? (
                <p className="text-[14px] leading-relaxed text-white/80">Pengajuan sebelumnya belum disetujui. Tim menjelaskan alasannya, dan kamu bisa mengajukan lagi setelah syaratnya terpenuhi.</p>
              ) : (
                <>
                  <p className="text-[15px] font-extrabold">Syarat membuka RTO</p>
                  <ul className="mt-2 space-y-1.5 text-[13px] text-white/75">
                    <li>KTP terverifikasi</li>
                    <li>{RTO_UNLOCK_MONTHS} bulan sewa tepat waktu di unit mitra</li>
                    <li>Skor Siap Punya Rumah minimal {RTO_UNLOCK_SCORE}</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-[16px] font-extrabold">Kamu sudah di level tertinggi. Tim kami mendampingi proses akadmu.</p>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Saldo DP */}
        <section className={`${card} lg:col-span-2`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold">Saldo DP</h2>
              <p className="mt-0.5 text-[12.5px] text-brand-gray">Dana titipan atas namamu di rekening terpisah atas nama perusahaan.</p>
            </div>
            <span className="rounded-full bg-brand-cream px-3 py-1 text-[12px] font-bold text-brand-dark">{RTO_STATUS_LABEL[rtoStatus]}</span>
          </div>
          <p className="mt-4 text-[34px] font-black leading-none tracking-tight text-brand-dark">{rupiah(balance)}</p>
          {target > 0 ? (
            <>
              <div className="mt-4 h-2.5 rounded-full bg-brand-cream">
                <div className="h-2.5 rounded-full bg-brand-red transition-[width] duration-700" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap justify-between gap-2 text-[12.5px] text-brand-gray">
                <span>
                  {pct}% dari target {rupiah(target)}
                  {path ? ` · ${path.name}` : ""}
                </span>
                {tenant?.target_price ? <span>Harga rumah tujuan {rupiah(tenant.target_price)}</span> : null}
              </div>
              {conversionAt && <p className="mt-2 text-[12.5px] font-semibold text-brand-dark">Konversi jadi DP paling cepat {conversionAt}, sesuai jadwal di MoU.</p>}
            </>
          ) : (
            <p className="mt-3 text-[13px] text-brand-gray">Target DP dicatat setelah kamu memilih rumah dari developer mitra dan MoU ditandatangani.</p>
          )}
          {!inProgram && (
            <p className="mt-4 rounded-xl bg-brand-cream px-4 py-3 text-[13px] leading-relaxed text-brand-dark">
              Saldo DP mulai bertambah setelah RTO terbuka dan Kontrak RTO ditandatangani. Sejak itu, 25% dari setiap sewa yang lunas tercatat di sini.
            </p>
          )}
          <h3 className="mt-6 text-[13px] font-bold uppercase tracking-[0.12em] text-brand-gray">Riwayat saldo</h3>
          {ledger.length ? (
            <ul className="mt-2 divide-y divide-brand-dark/[0.07]">
              {ledger.slice(0, 12).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-[13.5px]">
                  <span>
                    <span className="block font-semibold text-brand-dark">{LEDGER_LABEL[e.kind]}</span>
                    <span className="block text-[12px] text-brand-gray">
                      {dateLabel(e.created_at)}
                      {e.note ? ` · ${e.note}` : ""}
                    </span>
                  </span>
                  <span className={`font-extrabold ${Number(e.amount) < 0 ? "text-brand-red" : "text-[#2D7A4F]"}`}>
                    {Number(e.amount) < 0 ? "-" : "+"}
                    {rupiah(Math.abs(Number(e.amount)))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[13px] text-brand-mute">Belum ada catatan saldo.</p>
          )}
        </section>

        {/* Sewa saya */}
        <section className={card}>
          <h2 className="text-[16px] font-extrabold">Sewa saya</h2>
          {tenancy ? (
            <dl className="mt-3 space-y-2 text-[13.5px]">
              <div>
                <dt className="text-brand-gray">Unit</dt>
                <dd className="font-semibold text-brand-dark">
                  {tenancy.unit_title ?? tenancy.unit_label ?? "Unit mitra"}
                  {tenancy.unit_city ? ` · ${tenancy.unit_city}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-brand-gray">Mulai</dt>
                <dd className="font-semibold text-brand-dark">{dateLabel(tenancy.start_date)}</dd>
              </div>
              <div>
                <dt className="text-brand-gray">Sewa per bulan</dt>
                <dd className="font-semibold text-brand-dark">{rupiah(tenancy.rent_monthly)}</dd>
              </div>
              <div>
                <dt className="text-brand-gray">Jatuh tempo</dt>
                <dd className="font-semibold text-brand-dark">Tanggal {tenancy.due_day} setiap bulan</dd>
              </div>
              <div>
                <dt className="text-brand-gray">Bayar tepat waktu berturut-turut</dt>
                <dd className="font-semibold text-brand-dark">{streak} bulan</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-[13.5px] leading-relaxed text-brand-gray">
              Belum ada sewa yang tercatat. Setelah KTP terverifikasi, pilih unit mitra dan tim kami mencatat sewamu di sini.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Pembayaran sewa */}
        <section className={`${card} lg:col-span-2`}>
          <h2 className="text-[16px] font-extrabold">Pembayaran sewa</h2>
          <p className="mt-0.5 text-[12.5px] text-brand-gray">
            Transfer ke rekening resmi perusahaan yang tertulis di perjanjian sewa, lalu laporkan di sini. Pengingat dikirim 3 hari sebelum jatuh tempo.
          </p>
          {payments.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-brand-dark/10 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-gray">
                    <th className="py-2 pr-3">Bulan</th>
                    <th className="py-2 pr-3">Nominal</th>
                    <th className="py-2 pr-3">Dibayar</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2">Ke saldo DP</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 12).map((p) => {
                    const late = p.status === "lunas" && p.paid_at && p.paid_at > p.due_date;
                    return (
                      <tr key={p.id} className="border-b border-brand-dark/[0.06]">
                        <td className="py-2.5 pr-3 font-semibold">{monthLabel(p.period)}</td>
                        <td className="py-2.5 pr-3">{rupiah(p.amount)}</td>
                        <td className="py-2.5 pr-3">{dateLabel(p.paid_at)}</td>
                        <td className="py-2.5 pr-3">
                          <span className={p.status === "lunas" ? (late ? "font-semibold text-[#C25E20]" : "font-semibold text-[#2D7A4F]") : p.status === "ditolak" ? "text-brand-red" : "text-brand-gray"}>
                            {PAYMENT_STATUS_LABEL[p.status]}
                            {late ? ", terlambat" : ""}
                          </span>
                        </td>
                        <td className="py-2.5">{p.dp_amount > 0 ? rupiah(p.dp_amount) : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-[13px] text-brand-mute">Belum ada pembayaran.</p>
          )}
          {tenancy && (
            <div className="mt-5 border-t border-brand-dark/10 pt-5">
              <h3 className="mb-3 text-[14px] font-extrabold">Laporkan pembayaran</h3>
              <ReportPaymentForm rent={tenancy.rent_monthly} />
            </div>
          )}
        </section>

        {/* Skor Siap Punya Rumah */}
        <section className={card}>
          <h2 className="text-[16px] font-extrabold">Skor Siap Punya Rumah</h2>
          {assessment ? (
            <>
              <p className="mt-3 text-[40px] font-black leading-none text-brand-dark">
                {assessment.score}
                <span className="text-[16px] font-bold text-brand-mute">/100</span>
              </p>
              <p className={`mt-1 text-[12.5px] font-semibold ${assessment.score >= RTO_UNLOCK_SCORE ? "text-[#2D7A4F]" : "text-[#C25E20]"}`}>
                {assessment.score >= RTO_UNLOCK_SCORE ? "Sudah memenuhi syarat skor RTO" : `Butuh minimal ${RTO_UNLOCK_SCORE} untuk membuka RTO`}
              </p>
              <ul className="mt-4 space-y-2.5">
                {ASSESSMENT_QUESTIONS.map((q) => (
                  <li key={q.id}>
                    <div className="flex justify-between text-[12.5px]">
                      <span className="text-brand-gray">{q.label}</span>
                      <span className="font-bold text-brand-dark">
                        {assessment.breakdown[q.id] ?? 0}/{ASSESSMENT_MAX[q.id]}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-brand-cream">
                      <div className="h-1.5 rounded-full bg-brand-red" style={{ width: `${((assessment.breakdown[q.id] ?? 0) / ASSESSMENT_MAX[q.id]) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-brand-mute">Diisi {dateLabel(assessment.created_at)}.</p>
            </>
          ) : (
            <p className="mt-2 text-[13px] leading-relaxed text-brand-gray">Isi 5 pertanyaan singkat. Hasilnya membantu kami menyarankan jalur yang paling cocok untukmu.</p>
          )}
          <details className="group mt-4" open={!assessment}>
            <summary className="cursor-pointer list-none rounded-lg border border-brand-dark/15 px-3 py-2 text-center text-[13px] font-bold text-brand-dark hover:border-brand-dark">
              {assessment ? "Isi ulang asesmen" : "Mulai asesmen"}
            </summary>
            <div className="mt-4">
              <AssessmentForm previous={assessment?.answers} />
            </div>
          </details>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <h2 className="text-[16px] font-extrabold">Dokumen dan persetujuan</h2>
          <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
            {docsForTenant.map((d) => {
              const a = signedDocs.get(d);
              return (
                <li key={d} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[13.5px]">
                  <span className="font-semibold text-brand-dark">{DOC_LABEL[d]}</span>
                  {a ? (
                    <span className="text-[12.5px] font-semibold text-[#2D7A4F]">
                      {a.method === "klik" ? "Disetujui" : "Ditandatangani"} {dateLabel(a.signed_on ?? a.created_at)}
                    </span>
                  ) : (
                    <span className="text-[12.5px] text-brand-mute">{d === "kontrak_rto" ? "Setelah RTO disetujui" : "Saat check-in"}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12.5px] text-brand-gray">
            Baca{" "}
            <Link href="/syarat-ketentuan" className="font-semibold text-brand-dark underline underline-offset-2">
              syarat dan ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/layanan/rto/panduan#penyewa" className="font-semibold text-brand-dark underline underline-offset-2">
              panduan penyewa
            </Link>
            .
          </p>
        </section>
        <section className={card}>
          <h2 className="text-[16px] font-extrabold">Bantuan</h2>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li>
              <a href={waAdmin} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f9d55] hover:underline">
                WhatsApp admin barumahID ↗
              </a>
            </li>
            {inProgram && (
              <li>
                <a href={GFORMS.F13} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-red">
                  Feedback peserta RTO (F13) ↗
                </a>
              </li>
            )}
            <li>
              <a href={GFORMS.F19} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-red">
                Kontak dan pertanyaan umum (F19) ↗
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

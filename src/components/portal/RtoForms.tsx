"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/portal/actions";
import {
  addLedger,
  applyRto,
  createTenancy,
  recordPayment,
  reportPayment,
  setTenantPlan,
  setUnitInspection,
  submitAssessment,
  submitUnit,
} from "@/app/portal/rto-actions";
import { ASSESSMENT_QUESTIONS, type RtoTenancy, type RtoTenant, type RtoUnit } from "@/lib/rto";

// Form platform RTO di Portal (penyewa, mitra penyedia kos, dan tim). Validasi akhir ada di server action dan database.

const input =
  "mt-1 w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-[13.5px] text-brand-dark outline-none transition-colors placeholder:text-brand-mute focus:border-brand-dark";
const label = "block text-[12.5px] font-semibold text-brand-dark";

function Submit({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "red" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors disabled:opacity-60 ${
        tone === "red" ? "bg-brand-red hover:bg-brand-red-dark" : "bg-brand-dark hover:bg-brand-red"
      }`}
    >
      {pending ? "Memproses..." : children}
    </button>
  );
}

function Notice({ state }: { state: FormState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-lg bg-brand-red/10 px-3 py-2 text-[12.5px] font-medium text-brand-red">
        {state.error}
      </p>
    );
  if (state.message) return <p className="rounded-lg bg-[#2D7A4F]/10 px-3 py-2 text-[12.5px] font-medium text-[#2D7A4F]">{state.message}</p>;
  return null;
}

const thisMonth = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().slice(0, 10);

// ---------------- Penyewa ----------------

export function AssessmentForm({ previous }: { previous?: Record<string, string> }) {
  const [state, action] = useActionState(submitAssessment, {});
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      {ASSESSMENT_QUESTIONS.map((q) => (
        <fieldset key={q.id}>
          <legend className={label}>{q.label}</legend>
          <div className="mt-1.5 grid gap-1.5">
            {q.options.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-brand-dark/10 px-3 py-2 text-[13px] text-brand-dark hover:border-brand-dark/30 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/[0.04]">
                <input type="radio" name={q.id} value={o.value} defaultChecked={previous?.[q.id] === o.value} required className="mt-0.5 h-4 w-4 accent-[#C53B3B]" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <p className="text-[12px] leading-relaxed text-brand-mute">Jawab sesuai kondisimu. Tim akan mengecek ulang sebelum menyetujui RTO.</p>
      <Submit tone="red">Simpan asesmen</Submit>
    </form>
  );
}

export function ReportPaymentForm({ rent }: { rent: number }) {
  const [state, action] = useActionState(reportPayment, {});
  return (
    <form action={action} className="space-y-3">
      <Notice state={state} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="rp-period" className={label}>Bulan sewa</label>
          <input id="rp-period" name="period" type="month" defaultValue={thisMonth()} required className={input} />
        </div>
        <div>
          <label htmlFor="rp-paid" className={label}>Tanggal bayar</label>
          <input id="rp-paid" name="paid_at" type="date" defaultValue={today()} max={today()} required className={input} />
        </div>
        <div>
          <label htmlFor="rp-amount" className={label}>Nominal (Rp)</label>
          <input id="rp-amount" name="amount" inputMode="numeric" defaultValue={String(rent)} required className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="rp-ref" className={label}>
          Keterangan transfer <span className="font-normal text-brand-mute">(opsional)</span>
        </label>
        <input id="rp-ref" name="reference" maxLength={160} placeholder="Bank pengirim atau nomor referensi" className={input} />
      </div>
      <Submit>Laporkan pembayaran</Submit>
    </form>
  );
}

export function ApplyRtoForm() {
  const [state, action] = useActionState(applyRto, {});
  const [path, setPath] = useState("siap-berdaya");
  if (state.ok) return <Notice state={state} />;
  return (
    <form action={action} className="space-y-3">
      <Notice state={state} />
      <input type="hidden" name="path" value={path} />
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            { id: "siap-berdaya", title: "Siap Berdaya", hint: "Belum punya lahan. DP menuju KPR bersama developer mitra." },
            { id: "siap-bangun", title: "Siap Bangun", hint: "Punya lahan. Modal menuju bangun bersama Jasa Konstruksi barumahID." },
          ] as const
        ).map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setPath(o.id)}
            aria-pressed={path === o.id}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${path === o.id ? "border-white bg-white text-brand-dark" : "border-white/25 text-white hover:border-white/60"}`}
          >
            <span className="block text-[14.5px] font-extrabold">{o.title}</span>
            <span className={`mt-0.5 block text-[12.5px] leading-snug ${path === o.id ? "text-brand-gray" : "text-white/70"}`}>{o.hint}</span>
          </button>
        ))}
      </div>
      <Submit tone="red">Ajukan RTO</Submit>
    </form>
  );
}

// ---------------- Mitra penyedia kos ----------------

const FACILITIES = ["WiFi", "AC", "Kamar mandi dalam", "Kamar mandi bersama", "Parkir motor", "Parkir mobil", "Dapur bersama", "Laundry", "Penjaga", "Tempat tidur", "Lemari"];

export function UnitSubmitForm() {
  const [state, action] = useActionState(submitUnit, {});
  return (
    <form action={action} className="space-y-3">
      <Notice state={state} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="u-title" className={label}>Nama unit</label>
          <input id="u-title" name="title" required maxLength={120} placeholder="Kos Putri Melati, kamar tipe A" className={input} />
        </div>
        <div>
          <label htmlFor="u-kind" className={label}>Jenis</label>
          <select id="u-kind" name="kind" required defaultValue="" className={input}>
            <option value="" disabled>Pilih</option>
            <option value="kos">Kos-kosan (per kamar)</option>
            <option value="rumah">Rumah sewa (per unit)</option>
          </select>
        </div>
        <div>
          <label htmlFor="u-city" className={label}>Kota</label>
          <input id="u-city" name="city" required maxLength={80} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="u-kec" className={label}>Kecamatan</label>
            <input id="u-kec" name="kecamatan" maxLength={80} className={input} />
          </div>
          <div>
            <label htmlFor="u-kel" className={label}>Kelurahan</label>
            <input id="u-kel" name="kelurahan" maxLength={80} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="u-rent" className={label}>Harga sewa per bulan (Rp)</label>
          <input id="u-rent" name="rent_monthly" inputMode="numeric" required className={input} />
        </div>
        <div>
          <label htmlFor="u-rooms" className={label}>Jumlah kamar atau unit</label>
          <input id="u-rooms" name="rooms" inputMode="numeric" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="u-addr" className={label}>
          Alamat lengkap <span className="font-normal text-brand-mute">(hanya untuk tim, tidak tampil di website)</span>
        </label>
        <textarea id="u-addr" name="address_private" rows={2} maxLength={400} className={input} />
      </div>
      <fieldset>
        <legend className={label}>Fasilitas</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {FACILITIES.map((f) => (
            <label key={f} className="cursor-pointer rounded-full border border-brand-dark/15 px-3 py-1 text-[12.5px] text-brand-dark has-[:checked]:border-brand-dark has-[:checked]:bg-brand-dark has-[:checked]:text-white">
              <input type="checkbox" name="facilities" value={f} className="sr-only" />
              {f}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-start gap-2.5 text-[13px] text-brand-dark">
        <input type="checkbox" name="rto_ready" className="mt-0.5 h-4 w-4 accent-[#C53B3B]" />
        Bersedia unit ini diikutkan program Rent-to-Own (dibuat addendum terpisah)
      </label>
      <Submit tone="red">Kirim unit untuk diperiksa</Submit>
    </form>
  );
}

// ---------------- Tim barumahID ----------------

export function TenantPlanForm({ tenant }: { tenant: RtoTenant }) {
  const [state, action] = useActionState(setTenantPlan, {});
  return (
    <form action={action} className="space-y-2.5">
      <Notice state={state} />
      <input type="hidden" name="user_id" value={tenant.user_id} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div>
          <label className={label}>Jalur</label>
          <select name="path" defaultValue={tenant.path ?? ""} className={input}>
            <option value="">Belum ditentukan</option>
            <option value="siap-berdaya">Siap Berdaya</option>
            <option value="siap-bangun">Siap Bangun</option>
            <option value="siap-beli">Siap Beli</option>
          </select>
        </div>
        <div>
          <label className={label}>Harga unit target (Rp)</label>
          <input name="target_price" inputMode="numeric" defaultValue={tenant.target_price ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>Target DP (Rp)</label>
          <input name="dp_target" inputMode="numeric" defaultValue={tenant.dp_target ?? ""} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={label}>Kontrak RTO</label>
            <input name="contract_signed_at" type="date" defaultValue={tenant.contract_signed_at ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>PPJB</label>
            <input name="ppjb_signed_at" type="date" defaultValue={tenant.ppjb_signed_at ?? ""} className={input} />
          </div>
        </div>
      </div>
      <Submit>Simpan rencana</Submit>
    </form>
  );
}

export function TenancyForm({ userId, units }: { userId: string; units: RtoUnit[] }) {
  const [state, action] = useActionState(createTenancy, {});
  return (
    <form action={action} className="space-y-2.5">
      <Notice state={state} />
      <input type="hidden" name="user_id" value={userId} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div>
          <label className={label}>Unit</label>
          <select name="unit_id" defaultValue="" className={input}>
            <option value="">Unit lain (tulis di samping)</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title} · {u.city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Nama unit lain</label>
          <input name="unit_label" maxLength={120} className={input} />
        </div>
        <div>
          <label className={label}>Mulai sewa</label>
          <input name="start_date" type="date" required className={input} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={label}>Sewa/bulan (Rp)</label>
            <input name="rent_monthly" inputMode="numeric" required className={input} />
          </div>
          <div>
            <label className={label}>Jatuh tempo (tgl)</label>
            <input name="due_day" inputMode="numeric" defaultValue="5" className={input} />
          </div>
        </div>
      </div>
      <Submit>Catat sewa</Submit>
    </form>
  );
}

export function RecordPaymentForm({ tenancies }: { tenancies: RtoTenancy[] }) {
  const [state, action] = useActionState(recordPayment, {});
  if (!tenancies.length) return <p className="text-[12.5px] text-brand-mute">Catat sewa dulu sebelum mencatat pembayaran.</p>;
  return (
    <form action={action} className="space-y-2.5">
      <Notice state={state} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Sewa</label>
          <select name="tenancy_id" defaultValue={tenancies[0].id} className={input}>
            {tenancies.map((t) => (
              <option key={t.id} value={t.id}>
                {t.unit_label ?? "Unit mitra"} · mulai {t.start_date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Bulan sewa</label>
          <input name="period" type="month" defaultValue={thisMonth()} required className={input} />
        </div>
        <div>
          <label className={label}>Tanggal bayar</label>
          <input name="paid_at" type="date" defaultValue={today()} required className={input} />
        </div>
        <div>
          <label className={label}>Nominal (Rp)</label>
          <input name="amount" inputMode="numeric" defaultValue={String(tenancies[0].rent_monthly)} required className={input} />
        </div>
        <div>
          <label className={label}>Keterangan</label>
          <input name="reference" maxLength={160} className={input} />
        </div>
      </div>
      <Submit>Catat lunas</Submit>
    </form>
  );
}

export function LedgerForm({ userId }: { userId: string }) {
  const [state, action] = useActionState(addLedger, {});
  return (
    <form action={action} className="space-y-2.5">
      <Notice state={state} />
      <input type="hidden" name="user_id" value={userId} />
      <div className="grid gap-2.5 sm:grid-cols-3">
        <div>
          <label className={label}>Jenis</label>
          <select name="kind" defaultValue="koreksi" className={input}>
            <option value="koreksi">Koreksi (+/-)</option>
            <option value="pengembalian">Pengembalian ke penyewa</option>
            <option value="konversi">Dipakai untuk DP</option>
          </select>
        </div>
        <div>
          <label className={label}>Nominal (Rp)</label>
          <input name="amount" inputMode="numeric" required className={input} />
        </div>
        <div>
          <label className={label}>Alasan</label>
          <input name="note" required maxLength={300} className={input} />
        </div>
      </div>
      <Submit>Simpan catatan saldo</Submit>
    </form>
  );
}

export function InspectionForm({ unit }: { unit: RtoUnit }) {
  const [state, action] = useActionState(setUnitInspection, {});
  return (
    <form action={action} className="space-y-2.5">
      <Notice state={state} />
      <input type="hidden" name="id" value={unit.id} />
      <div className="grid gap-2.5 sm:grid-cols-3">
        <div>
          <label className={label}>Hasil inspeksi</label>
          <select name="inspection_result" defaultValue={unit.inspection_result ?? ""} className={input}>
            <option value="" disabled>Pilih</option>
            <option value="layak">Layak</option>
            <option value="layak_catatan">Layak dengan catatan</option>
            <option value="tidak_layak">Tidak layak</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Catatan</label>
          <input name="inspection_note" defaultValue={unit.inspection_note ?? ""} maxLength={1000} className={input} />
        </div>
      </div>
      <Submit>Simpan inspeksi</Submit>
    </form>
  );
}

/** Tombol aksi tim yang langsung tersimpan; tampil "Gagal" kalau server menolak (aksi melempar error). */
export function ActionButton({
  action,
  fields,
  children,
  tone = "dark",
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
  children: React.ReactNode;
  tone?: "dark" | "red" | "ghost";
}) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);
  const run = () =>
    start(async () => {
      const fd = new FormData();
      for (const [k, v] of Object.entries(fields)) fd.set(k, v);
      try {
        setFailed(false);
        await action(fd);
      } catch {
        setFailed(true);
      }
    });
  const cls =
    tone === "red"
      ? "bg-brand-red text-white hover:bg-brand-red-dark"
      : tone === "ghost"
        ? "border border-brand-dark/15 text-brand-dark hover:border-brand-dark"
        : "bg-brand-dark text-white hover:bg-brand-red";
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={run} disabled={pending} className={`rounded-md px-2.5 py-1 text-[12px] font-bold transition-colors disabled:opacity-60 ${cls}`}>
        {pending ? "..." : children}
      </button>
      {failed && <span className="text-[11.5px] font-semibold text-brand-red">Gagal</span>}
    </span>
  );
}

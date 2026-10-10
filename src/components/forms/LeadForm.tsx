"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FORMS,
  leadToWhatsAppText,
  validateLead,
  type FieldDef,
  type LeadRole,
} from "@/lib/leads";
import { waLink } from "@/data/site";
import Turnstile from "./Turnstile";

type Status = "idle" | "sending" | "success" | "error";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-brand-dark placeholder:text-brand-mute transition-colors focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/10";

function Field({
  def,
  value,
  error,
  onChange,
  idPrefix,
}: {
  def: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${def.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
  const describedBy = [def.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const border = error ? "border-brand-red" : "border-brand-dark/15";

  return (
    <div className={def.half ? "sm:col-span-1" : "sm:col-span-2"}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-brand-dark">
        {def.label}
        {def.required && <span className="text-brand-red"> *</span>}
      </label>
      {def.type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={def.required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${inputBase} ${border} ${value ? "" : "text-brand-mute"}`}
        >
          <option value="">Pilih</option>
          {def.options?.map((o) => (
            <option key={o} value={o} className="text-brand-dark">
              {o}
            </option>
          ))}
        </select>
      ) : def.type === "textarea" ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={def.required}
          maxLength={def.maxLength}
          placeholder={def.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${inputBase} ${border}`}
        />
      ) : (
        <input
          id={id}
          type={def.type === "number" ? "text" : def.type}
          inputMode={def.type === "number" || def.type === "tel" ? "numeric" : undefined}
          autoComplete={def.type === "tel" ? "tel" : def.type === "email" ? "email" : def.name === "Nama" ? "name" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={def.required}
          maxLength={def.maxLength}
          placeholder={def.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${inputBase} ${border}`}
        />
      )}
      {def.help && !error && (
        <p id={`${id}-help`} className="mt-1.5 text-[12px] text-brand-gray">
          {def.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[12px] font-medium text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LeadForm({
  role,
  tone = "light",
  compact = false,
}: {
  role: LeadRole;
  tone?: "light" | "card";
  compact?: boolean;
}) {
  const def = FORMS[role];
  const idPrefix = useId().replace(/:/g, "");
  const pathname = usePathname();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [showExtra, setShowExtra] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();

  const mainFields = useMemo(() => def.fields.filter((f) => !f.extra), [def]);
  const extraFields = useMemo(() => def.fields.filter((f) => f.extra), [def]);

  const set = (name: string, v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fallbackHref = waLink(leadToWhatsAppText(role, values));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateLead(role, values);
    setErrors(check.errors);
    setConsentError(!consent);
    if (!check.ok || !consent) {
      if (Object.keys(check.errors).some((k) => extraFields.some((f) => f.name === k))) setShowExtra(true);
      setStatus("idle");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          fields: check.values,
          consent,
          page: pathname,
          company_website: honeypot,
          turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setMessage(data.message ?? "Data belum berhasil terkirim.");
      setStatus("error");
    } catch {
      setMessage("Koneksi terputus. Data belum terkirim.");
      setStatus("error");
    }
  }

  const wrapper =
    tone === "card"
      ? "rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(20,20,20,0.35)] sm:p-8"
      : "";

  if (status === "success") {
    return (
      <div className={`${wrapper} text-center`} role="status" aria-live="polite">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-credit text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <p className="mt-5 text-xl font-extrabold text-brand-dark">{def.successTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-gray">{def.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={wrapper} aria-label={def.title}>
      {!compact && <p className="mb-6 text-lg font-extrabold text-brand-dark">{def.title}</p>}

      {/* Honeypot: disembunyikan dari manusia, bot biasanya mengisinya */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idPrefix}-company-website`}>Website perusahaan</label>
        <input
          id={`${idPrefix}-company-website`}
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {mainFields.map((f) => (
          <Field
            key={f.name}
            def={f}
            value={values[f.name] ?? ""}
            error={errors[f.name]}
            onChange={(v) => set(f.name, v)}
            idPrefix={idPrefix}
          />
        ))}
      </div>

      {extraFields.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowExtra((s) => !s)}
            aria-expanded={showExtra}
            className="inline-flex items-center gap-2 text-left text-[13px] font-semibold text-brand-dark hover:text-brand-red"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border border-current text-[13px] leading-none transition-transform ${showExtra ? "rotate-45" : ""}`}
              aria-hidden="true"
            >
              +
            </span>
            {showExtra ? "Sembunyikan info tambahan" : "Tambah info (opsional), biar kami lebih cepat bantu"}
          </button>
          {showExtra && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {extraFields.map((f) => (
                <Field
                  key={f.name}
                  def={f}
                  value={values[f.name] ?? ""}
                  error={errors[f.name]}
                  onChange={(v) => set(f.name, v)}
                  idPrefix={idPrefix}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-brand-gray">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setConsentError(false);
            }}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#C53B3B]"
            aria-invalid={consentError}
          />
          <span>
            Saya setuju data ini dipakai barumahID untuk menghubungi saya terkait permintaan ini, sesuai{" "}
            <Link href="/kebijakan-privasi" className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand-red">
              Kebijakan Privasi
            </Link>
            .
          </span>
        </label>
        {consentError && <p className="mt-1.5 text-[12px] font-medium text-brand-red">Centang persetujuan dulu ya.</p>}
      </div>

      <Turnstile onToken={setTurnstileToken} />

      {status === "error" && (
        <div className="mt-6 rounded-2xl border border-brand-red/30 bg-brand-red/5 p-5" role="alert">
          <p className="text-sm font-semibold text-brand-dark">{message}</p>
          <p className="mt-1 text-[13px] text-brand-gray">
            Supaya datamu tidak hilang, kirim isian ini lewat WhatsApp. Pesannya sudah kami siapkan.
          </p>
          <a
            href={fallbackHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#188a49]"
          >
            Kirim lewat WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Mengirim..." : def.submitLabel}
        {status !== "sending" && (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        )}
      </button>
      <p className="mt-3 text-[12px] text-brand-mute">Kolom bertanda * wajib diisi.</p>
    </form>
  );
}

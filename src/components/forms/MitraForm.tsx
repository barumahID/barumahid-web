"use client";

import { useState } from "react";
import { FormField, inputClass } from "./FormField";
import { submitLead, LEAD_ERROR_MESSAGE } from "@/lib/leads";

export default function MitraForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError(false);
    try {
      await submitLead("mitra", Object.fromEntries(new FormData(form).entries()));
      form.reset();
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => {
        setSubmitted(false);
        setError(false);
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <FormField label="Nama">
        <input
          name="nama"
          type="text"
          required
          placeholder="Nama lengkap"
          className={inputClass}
        />
      </FormField>

      <FormField label="Nomor WhatsApp">
        <input
          name="wa"
          type="tel"
          required
          placeholder="08xx-xxxx-xxxx"
          className={inputClass}
        />
      </FormField>

      <FormField label="Kota">
        <input
          name="kota"
          type="text"
          required
          placeholder="Contoh: Padang"
          className={inputClass}
        />
      </FormField>

      <FormField label="Jumlah Unit">
        <input
          name="jumlahUnit"
          type="number"
          min={1}
          required
          placeholder="Contoh: 3"
          className={inputClass}
        />
      </FormField>

      <FormField label="Harga Sewa per Unit">
        <input
          name="hargaSewa"
          type="text"
          required
          placeholder="Contoh: Rp1.500.000/bulan"
          className={inputClass}
        />
      </FormField>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="disabled:cursor-wait disabled:opacity-60 rounded-full bg-brand-red px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red/90 hover:scale-105 sm:w-auto"
        >
          Daftar sebagai Mitra
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-brand-red">
            {LEAD_ERROR_MESSAGE}
          </p>
        )}
        {submitted && (
          <p className="mt-3 text-sm font-medium text-emerald-600">
            Terima kasih! Data kamu sudah kami terima, tim barumahID akan
            segera menghubungi.
          </p>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { FormField, inputClass } from "./FormField";

export default function CustomerForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // TODO: sambungkan ke backend, untuk sekarang cuma log ke console.
    console.log("Lead Customer:", data);
    e.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setSubmitted(false)}
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

      <FormField label="Usia">
        <input
          name="usia"
          type="number"
          min={17}
          max={100}
          required
          placeholder="Contoh: 28"
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

      <FormField label="Penghasilan per Bulan">
        <select name="penghasilan" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Pilih rentang
          </option>
          <option value="< Rp3 juta">{"< Rp3 juta"}</option>
          <option value="Rp3-5 juta">Rp3 - 5 juta</option>
          <option value="Rp5-10 juta">Rp5 - 10 juta</option>
          <option value="> Rp10 juta">{"> Rp10 juta"}</option>
        </select>
      </FormField>

      <FormField label="Minat RTO">
        <select name="minatRto" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Pilih salah satu
          </option>
          <option value="Ya, tertarik">Ya, tertarik</option>
          <option value="Masih mempertimbangkan">Masih mempertimbangkan</option>
          <option value="Belum tertarik">Belum tertarik</option>
        </select>
      </FormField>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-brand-red px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red/90 hover:scale-105 sm:w-auto"
        >
          Daftar sebagai Customer
        </button>
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

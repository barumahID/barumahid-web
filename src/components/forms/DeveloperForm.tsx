"use client";

import { useState } from "react";
import { FormField, inputClass } from "./FormField";

export default function DeveloperForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // TODO: sambungkan ke backend, untuk sekarang cuma log ke console.
    console.log("Lead Developer:", data);
    e.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setSubmitted(false)}
      className="grid gap-5 sm:grid-cols-2"
    >
      <FormField label="Nama Perusahaan">
        <input
          name="namaPerusahaan"
          type="text"
          required
          placeholder="PT Contoh Properti"
          className={inputClass}
        />
      </FormField>

      <FormField label="PIC">
        <input
          name="pic"
          type="text"
          required
          placeholder="Nama penanggung jawab"
          className={inputClass}
        />
      </FormField>

      <FormField label="WA / Email">
        <input
          name="kontak"
          type="text"
          required
          placeholder="08xx-xxxx-xxxx atau email"
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

      <FormField label="Jenis Proyek">
        <select name="jenisProyek" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Pilih jenis proyek
          </option>
          <option value="Perumahan / Residensial">
            Perumahan / Residensial
          </option>
          <option value="Komersial">Komersial</option>
          <option value="Mixed-use">Mixed-use</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </FormField>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-brand-red px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red/90 hover:scale-105 sm:w-auto"
        >
          Daftar sebagai Developer
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

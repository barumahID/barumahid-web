"use client";

import { useState } from "react";
import { submitLead, LEAD_ERROR_MESSAGE } from "@/lib/leads";

export default function ContactForm() {
  const [form, setForm] = useState({ nama: "", email: "", hp: "", keperluan: "RTO", pesan: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      await submitLead("kontak", form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ nama: "", email: "", hp: "", keperluan: "RTO", pesan: "" });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-brand-light p-8 text-center">
        <span className="text-4xl">✅</span>
        <p className="mt-3 text-lg font-bold text-brand-dark">Pesan terkirim!</p>
        <p className="mt-1 text-sm text-brand-gray">Tim kami akan segera menghubungi kamu.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="k-nama" className="mb-1.5 block text-xs font-semibold text-brand-dark">Nama</label>
          <input id="k-nama" type="text" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full rounded-lg border-2 border-brand-dark/10 px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" placeholder="Nama kamu" />
        </div>
        <div>
          <label htmlFor="k-email" className="mb-1.5 block text-xs font-semibold text-brand-dark">Email</label>
          <input id="k-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border-2 border-brand-dark/10 px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" placeholder="email@contoh.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="k-hp" className="mb-1.5 block text-xs font-semibold text-brand-dark">No HP / WA</label>
          <input id="k-hp" type="tel" required value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} className="w-full rounded-lg border-2 border-brand-dark/10 px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" placeholder="08xxxxxxxxxx" />
        </div>
        <div>
          <label htmlFor="k-keperluan" className="mb-1.5 block text-xs font-semibold text-brand-dark">Keperluan</label>
          <select id="k-keperluan" value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} className="w-full rounded-lg border-2 border-brand-dark/10 px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10">
            <option value="RTO">Program RTO</option>
            <option value="Konstruksi">Konstruksi</option>
            <option value="Partnership">Partnership</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="k-pesan" className="mb-1.5 block text-xs font-semibold text-brand-dark">Pesan</label>
        <textarea id="k-pesan" rows={4} required value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} className="w-full rounded-lg border-2 border-brand-dark/10 px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" placeholder="Tulis pesan kamu..." />
      </div>
      <button type="submit" disabled={sending} className="rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60">
        {sending ? "Mengirim..." : "Kirim Pesan"}
      </button>
      {error && (
        <p role="alert" className="text-sm font-medium text-brand-red">{LEAD_ERROR_MESSAGE}</p>
      )}
    </form>
  );
}

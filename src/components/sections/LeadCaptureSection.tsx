"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { FORM_CUSTOMER_RTO, FORM_MITRA_HUNIAN, FORM_DEVELOPER } from "@/constants";

const tabs = [
  {
    id: "customer",
    icon: "🙋",
    title: "Saya calon penyewa",
    desc: "Daftar minat program RTO",
    formUrl: FORM_CUSTOMER_RTO,
  },
  {
    id: "mitra",
    icon: "🏠",
    title: "Saya pemilik properti",
    desc: "Jadi mitra hunian barumahID",
    formUrl: FORM_MITRA_HUNIAN,
  },
  {
    id: "developer",
    icon: "🏗️",
    title: "Saya developer",
    desc: "Partnership developer mitra",
    formUrl: FORM_DEVELOPER,
  },
];

export default function LeadCaptureSection() {
  const [active, setActive] = useState("customer");
  const [form, setForm] = useState({ nama: "", wa: "", kota: "" });
  const [submitted, setSubmitted] = useState(false);

  const activeTab = tabs.find((t) => t.id === active)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[LeadCapture/${active}]`, form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ nama: "", wa: "", kota: "" });
  };

  return (
    <Section background="white" id="daftar">
      <Reveal>
        <SectionLabel>Bergabung</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Bergabung dengan barumahID
        </h2>
      </Reveal>

      {/* Tab selector */}
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActive(tab.id); setSubmitted(false); }}
            className={`flex items-center gap-3 rounded-xl border-2 p-5 text-left transition ${
              active === tab.id
                ? "border-brand-red bg-brand-red/5"
                : "border-brand-dark/8 bg-white hover:border-brand-dark/20"
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <div>
              <p className="text-sm font-bold text-brand-dark">{tab.title}</p>
              <p className="text-xs text-brand-gray">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Form */}
      <Reveal>
        <div className="mt-8 rounded-xl border border-brand-dark/8 bg-brand-off-white p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <span className="text-4xl">✅</span>
              <p className="mt-3 text-lg font-bold text-brand-dark">Terima kasih!</p>
              <p className="mt-1 text-sm text-brand-gray">Tim kami akan menghubungi kamu via WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="lc-nama" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    Nama Lengkap
                  </label>
                  <input
                    id="lc-nama"
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full rounded-lg border-2 border-brand-dark/10 bg-white px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                    placeholder="Nama kamu"
                  />
                </div>
                <div>
                  <label htmlFor="lc-wa" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    No. WhatsApp
                  </label>
                  <input
                    id="lc-wa"
                    type="tel"
                    required
                    value={form.wa}
                    onChange={(e) => setForm({ ...form, wa: e.target.value })}
                    className="w-full rounded-lg border-2 border-brand-dark/10 bg-white px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label htmlFor="lc-kota" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    Kota
                  </label>
                  <input
                    id="lc-kota"
                    type="text"
                    required
                    value={form.kota}
                    onChange={(e) => setForm({ ...form, kota: e.target.value })}
                    className="w-full rounded-lg border-2 border-brand-dark/10 bg-white px-4 py-3 text-sm transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                    placeholder="Kota kamu"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark hover:scale-[1.02]"
                >
                  Kirim Data
                </button>
                {activeTab.formUrl !== "#" && (
                  <a
                    href={activeTab.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-brand-red hover:underline"
                  >
                    Isi Form Lengkap →
                  </a>
                )}
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

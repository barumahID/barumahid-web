"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { FORM_CUSTOMER_RTO, FORM_MITRA_HUNIAN, FORM_DEVELOPER } from "@/constants";

const tabs = [
  { id: "customer", label: "Calon Penyewa", desc: "Daftar minat program RTO", formUrl: FORM_CUSTOMER_RTO },
  { id: "mitra", label: "Pemilik Properti", desc: "Jadi mitra hunian", formUrl: FORM_MITRA_HUNIAN },
  { id: "developer", label: "Developer", desc: "Partnership developer", formUrl: FORM_DEVELOPER },
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
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel number="09">Bergabung</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Mulai perjalananmu<br />bersama barumahID.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="type-body text-brand-gray max-w-md">
              Isi data singkat — tim kami akan menghubungimu via WhatsApp.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 md:mt-20 grid gap-10 md:grid-cols-12">
        {/* Left — tab selector */}
        <Reveal>
          <div className="md:col-span-4">
            <p className="type-micro text-brand-gray mb-6">Pilih Peran</p>
            <div className="border-t hairline">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActive(tab.id); setSubmitted(false); }}
                  className={`w-full border-b hairline py-5 text-left transition-colors ${
                    active === tab.id ? "" : "hover:bg-brand-dark/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[15px] font-medium tracking-tight ${
                      active === tab.id ? "text-brand-red" : "text-brand-dark"
                    }`}>
                      {tab.label}
                    </span>
                    {active === tab.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    )}
                  </div>
                  <p className="mt-1 type-small text-brand-gray">{tab.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal delay={100}>
          <div className="md:col-span-8">
            {submitted ? (
              <div className="border hairline-strong rounded-2xl p-10 md:p-14 text-center bg-brand-cream">
                <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-brand-dark text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <p className="mt-6 type-h3 text-brand-dark">Terima kasih.</p>
                <p className="mt-2 type-small text-brand-gray">Tim kami akan menghubungimu via WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lc-nama" className="block type-micro text-brand-gray mb-3">Nama Lengkap</label>
                    <input
                      id="lc-nama"
                      type="text"
                      required
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      className="w-full border-b hairline-strong bg-transparent py-3 text-[15px] text-brand-dark placeholder:text-brand-mute focus:border-brand-red transition-colors"
                      placeholder="Namamu"
                    />
                  </div>
                  <div>
                    <label htmlFor="lc-wa" className="block type-micro text-brand-gray mb-3">No. WhatsApp</label>
                    <input
                      id="lc-wa"
                      type="tel"
                      required
                      value={form.wa}
                      onChange={(e) => setForm({ ...form, wa: e.target.value })}
                      className="w-full border-b hairline-strong bg-transparent py-3 text-[15px] text-brand-dark placeholder:text-brand-mute focus:border-brand-red transition-colors"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="lc-kota" className="block type-micro text-brand-gray mb-3">Kota</label>
                    <input
                      id="lc-kota"
                      type="text"
                      required
                      value={form.kota}
                      onChange={(e) => setForm({ ...form, kota: e.target.value })}
                      className="w-full border-b hairline-strong bg-transparent py-3 text-[15px] text-brand-dark placeholder:text-brand-mute focus:border-brand-red transition-colors"
                      placeholder="Padang, Jambi, ..."
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3.5 text-[13px] font-medium text-white hover:bg-brand-red transition-all duration-300"
                  >
                    Kirim
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                  {activeTab.formUrl !== "#" && (
                    <a
                      href={activeTab.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-editorial text-[13px] font-medium text-brand-dark hover:text-brand-red transition-colors"
                    >
                      Isi form lengkap →
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

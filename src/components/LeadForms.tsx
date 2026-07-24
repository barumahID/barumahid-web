"use client";

import { useState } from "react";
import MitraForm from "./forms/MitraForm";
import CustomerForm from "./forms/CustomerForm";
import DeveloperForm from "./forms/DeveloperForm";

const tabs = [
  { key: "customer", label: "Customer", desc: "Mau sewa atau ikut RTO" },
  { key: "mitra", label: "Mitra", desc: "Punya unit untuk disewakan" },
  { key: "developer", label: "Developer", desc: "Kolaborasi proyek" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function LeadForms({ hideHeader = false }: { hideHeader?: boolean }) {
  const [active, setActive] = useState<TabKey>("customer");

  return (
    <section id="daftar" className="bg-brand-light">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        {!hideHeader && (
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              Daftar Sekarang
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
              Mau Gabung
              <br />
              Sebagai Apa?
            </h2>
            <p className="mt-4 text-brand-gray max-w-sm mx-auto">
              Pilih kategori yang sesuai, isi form-nya, tim barumahID akan segera menghubungi kamu.
            </p>
          </div>
        )}

        <div className={`${hideHeader ? "" : "mt-10"} grid grid-cols-3 gap-3`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                active === tab.key
                  ? "border-brand-dark bg-brand-dark text-white shadow-lg"
                  : "border-brand-dark/10 bg-white text-brand-gray hover:border-brand-dark/30 hover:bg-brand-dark/5"
              }`}
            >
              <p className={`text-xs font-extrabold uppercase tracking-[0.1em] ${active === tab.key ? "text-white" : "text-brand-dark"}`}>
                {tab.label}
              </p>
              <p className={`mt-1 text-xs leading-snug ${active === tab.key ? "text-brand-light/60" : "text-brand-gray/50"}`}>
                {tab.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-brand-dark/10 bg-white p-8 shadow-sm">
          {active === "mitra" && <MitraForm />}
          {active === "customer" && <CustomerForm />}
          {active === "developer" && <DeveloperForm />}
        </div>
      </div>
    </section>
  );
}

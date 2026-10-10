"use client";

import { useMemo, useState } from "react";
import PortfolioCard from "./PortfolioCard";
import { SERVICE_LABEL, type PortfolioItem, type Service } from "@/data/projects";

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [service, setService] = useState<"semua" | Service>("semua");
  const [province, setProvince] = useState("semua");

  const services = useMemo(() => Array.from(new Set(items.map((i) => i.service))), [items]);
  const provinces = useMemo(
    () => Array.from(new Set(items.map((i) => i.province).filter(Boolean))) as string[],
    [items],
  );
  const shown = items.filter(
    (i) => (service === "semua" || i.service === service) && (province === "semua" || i.province === province),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["semua", ...services] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setService(s)}
            aria-pressed={service === s}
            className={`rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors ${
              service === s ? "bg-brand-dark text-white" : "border border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"
            }`}
          >
            {s === "semua" ? "Semua layanan" : SERVICE_LABEL[s]}
          </button>
        ))}
        {provinces.length > 1 && (
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            aria-label="Filter provinsi"
            className="rounded-full border border-brand-dark/15 bg-white px-4 py-2 text-[13.5px] font-bold text-brand-dark"
          >
            <option value="semua">Semua provinsi</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
      <p className="mt-4 text-[13px] text-brand-gray">{shown.length} proyek ditampilkan</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <PortfolioCard key={p.slug} item={p} />
        ))}
      </div>
    </div>
  );
}

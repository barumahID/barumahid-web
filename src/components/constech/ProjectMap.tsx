"use client";

import { useMemo, useState } from "react";
import { CITY_POINTS, INDONESIA_PATH, MAP_HEIGHT, MAP_WIDTH, NEIGHBOR_PATH } from "@/data/indonesia-map";
import { SERVICE_LABEL, type ProjectCity } from "@/data/projects";

// Peta proyek ConTech. Titik = kota proyek atau kota klien (lihat `basis` di data).
// Data dari src/data/projects.ts. Kota baru: tambah di data dan di scripts/gen-indonesia-map.mjs.

const SERVICE_DOT: Record<string, string> = {
  gambar: "bg-[#1A5C9A]",
  struktur: "bg-brand-red",
  renovasi: "bg-[#C25E20]",
  bangun: "bg-[#2D7A4F]",
};

export interface MapOffice {
  cityId: string;
  label: string;
  /** Teks pendek yang ditulis langsung di peta, mis. "Base barumahID" atau "VO" */
  short?: string;
}

// `offices`: titik kantor (mis. kantor pusat Padang, virtual office Tangerang), digambar sebagai cincin putih.
export default function ProjectMap({ cities, offices = [] }: { cities: ProjectCity[]; offices?: MapOffice[] }) {
  const placed = useMemo(() => cities.filter((c) => CITY_POINTS[c.id]), [cities]);
  const [selected, setSelected] = useState<string>(placed[0]?.id ?? "");
  const city = placed.find((c) => c.id === selected) ?? placed[0];

  const byProvince = useMemo(() => {
    const m = new Map<string, ProjectCity[]>();
    for (const c of placed) m.set(c.province, [...(m.get(c.province) ?? []), c]);
    return Array.from(m.entries());
  }, [placed]);

  if (!city) return null;
  const pt = CITY_POINTS[city.id];
  // Titik dekat tepi atas (mis. Kota Kinabalu): label ditaruh di bawah titik supaya tidak terpotong.
  const labelY = pt.y < 40 ? pt.y + 12 : pt.y - 30;
  const placedOffices = offices.filter((o) => CITY_POINTS[o.cityId]);

  return (
    <div>
      <div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`Peta Indonesia dengan ${placed.length} titik kota proyek barumahID`}
          >
            <path d={NEIGHBOR_PATH} fill="#1c1c1c" />
            <path d={INDONESIA_PATH} fill="#353535" stroke="#4d4d4d" strokeWidth="0.6" />
            {placedOffices.map((o) => {
              const p = CITY_POINTS[o.cityId];
              return (
                <g key={o.cityId}>
                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2.5">
                    <title>{o.label}</title>
                  </circle>
                  {o.short && (
                    // Label di kiri titik supaya tidak bertabrakan dengan label kota terpilih (di kanan).
                    <text
                      x={p.x - 17}
                      y={p.y + 4}
                      textAnchor="end"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#ffffff"
                      stroke="#101010"
                      strokeWidth="3"
                      paintOrder="stroke"
                      fontFamily="var(--font-montserrat), sans-serif"
                      pointerEvents="none"
                    >
                      {o.short}
                    </text>
                  )}
                </g>
              );
            })}
            {placed.map((c) => {
              const p = CITY_POINTS[c.id];
              const active = c.id === city.id;
              return (
                <g key={c.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="#C53B3B"
                    className="animate-ping-soft"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  {active && <circle cx={p.x} cy={p.y} r="15" fill="#C53B3B" opacity="0.3" />}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 7 : 5}
                    fill={active ? "#ffffff" : "#C53B3B"}
                    stroke="#C53B3B"
                    strokeWidth={active ? 3 : 0}
                    className="cursor-pointer"
                    onClick={() => setSelected(c.id)}
                  >
                    <title>{`${c.name}, ${c.province}`}</title>
                  </circle>
                </g>
              );
            })}
            {/* Label kota terpilih */}
            <g pointerEvents="none">
              <rect
                x={Math.min(pt.x + 12, MAP_WIDTH - 170)}
                y={labelY}
                width={Math.max(90, city.name.length * 10 + 24)}
                height="26"
                rx="13"
                fill="#ffffff"
              />
              <text
                x={Math.min(pt.x + 12, MAP_WIDTH - 170) + 12}
                y={labelY + 17.5}
                fontSize="14"
                fontWeight="700"
                fill="#141414"
                fontFamily="var(--font-montserrat), sans-serif"
              >
                {city.name}
              </text>
            </g>
          </svg>
          <div className="pointer-events-none absolute bottom-3 left-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/45">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
              Lokasi proyek atau kota klien
            </span>
            {placedOffices.length > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-dashed border-white" aria-hidden="true" />
                Base &amp; VO barumahID
              </span>
            )}
          </div>
        </div>

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Pilihan kota, juga cara utama memilih di HP */}
        <div className="space-y-3 lg:col-span-5">
          {byProvince.map(([prov, list]) => (
            <div key={prov} className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{prov}</span>
              {list.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  aria-pressed={c.id === city.id}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    c.id === city.id ? "bg-white text-brand-dark" : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 text-brand-dark md:p-7 lg:col-span-7" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-red">{city.province}</p>
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-tight">{city.name}</p>
          <p className="mt-2 text-[13px] text-brand-gray">
            {city.projects.length > 0
              ? `${city.projects.length} proyek${city.basis === "klien" ? " untuk klien yang berbasis di kota ini" : ""}`
              : "Kota proyek barumahID. Rincian proyeknya menyusul."}
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {city.projects.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${SERVICE_DOT[p.service]}`} aria-hidden="true" />
                <span>
                  <span className="block text-[14.5px] font-semibold leading-snug">{p.title}</span>
                  <span className="block text-[12px] text-brand-gray">{SERVICE_LABEL[p.service]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

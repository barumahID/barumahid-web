"use client";

import { useState, useSyncExternalStore } from "react";
import { useT } from "@/i18n/LangProvider";
import DrawingCanvas from "./DrawingCanvas";
import MiniCad from "./minicad/MiniCad";

// Kolom kiri "Ceritakan proyekmu": dua tab, Sketsa bebas (kanvas lama) dan Denah otomatis (miniCAD).
// Tautan ?denah=... (dari lampiran form) langsung membuka tab Denah otomatis dengan denah yang sama.

const noop = () => () => {};
const readParam = () => new URLSearchParams(window.location.search).get("denah");

export default function SketchStudio() {
  const t = useT();
  const code = useSyncExternalStore(noop, readParam, () => null);
  const [tab, setTab] = useState<"sketsa" | "denah">("denah");
  const [fromLink, setFromLink] = useState(false);
  if (code && !fromLink) {
    setFromLink(true);
    setTab("denah");
  }

  const tabs = [
    { id: "denah" as const, label: t("Denah otomatis"), hint: "miniCAD" },
    { id: "sketsa" as const, label: t("Sketsa bebas"), hint: t("gambar tangan") },
  ];

  return (
    <div>
      <div className="mb-3 inline-flex rounded-full bg-white/10 p-1" role="tablist" aria-label={t("Cara menggambar")}>
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${tab === x.id ? "bg-white text-brand-dark" : "text-white/75 hover:text-white"}`}
          >
            {x.label}
            <span className={`ml-1.5 hidden text-[11px] font-semibold sm:inline ${tab === x.id ? "text-brand-red" : "text-white/45"}`}>{x.hint}</span>
          </button>
        ))}
      </div>
      {/* Keduanya tetap terpasang supaya isi tidak hilang saat pindah tab */}
      <div hidden={tab !== "denah"}>
        <MiniCad initialCode={code} />
      </div>
      <div hidden={tab !== "sketsa"}>
        <DrawingCanvas />
        <p className="mt-3 text-[13px] text-white/55">
          {t("Sketsa tersimpan di browsermu. Unduh lewat tombol panah bawah, lalu kirimkan ke admin WhatsApp kami setelah mengisi data.")}
        </p>
      </div>
    </div>
  );
}

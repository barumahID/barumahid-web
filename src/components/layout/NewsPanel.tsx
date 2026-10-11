"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Berita, BeritaFeed } from "@/lib/berita";
import { useLang, useT } from "@/i18n/LangProvider";

// Tombol "Kabar" di pojok kanan atas navbar (arahan user Okt 2026): isu terbaru konstruksi dan properti,
// Indonesia dan dunia, 7 hari terakhir. Data diambil dari /api/berita saat panel pertama kali dibuka.
// Panel dirender lewat portal ke body: header memakai backdrop-filter, jadi elemen fixed di dalamnya tidak tampil.

function ago(iso: string, lang: "id" | "en") {
  const rtf = new Intl.RelativeTimeFormat(lang === "en" ? "en" : "id", { numeric: "auto" });
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const hours = Math.round(diff / 3600);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}

function NewsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h13v14a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5zM17 9h3v9a2 2 0 0 1-2 2M7 9h7M7 12h7M7 15h4" />
    </svg>
  );
}

export default function NewsPanel({ solid }: { solid: boolean }) {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"indonesia" | "dunia">("indonesia");
  const [data, setData] = useState<BeritaFeed | null>(null);
  const [failed, setFailed] = useState(false);
  const requested = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen((o) => !o);
    if (!requested.current) {
      requested.current = true;
      fetch("/api/berita")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: BeritaFeed) => setData(d))
        .catch(() => setFailed(true));
    }
  };

  // Tutup saat klik di luar panel atau tekan Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const list: Berita[] = data?.[tab] ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("Kabar terkini konstruksi dan properti")}
        title={t("Kabar terkini")}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          solid ? "border-brand-dark/15 text-brand-dark hover:border-brand-dark" : "border-white/25 text-white hover:bg-white/15"
        } ${open ? (solid ? "border-brand-dark bg-brand-dark text-white" : "bg-white/15") : ""}`}
      >
        <NewsIcon />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t("Kabar terkini konstruksi dan properti")}
          className="fixed inset-x-3 top-[76px] z-[60] flex max-h-[calc(100dvh-96px)] flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white text-brand-dark shadow-[0_24px_60px_-20px_rgba(20,20,20,0.4)] sm:left-auto sm:right-5 sm:w-[400px] sm:max-h-[min(560px,calc(100dvh-110px))] md:right-10 lg:right-[max(3.5rem,calc((100vw-1280px)/2+3.5rem))]"
        >
          <div className="border-b border-brand-dark/10 px-5 pb-3 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-red">{t("Kabar terkini")}</p>
            <p className="mt-1 text-[15px] font-extrabold tracking-tight">{t("Konstruksi dan properti, 7 hari terakhir")}</p>
            <div className="mt-3 flex rounded-full bg-brand-cream p-1 text-[12.5px] font-bold" role="tablist" aria-label={t("Pilih wilayah berita")}>
              {(["indonesia", "dunia"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`flex-1 rounded-full py-1.5 transition-colors ${tab === k ? "bg-brand-dark text-white" : "text-brand-gray hover:text-brand-dark"}`}
                >
                  {k === "indonesia" ? t("Indonesia") : t("Dunia")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {!data && !failed && (
              <ul className="space-y-1 p-3" aria-label={t("Memuat kabar")}>
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="space-y-2 rounded-xl p-3">
                    <span className="block h-3.5 w-11/12 animate-pulse rounded bg-brand-dark/10" />
                    <span className="block h-3.5 w-2/3 animate-pulse rounded bg-brand-dark/10" />
                    <span className="block h-2.5 w-1/3 animate-pulse rounded bg-brand-dark/5" />
                  </li>
                ))}
              </ul>
            )}
            {(failed || (data && list.length === 0)) && (
              <p className="px-5 py-8 text-center text-[13.5px] text-brand-gray">{t("Belum ada kabar baru. Coba lagi nanti.")}</p>
            )}
            {data && list.length > 0 && (
              <ul className="p-2">
                {list.map((b) => (
                  <li key={b.url}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl px-3 py-3 transition-colors hover:bg-brand-cream"
                    >
                      <span className="line-clamp-2 text-[14px] font-semibold leading-snug group-hover:text-brand-red">{b.title}</span>
                      <span className="mt-1 block text-[12px] text-brand-mute">
                        {b.source} · {ago(b.date, lang)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="border-t border-brand-dark/10 px-5 py-3 text-[11.5px] leading-snug text-brand-mute">
            {t("Dirangkum otomatis dari media terpercaya dan diperbarui berkala. Isi berita milik masing-masing media.")}
          </p>
        </div>,
          document.body,
        )}
    </div>
  );
}

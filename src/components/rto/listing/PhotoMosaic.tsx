"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PhotoPlaceholder } from "./ListingCard";

// Foto di halaman detail unit: desktop satu foto besar + empat kecil dan tombol "Lihat semua foto",
// HP berupa geser foto dengan penghitung. Ketuk foto membuka galeri layar penuh (panah, tombol keyboard, Esc).

type Photo = { src: string; alt: string };

/** Sama untuk sampul HP dan desktop: satu unduhan dipakai dua tampilan */
const COVER_SIZES = "(min-width: 768px) 50vw, 100vw";

function Gallery({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = photos.length;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => (v + 1) % n);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [n, onClose]);

  const p = photos[i];
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Galeri foto unit" className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f0f] text-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-semibold hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          Tutup
        </button>
        <span className="text-[14px] font-semibold tabular-nums text-white/80">
          {i + 1} / {n}
        </span>
      </div>
      <div className="relative flex-1">
        <Image key={p.src} src={p.src} alt={p.alt} fill sizes="100vw" className="object-contain" priority />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => setI((i - 1 + n) % n)}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 hover:bg-white/15 md:left-6"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setI((i + 1) % n)}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 hover:bg-white/15 md:right-6"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-3 md:justify-center">
          {photos.map((ph, k) => (
            <button
              key={ph.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Foto ${k + 1}`}
              aria-current={k === i}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-opacity ${k === i ? "opacity-100 ring-2 ring-white" : "opacity-50 hover:opacity-80"}`}
            >
              <Image src={ph.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

export default function PhotoMosaic({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const close = useCallback(() => setOpen(null), []);

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/7] overflow-hidden rounded-2xl bg-brand-cream-warm">
        <PhotoPlaceholder label="Foto unit menyusul" />
      </div>
    );
  }

  const [cover, ...rest] = photos;
  const small = rest.slice(0, 4);
  // Sel kecil melebar kalau foto kurang dari empat supaya kisi tetap penuh
  const span = (k: number) => {
    if (small.length === 1) return "col-span-2 row-span-2";
    if (small.length === 2) return "col-span-2";
    if (small.length === 3 && k === 2) return "col-span-2";
    return "";
  };

  return (
    <>
      {/* HP: geser */}
      <div className="relative -mx-5 md:hidden">
        <div
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto"
        >
          {photos.map((p, k) => (
            <button key={p.src} type="button" onClick={() => setOpen(k)} className="relative h-full w-full shrink-0 snap-center" aria-label={`Buka foto ${k + 1}`}>
              <Image src={p.src} alt={p.alt} fill sizes={k === 0 ? COVER_SIZES : "100vw"} priority={k === 0} className="object-cover" />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-[12px] font-semibold tabular-nums text-white">
          {index + 1} / {photos.length}
        </span>
      </div>

      {/* Desktop: mozaik */}
      <div className={`relative hidden h-[clamp(320px,42vw,500px)] gap-2 overflow-hidden rounded-2xl md:grid ${small.length ? "grid-cols-4 grid-rows-2" : "grid-cols-1"}`}>
        <button type="button" onClick={() => setOpen(0)} className={`group relative overflow-hidden ${small.length ? "col-span-2 row-span-2" : ""}`} aria-label="Buka foto 1">
          <Image src={cover.src} alt={cover.alt} fill priority sizes={COVER_SIZES} className="object-cover transition-[filter] duration-200 group-hover:brightness-90" />
        </button>
        {small.map((p, k) => (
          <button key={p.src} type="button" onClick={() => setOpen(k + 1)} className={`group relative overflow-hidden ${span(k)}`} aria-label={`Buka foto ${k + 2}`}>
            <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover transition-[filter] duration-200 group-hover:brightness-90" />
          </button>
        ))}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg border border-brand-dark bg-white px-3.5 py-2 text-[13.5px] font-semibold text-brand-dark shadow-sm hover:bg-brand-cream"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
              <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
            </svg>
            Lihat semua foto
          </button>
        )}
      </div>

      {open !== null && <Gallery photos={photos} start={open} onClose={close} />}
    </>
  );
}

"use client";

import { useState } from "react";
import { useSaved } from "./useSaved";

// Tombol kecil listing: simpan (hati) dan bagikan.

export function HeartIcon({ filled, className = "h-6 w-6" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <path
        d="M16 28c7-4.7 14-10 14-17a7 7 0 0 0-14-3.4A7 7 0 0 0 2 11c0 7 7 12.3 14 17Z"
        fill={filled ? "#C53B3B" : "rgba(20,20,20,0.45)"}
        stroke="#fff"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/** Hati di atas foto kartu */
export function SaveHeart({ slug, title }: { slug: string; title: string }) {
  const { saved, toggle } = useSaved();
  const on = saved.includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? `Hapus ${title} dari simpanan` : `Simpan ${title}`}
      className="grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
    >
      <HeartIcon filled={on} />
    </button>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-semibold text-brand-dark underline-offset-4 transition-colors hover:bg-brand-dark/[0.05] hover:underline";

/** Simpan di halaman detail */
export function SaveTextButton({ slug, title }: { slug: string; title: string }) {
  const { saved, toggle } = useSaved();
  const on = saved.includes(slug);
  return (
    <button type="button" onClick={() => toggle(slug)} aria-pressed={on} aria-label={on ? `Hapus ${title} dari simpanan` : `Simpan ${title}`} className={pill}>
      <svg viewBox="0 0 32 32" aria-hidden className="h-4 w-4">
        <path
          d="M16 28c7-4.7 14-10 14-17a7 7 0 0 0-14-3.4A7 7 0 0 0 2 11c0 7 7 12.3 14 17Z"
          fill={on ? "#C53B3B" : "none"}
          stroke={on ? "#C53B3B" : "currentColor"}
          strokeWidth="2.6"
        />
      </svg>
      {on ? "Tersimpan" : "Simpan"}
    </button>
  );
}

/** Bagikan: menu bagikan bawaan HP, atau salin link di desktop */
export function ShareButton({ title }: { title: string }) {
  const [note, setNote] = useState("");
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote("Link tersalin");
    } catch {
      setNote("");
      return;
    }
    window.setTimeout(() => setNote(""), 2200);
  };
  return (
    <button type="button" onClick={share} className={pill}>
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      <span aria-live="polite">{note || "Bagikan"}</span>
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BERANDA_TABS, type BerandaId } from "@/data/beranda";

// Dua tab di beranda: Konstruksi ("/") dan Rent-to-Own ("/rent-to-own").
// Menempel di bawah navbar (tinggi 68px, z-50). z-30 supaya tertutup panel menu HP (z-40).
// Sembunyi saat menggulir ke bawah supaya tidak menutupi konten, muncul lagi saat menggulir ke atas.
export default function BerandaTabs({ active }: { active: BerandaId }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) setVisible(true);
      else if (y > lastY + 6) setVisible(false);
      else if (y < lastY - 6) setVisible(true);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Pilih layanan beranda"
      className={`pointer-events-none fixed inset-x-0 top-[76px] z-30 flex justify-center px-4 motion-safe:transition-[transform,opacity] motion-safe:duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-[140%] opacity-0"
      }`}
    >
      <div
        className={`flex gap-1 rounded-full border border-brand-dark/10 bg-white/90 p-1 shadow-[0_10px_30px_-12px_rgba(20,20,20,0.45)] backdrop-blur-md ${
          visible ? "pointer-events-auto" : ""
        }`}
      >
        {BERANDA_TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <Link
              key={t.id}
              href={t.href}
              aria-current={isActive ? "page" : undefined}
              title={t.hint}
              tabIndex={visible ? undefined : -1}
              className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors sm:px-5 ${
                isActive ? "bg-brand-dark text-white" : "text-brand-dark/70 hover:bg-brand-cream hover:text-brand-dark"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import { WA_LINK1 } from "@/constants";

export default function HeroLanding() {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={spotRef}
      className="relative overflow-hidden bg-brand-dark text-white"
    >
      <div className="absolute inset-0 hero-grid" />
      <div className="animate-blob-drift absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="animate-blob-drift absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-red/8 blur-2xl" style={{ animationDelay: "-8s" }} />
      <div className="spotlight absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-20 md:min-h-[90vh] md:flex-row md:items-center md:py-0">
        {/* Left — content (55%) */}
        <div className="flex flex-1 flex-col gap-7 md:max-w-[55%]">
          {/* Pill label */}
          <div className="word-reveal">
            <span
              className="inline-block rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70"
              style={{ animationDelay: "0ms" }}
            >
              Platform Pendamping Kepemilikan Rumah
            </span>
          </div>

          {/* Headline */}
          <h1 className="word-reveal text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block" style={{ animationDelay: "100ms" }}>
              Sewa hari ini.
            </span>
            <span className="mt-2 block text-gradient-red" style={{ animationDelay: "250ms" }}>
              Miliki hunian
            </span>
            <span className="mt-2 block" style={{ animationDelay: "400ms" }}>
              nantinya.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="word-reveal max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            <span className="inline-block" style={{ animationDelay: "550ms" }}>
              barumahID mendampingi perjalanan kepemilikan rumah kamu
              — dari penyewa jadi pemilik, dengan jalur yang sesuai
              kondisi finansialmu.
            </span>
          </p>

          {/* CTAs */}
          <div className="word-reveal flex flex-wrap gap-4" style={{ animationDelay: "700ms" }}>
            <Link
              href="/daftar"
              className="group relative overflow-hidden rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-red/30 transition hover:bg-brand-red-dark hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Mulai Perjalanan Saya
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="arrow-nudge">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="/rto"
              className="group rounded-lg border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/50"
            >
              <span className="flex items-center gap-2">
                Pelajari Program
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="arrow-nudge">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Social proof */}
          <p className="word-reveal text-xs text-white/35" style={{ animationDelay: "850ms" }}>
            <span className="inline-block">
              Melayani wilayah Padang &middot; Jambi &middot; Palembang &middot; Riau
            </span>
          </p>
        </div>

        {/* Right — floating stats card (45%) */}
        <div className="flex flex-1 items-center justify-center md:max-w-[45%]">
          <div className="word-reveal w-full max-w-sm" style={{ animationDelay: "500ms" }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/20 text-brand-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18" />
                      <path d="M5 21V8l7-5 7 5v13" />
                      <path d="M10 21v-6h4v6" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-3xl font-black text-white sm:text-4xl">
                      <CountUp end={12.7} decimals={1} suffix=" Juta" />
                    </p>
                    <p className="mt-1 text-sm text-white/50">Unit backlog perumahan nasional</p>
                    <p className="mt-0.5 text-[10px] text-white/30">Kemenpera</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/20 text-brand-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-3xl font-black text-white sm:text-4xl">
                      <CountUp end={9.9} decimals={1} suffix=" Juta" />
                    </p>
                    <p className="mt-1 text-sm text-white/50">Rumah tangga tanpa hunian layak</p>
                    <p className="mt-0.5 text-[10px] text-white/30">BPS Susenas 2023</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/20 text-brand-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-3xl font-black text-white sm:text-4xl">
                      <CountUp end={4} suffix=" Kota" />
                    </p>
                    <p className="mt-1 text-sm text-white/50">Pilot market barumahID</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/25">
        <span>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1" y="1" width="12" height="18" rx="6" />
          <path d="M7 5v4" className="animate-bounce" />
        </svg>
      </div>
    </section>
  );
}

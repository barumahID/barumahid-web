"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CountUp from "./CountUp";

const line1 = ["Sewa", "hari", "ini."];
const line2 = ["Miliki", "hunian"];
const line3 = ["nantinya."];

export default function Hero() {
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

  const wordAt = (word: string, delay: number, red = false) => (
    <span
      key={`${word}-${delay}`}
      style={{ animationDelay: `${delay}ms` }}
      className={`${red ? "text-gradient-red" : ""} inline-block`}
    >
      {word}
    </span>
  );

  return (
    <section
      id="hero"
      ref={spotRef}
      className="relative overflow-hidden bg-brand-dark text-white"
    >
      {/* Base grid */}
      <div className="absolute inset-0 hero-grid" />

      {/* Animated blobs */}
      <div className="animate-blob-drift absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="animate-blob-drift absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-red/8 blur-2xl" style={{ animationDelay: "-8s" }} />

      {/* Mouse spotlight overlay */}
      <div className="spotlight absolute inset-0" aria-hidden="true" />

      {/* Floating geometry */}
      <div className="animate-float-slow absolute right-10 top-20 hidden opacity-25 lg:block">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <rect x="1" y="1" width="198" height="198" rx="18" stroke="#C53B3B" strokeWidth="2" strokeDasharray="8 6" />
          <rect x="35" y="35" width="130" height="130" rx="12" stroke="#C53B3B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <circle cx="100" cy="100" r="24" stroke="#C53B3B" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24 md:py-36">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 word-reveal">
          <span className="block h-px w-10 bg-brand-red" />
          <span
            className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-light/70"
            style={{ animationDelay: "0ms" }}
          >
            ConsTech · PropTech · GreenTech — Padang
          </span>
        </div>

        {/* Headline — staggered word reveal */}
        <h1 className="word-reveal max-w-4xl text-5xl font-extrabold leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">
            {line1.map((w, i) => (
              <span key={w} className="mr-[0.25em]">
                {wordAt(w, 100 + i * 100)}
              </span>
            ))}
          </span>
          <span className="mt-2 block">
            {line2.map((w, i) => (
              <span key={w} className="mr-[0.25em]">
                {wordAt(w, 400 + i * 100, true)}
              </span>
            ))}
          </span>
          <span className="mt-2 block">
            {line3.map((w, i) => (
              <span key={w} className="mr-[0.25em]">
                {wordAt(w, 650 + i * 100)}
              </span>
            ))}
          </span>
        </h1>

        <p className="word-reveal max-w-lg text-base text-brand-light/60 sm:text-lg">
          <span style={{ animationDelay: "800ms" }} className="inline-block">
            barumahID menghadirkan hunian yang bisa kamu sewa sekarang, sambil
            menabung DP untuk memilikinya nanti — didukung layanan konstruksi
            profesional{" "}
            <strong className="text-brand-light/85">LBAG</strong>.
          </span>
        </p>

        {/* CTAs */}
        <div
          className="word-reveal flex flex-wrap gap-4 pt-2"
          style={{ animationDelay: "900ms" }}
        >
          <Link
            href="/daftar"
            className="group relative overflow-hidden rounded-full bg-brand-red px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-red/40 transition hover:scale-105"
            style={{ animationDelay: "950ms" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Isi Form Sekarang
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="arrow-nudge">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="/program-rto"
            className="group rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/50"
            style={{ animationDelay: "1000ms" }}
          >
            <span className="flex items-center gap-2">
              Kenalan Program RTO
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="arrow-nudge">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="word-reveal mt-6 flex flex-wrap gap-10 border-t border-white/10 pt-8"
          style={{ animationDelay: "1100ms" }}
        >
          <div>
            <p className="text-3xl font-extrabold text-white sm:text-4xl">
              <CountUp end={8} suffix="–14%" />
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-brand-light/40">Fee LBAG</p>
          </div>
          <div className="border-l border-white/10 pl-10">
            <p className="text-3xl font-extrabold text-brand-red sm:text-4xl">
              <CountUp end={25} suffix="%" />
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-brand-light/40">Sewa → DP</p>
          </div>
          <div className="border-l border-white/10 pl-10">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">
              <CountUp end={4} suffix=" kota" />
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-brand-light/40">Pilot area</p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-light/30">
        <span>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1" y="1" width="12" height="18" rx="6" />
          <path d="M7 5v4" className="animate-bounce" />
        </svg>
      </div>
    </section>
  );
}

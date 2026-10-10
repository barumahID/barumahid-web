"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Hero scroll-expand dengan DUA gambar (arahan user): dua panel kecil di tengah membesar berdampingan
// saat digulir, sampai memenuhi layar. Latar terang dan bersih (gaya tikalindustries.com).
// Logika scroll sama dengan hero lama: halaman terkunci di atas sampai panel terbuka penuh.

export interface HeroPanel {
  href: string;
  image: string;
  alt: string;
  audience: string;
  name: string;
  headline: string;
  cta: string;
  badge?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function DualScrollHero({
  panels,
  title,
  tagline,
  bgImageSrc,
  children,
}: {
  panels: HeroPanel[];
  title: string;
  tagline: string;
  bgImageSrc?: string;
  children?: ReactNode;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });

  // Buka penuh langsung kalau halaman dibuka dengan anchor atau pengguna memilih kurangi animasi.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.location.hash && !reduce) return;
    const id = requestAnimationFrame(() => {
      setScrollProgress(1);
      setShowContent(true);
      setExpanded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const measure = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const apply = (next: number) => {
      setScrollProgress(next);
      if (next >= 1) {
        setExpanded(true);
        setShowContent(true);
      } else if (next < 0.75) {
        setShowContent(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        apply(clamp01(scrollProgress + e.deltaY * 0.0009));
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (expanded && deltaY < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        apply(clamp01(scrollProgress + deltaY * (deltaY < 0 ? 0.008 : 0.005)));
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    // Pengguna keyboard langsung dibuka penuh supaya tidak terkunci di atas halaman.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expanded) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar", "End", "Tab"].includes(e.key)) apply(1);
    };

    const handleScroll = () => {
      if (!expanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollProgress, expanded, touchStartY]);

  const p = scrollProgress;
  const mobile = viewport.w < 768;
  const nav = 68;
  const gap = mobile ? 10 : 16;
  const titleBlock = mobile ? 96 : 128;
  // Ukuran awal ikut tinggi layar supaya panel tidak terpotong atau menabrak judul di layar pendek.
  const h0 = Math.min(mobile ? 180 : 290, Math.max(140, viewport.h - nav - titleBlock - 88));
  const w0 = h0 * (mobile ? 136 / 180 : 220 / 290);
  const maxW = Math.min(1200, viewport.w - (mobile ? 24 : 64));
  const wF = (maxW - gap) / 2;
  const hF = Math.max(h0, viewport.h - nav - (mobile ? 40 : 48));
  const panelW = w0 + p * (wF - w0);
  const panelH = h0 + p * (hF - h0);
  // Pusat panel turun sedikit di awal supaya judul punya ruang di atasnya.
  const center0 = Math.max(viewport.h * 0.6, nav + 12 + titleBlock + 24 + h0 / 2);
  const centerY = center0 + p * (nav + (viewport.h - nav) / 2 - center0);
  const titleShift = p * (mobile ? 60 : 40);
  const details = clamp01((p - 0.45) / 0.45);

  const [first, ...rest] = title.split(" ");
  const titleParts = rest.length ? [first, rest.join(" ")] : [title.replace(/ID$/, ""), title.endsWith("ID") ? "ID" : ""];

  return (
    <div className="overflow-x-hidden bg-brand-cream">
      <section className="relative h-[100dvh] w-full">
        {/* Latar bersih ala Tikal: polos + grid halus. Foto latar opsional, sangat samar. */}
        <div className="pointer-events-none absolute inset-0" style={{ opacity: 1 - p }} aria-hidden="true">
          {bgImageSrc && (
            <>
              <Image src={bgImageSrc} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.14] grayscale" />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/40 via-brand-cream/70 to-brand-cream" />
            </>
          )}
          <div className="hero-grid-light absolute inset-0" />
        </div>

        {/* Judul di atas panel, bergeser ke samping dan memudar saat panel membesar */}
        <div
          className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center text-center"
          style={{ top: Math.max(nav + 12, centerY - panelH / 2 - (mobile ? 110 : 150)), opacity: clamp01(1 - p * 1.6) }}
        >
          <h1 className="flex text-5xl font-black leading-none tracking-tight md:text-7xl">
            <span className="text-brand-dark" style={{ transform: `translateX(-${titleShift}vw)` }}>
              {titleParts[0]}
            </span>
            {titleParts[1] && (
              <span className="text-brand-red" style={{ transform: `translateX(${titleShift}vw)` }}>
                {titleParts[1]}
              </span>
            )}
          </h1>
          <p className="mt-4 text-[14px] font-semibold tracking-wide text-brand-gray md:text-[15px]">{tagline}</p>
        </div>

        {/* Dua panel */}
        <div
          className="absolute left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2"
          style={{ top: centerY, width: panelW * 2 + gap, height: panelH, gap }}
        >
          {panels.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group relative flex min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-brand-cream-warm text-white shadow-[0_30px_60px_-30px_rgba(20,20,20,0.55)] md:rounded-3xl ${
                expanded ? "md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.35]" : ""
              }`}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority
                sizes="(min-width: 768px) 60vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
              {s.badge && (
                <span
                  className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-brand-dark md:left-6 md:top-6 md:text-[11px]"
                  style={{ opacity: details }}
                >
                  {s.badge}
                </span>
              )}
              <div className="relative p-3.5 md:p-9">
                <p
                  className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 md:block"
                  style={{ opacity: details }}
                >
                  {s.audience}
                </p>
                <h2
                  className="font-extrabold leading-none tracking-tight md:mt-3"
                  style={{ fontSize: mobile ? 15 + p * 9 : 20 + p * 26 }}
                >
                  {s.name}
                </h2>
                <div style={{ opacity: details }}>
                  <p className="mt-2 text-[13px] font-semibold leading-snug md:mt-3 md:text-[19px]">{s.headline}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white md:mt-6 md:gap-2 md:px-6 md:py-3 md:text-[14px]">
                    {s.cta}
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Petunjuk gulir */}
        <p
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center text-[12px] font-semibold text-brand-mute"
          style={{ opacity: clamp01(1 - p * 3) }}
        >
          Gulir untuk membuka
        </p>
      </section>

      <motion.section
        className="flex w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        {children}
      </motion.section>
    </div>
  );
}

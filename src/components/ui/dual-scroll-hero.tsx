"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "@/i18n/Link";
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { useT } from "@/i18n/LangProvider";

// Hero scroll-expand dengan DUA gambar (arahan user): dua panel kecil di tengah membesar berdampingan
// saat digulir, sampai memenuhi layar. Latar terang dan bersih (gaya tikalindustries.com).
// Halaman terkunci di atas sampai panel terbuka penuh.
// Kehalusan (arahan user Okt 2026, acuan rasa gerak komponen Framer): gulir hanya menggeser TARGET, tampilan
// mengikuti lewat pegas (spring), jadi satu putaran roda mouse tidak lagi melompat patah-patah. Semua gaya
// dihitung dari motion value tanpa render ulang React per frame. Panel sedikit miring seperti map terbuka lalu
// rata saat membesar, foto di dalamnya ikut zoom pelan. Usapan di HP punya dorongan (fling) kecil, dan kalau
// gulir berhenti setelah lebih dari separuh jalan, panel menyelesaikan sendiri sampai terbuka penuh.

export interface HeroPanel {
  href: string;
  image: string;
  alt: string;
  focus?: string;
  audience: string;
  name: string;
  headline: string;
  cta: string;
  badge?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Kepekaan gulir: progres per piksel roda mouse, per piksel usapan (buka, tutup). */
const WHEEL = 0.001;
const TOUCH_OPEN = 0.005;
const TOUCH_CLOSE = 0.008;
/** Pegas tanpa pantulan (overdamped), supaya panel tidak melewati ukuran akhir. */
const SPRING = { stiffness: 110, damping: 26, mass: 1, restDelta: 0.0005 };

/** Ukuran dan posisi panel di awal dan akhir, mengikuti ukuran layar. */
function geometry(w: number, h: number, hasSubline: boolean) {
  const mobile = w < 768;
  const nav = 68;
  const gap = mobile ? 10 : 16;
  const titleBlock = hasSubline ? (mobile ? 174 : 158) : mobile ? 96 : 128;
  // Ukuran awal ikut tinggi layar supaya panel tidak terpotong atau menabrak judul di layar pendek.
  const h0 = Math.min(mobile ? 180 : 290, Math.max(140, h - nav - titleBlock - 88));
  const w0 = h0 * (mobile ? 136 / 180 : 220 / 290);
  const maxW = Math.min(1200, w - (mobile ? 24 : 64));
  const wF = (maxW - gap) / 2;
  const hF = Math.max(h0, h - nav - (mobile ? 40 : 48));
  // Pusat panel turun sedikit di awal supaya judul punya ruang di atasnya.
  const center0 = Math.max(h * 0.6, nav + 12 + titleBlock + 24 + h0 / 2);
  const centerF = nav + (h - nav) / 2;
  return { mobile, nav, gap, titleBlock, h0, w0, wF, hF, center0, centerF };
}

export default function DualScrollHero({
  panels,
  title,
  tagline,
  subline,
  background,
  children,
}: {
  panels: HeroPanel[];
  title: string;
  tagline: string;
  subline?: string;
  background?: ReactNode;
  children?: ReactNode;
}) {
  const t = useT();
  const [showContent, setShowContent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Ukuran layar baru diketahui setelah halaman jalan di browser (null saat render server). Isi hero muncul pelan
  // setelah diukur, supaya di HP panel tidak terlihat meloncat dari ukuran laptop ke ukuran HP.
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const ready = viewport !== null;
  const g = useMemo(() => geometry(viewport?.w ?? 1280, viewport?.h ?? 800, Boolean(subline)), [viewport, subline]);

  // target = ke mana pengguna menggulir; progress = posisi yang tampil, mengejar target dengan pegas.
  const target = useMotionValue(0);
  const progress = useSpring(target, SPRING);
  const expandedRef = useRef(false);
  const shownRef = useRef(false);

  // Panel dianggap terbuka penuh (halaman boleh digulir) saat tampilan sudah sampai di ujung.
  useMotionValueEvent(progress, "change", (v) => {
    if (!expandedRef.current && v >= 0.996 && target.get() >= 1) {
      expandedRef.current = true;
      setExpanded(true);
    }
    if (!shownRef.current && v >= 0.97) {
      shownRef.current = true;
      setShowContent(true);
    } else if (shownRef.current && v < 0.75) {
      shownRef.current = false;
      setShowContent(false);
    }
  });

  // Buka penuh langsung kalau halaman dibuka dengan anchor atau pengguna memilih kurangi animasi.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.location.hash && !reduce) return;
    const id = requestAnimationFrame(() => {
      target.jump(1);
      progress.jump(1);
      expandedRef.current = true;
      shownRef.current = true;
      setExpanded(true);
      setShowContent(true);
    });
    return () => cancelAnimationFrame(id);
  }, [target, progress]);

  useEffect(() => {
    const measure = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let touchY: number | null = null;
    let lastT = 0;
    let velocity = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const move = (delta: number) => {
      target.set(clamp01(target.get() + delta));
      // Sudah di ujung (tidak ada perubahan nilai lagi): langsung anggap terbuka supaya halaman tidak terkunci
      if (!expandedRef.current && target.get() >= 1 && progress.get() >= 0.996) {
        expandedRef.current = true;
        setExpanded(true);
      }
    };
    // Gulir berhenti di tengah jalan: lewat separuh, selesaikan sampai terbuka penuh.
    const settleLater = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (!expandedRef.current && target.get() >= 0.55) target.set(1);
      }, 260);
    };
    const collapse = () => {
      expandedRef.current = false;
      setExpanded(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // Ctrl + roda = zoom browser, biarkan
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = Math.max(-160, Math.min(160, e.deltaY * unit));
      if (expandedRef.current) {
        if (dy < 0 && window.scrollY <= 5) {
          e.preventDefault();
          collapse();
          move(dy * WHEEL);
        }
        return;
      }
      e.preventDefault();
      move(dy * WHEEL);
      settleLater();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      lastT = e.timeStamp;
      velocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      if (expandedRef.current) {
        if (dy < -20 && window.scrollY <= 5) {
          e.preventDefault();
          collapse();
          touchY = y;
        }
        return;
      }
      e.preventDefault();
      const step = dy * (dy < 0 ? TOUCH_CLOSE : TOUCH_OPEN);
      move(step);
      velocity = step / Math.max(8, e.timeStamp - lastT);
      lastT = e.timeStamp;
      touchY = y;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Dorongan kecil setelah jari dilepas, seperti gulir biasa di HP
      if (touchY !== null && !expandedRef.current && e.timeStamp - lastT < 90) move(Math.max(-0.35, Math.min(0.35, velocity * 140)));
      touchY = null;
      if (!expandedRef.current) settleLater();
    };

    // Pengguna keyboard langsung dibuka penuh supaya tidak terkunci di atas halaman.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedRef.current) return;
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar", "End", "Tab"].includes(e.key)) target.set(1);
    };

    // Selama panel belum terbuka, halaman tetap di atas (tanpa animasi gulir halus milik html)
    const handleScroll = () => {
      if (!expandedRef.current && window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [target, progress]);

  // Semua nilai turunan dihitung dari progress tanpa render ulang
  const panelW = (p: number) => lerp(g.w0, g.wF, p);
  const panelH = (p: number) => lerp(g.h0, g.hF, p);
  const centerY = (p: number) => lerp(g.center0, g.centerF, p);
  const groupW = useTransform(progress, (p) => panelW(p) * 2 + g.gap);
  const groupH = useTransform(progress, panelH);
  const groupY = useTransform(progress, (p) => centerY(p) - panelH(p) / 2);
  const titleY = useTransform(progress, (p) => Math.max(g.nav + 12, centerY(p) - panelH(p) / 2 - g.titleBlock - (g.mobile ? 14 : 22)));
  const titleOpacity = useTransform(progress, (p) => clamp01(1 - p * 1.6));
  const titleLeft = useTransform(progress, (p) => `${-p * (g.mobile ? 60 : 40)}vw`);
  const titleRight = useTransform(progress, (p) => `${p * (g.mobile ? 60 : 40)}vw`);
  const backdropOpacity = useTransform(progress, (p) => 1 - p);
  const hintOpacity = useTransform(progress, (p) => clamp01(1 - p * 3));
  const details = useTransform(progress, (p) => clamp01((p - 0.45) / 0.45));
  const nameSize = useTransform(progress, (p) => (g.mobile ? 15 + p * 9 : 20 + p * 26));
  // Miring seperti map terbuka (sisi dalam sedikit menjauh), rata saat membesar
  const tiltLeft = useTransform(progress, (p) => (1 - p) ** 2 * (g.mobile ? 6 : 9));
  const tiltRight = useTransform(tiltLeft, (v) => -v);
  const photoZoom = useTransform(progress, (p) => 1.1 - p * 0.1);

  const [first, ...rest] = title.split(" ");
  const titleParts = rest.length ? [first, rest.join(" ")] : [title.replace(/ID$/, ""), title.endsWith("ID") ? "ID" : ""];

  return (
    <div className="overflow-x-hidden bg-brand-cream">
      <section className="relative h-[100dvh] w-full overflow-hidden">
        {/* Latar: diisi lewat prop `background` (beranda pakai HeroBackdrop). Memudar saat panel membesar. */}
        <motion.div className="pointer-events-none absolute inset-0 will-change-[opacity]" style={{ opacity: backdropOpacity }} aria-hidden="true">
          {background ?? <div className="hero-grid-light absolute inset-0" />}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Judul di atas panel, bergeser ke samping dan memudar saat panel membesar */}
          <motion.div
            className="absolute inset-x-0 top-0 z-10 flex flex-col items-center text-center will-change-transform"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <h1 className="flex text-5xl font-black leading-none tracking-tight md:text-7xl">
              <motion.span className="text-brand-dark" style={{ x: titleLeft }}>
                {titleParts[0]}
              </motion.span>
              {titleParts[1] && (
                <motion.span className="text-brand-red" style={{ x: titleRight }}>
                  {titleParts[1]}
                </motion.span>
              )}
            </h1>
            <p className="mt-4 px-4 text-[16px] font-bold tracking-[-0.01em] text-brand-dark md:text-[21px]">
              {/* Tiap kalimat satu baris di HP supaya tidak terpotong di tengah */}
              {tagline.split(/(?<=\.)\s+/).map((part, i) => (
                <span key={part} className="block md:inline">
                  {i > 0 && <span className="hidden md:inline"> </span>}
                  {part}
                </span>
              ))}
            </p>
            {subline && <p className="mx-auto mt-1.5 max-w-[340px] px-4 text-[13px] font-medium text-balance text-brand-gray md:max-w-none md:text-[15px]">{subline}</p>}
          </motion.div>

          {/* Dua panel */}
          <motion.div
            className="pointer-events-auto absolute left-1/2 top-0 z-20 flex will-change-transform"
            style={{ x: "-50%", y: groupY, width: groupW, height: groupH, gap: g.gap }}
          >
            {panels.map((s, i) => (
              <motion.div
                key={s.href}
                className={`relative min-w-0 flex-1 ${expanded ? "md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.35]" : ""}`}
                style={{ rotateY: i === 0 ? tiltLeft : tiltRight, transformPerspective: 1300 }}
                whileHover={expanded ? undefined : { scale: 1.03, transition: { type: "spring", stiffness: 260, damping: 22 } }}
              >
                <Link
                  href={s.href}
                  className="group absolute inset-0 flex flex-col justify-end overflow-hidden rounded-2xl bg-brand-cream-warm text-white shadow-[0_30px_60px_-30px_rgba(20,20,20,0.55)] md:rounded-3xl"
                >
                  <motion.div className="absolute inset-0 will-change-transform" style={{ scale: photoZoom }}>
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      preload
                      sizes="(min-width: 768px) 70vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={s.focus ? { objectPosition: s.focus } : undefined}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
                  {s.badge && (
                    <motion.span
                      className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-brand-dark md:left-6 md:top-6 md:text-[11px]"
                      style={{ opacity: details }}
                    >
                      {s.badge}
                    </motion.span>
                  )}
                  <div className="relative p-3.5 md:p-9">
                    <motion.p
                      className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 md:block"
                      style={{ opacity: details }}
                    >
                      {s.audience}
                    </motion.p>
                    <motion.h2 className="font-extrabold leading-none tracking-tight md:mt-3" style={{ fontSize: nameSize }}>
                      {s.name}
                    </motion.h2>
                    <motion.div style={{ opacity: details }}>
                      <p className="mt-2 text-[13px] font-semibold leading-snug md:mt-3 md:text-[19px]">{s.headline}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white md:mt-6 md:gap-2 md:px-6 md:py-3 md:text-[14px]">
                        {s.cta}
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Petunjuk gulir */}
          <motion.p
            className="pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center text-[12px] font-semibold text-brand-mute"
            style={{ opacity: hintOpacity }}
          >
            {t("Gulir untuk membuka")}
          </motion.p>
        </motion.div>
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

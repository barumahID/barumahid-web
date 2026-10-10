"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

// Latar hero beranda (arahan user): foto gedung + gelombang merah yang sudah di-blur, logo PT samar,
// dan animasi halus: zoom pelan, garis gelombang yang tergambar, cahaya bergerak, parallax ikut kursor.
// Foto sudah di-blur di filenya (bukan CSS blur) supaya ringan saat dianimasikan.
export interface BackdropLogo {
  src: string;
  w: number;
  h: number;
}

export default function HeroBackdrop({ image, logo }: { image: string; logo: BackdropLogo }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const bgX = useTransform(sx, (v) => v * -22);
  const bgY = useTransform(sy, (v) => v * -14);
  const logoX = useTransform(sx, (v) => v * 30);
  const logoY = useTransform(sy, (v) => v * 20);
  const lineX = useTransform(sx, (v) => v * 12);

  // Parallax hanya untuk mouse (bukan layar sentuh) dan kalau pengguna tidak memilih kurangi animasi.
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute -inset-10" style={{ x: bgX, y: bgY }}>
        <div className="hero-bg-drift absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-[70%_50%] opacity-55" />
        </div>
      </motion.div>

      {/* Krem di tengah supaya judul dan panel tetap jelas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_42%,rgba(245,242,237,0.9),rgba(245,242,237,0.55)_62%,rgba(245,242,237,0.2))]" />
      <div className="hero-grid-light absolute inset-0" />

      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />

      {/* Garis gelombang, gema dari gelombang merah di foto */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        style={{ x: lineX }}
      >
        <path
          className="hero-line-draw"
          pathLength={1}
          d="M1130 -40C860 150 790 360 930 520S1080 850 850 960"
          stroke="#C53B3B"
          strokeOpacity="0.45"
          strokeWidth="1.6"
        />
        <path
          className="hero-line-flow"
          d="M1190 -40C920 160 850 380 990 540S1140 870 910 960"
          stroke="#141414"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />
        <path
          className="hero-line-draw hero-line-delay"
          pathLength={1}
          d="M-60 690C190 620 400 760 640 700S980 610 1180 700"
          stroke="#C53B3B"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />
      </motion.svg>

      {/* Logo PT, samar */}
      <motion.div
        className="absolute left-1/2 top-[84%] w-[50vw] max-w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] md:left-[5%] md:top-[50%] md:w-[min(25vw,360px)] md:max-w-none md:translate-x-0"
        style={{ x: logoX, y: logoY }}
      >
        <div className="hero-float">
          <Image src={logo.src} width={logo.w} height={logo.h} alt="" className="h-auto w-full" />
        </div>
      </motion.div>
    </div>
  );
}

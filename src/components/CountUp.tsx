"use client";

import { useEffect, useRef, useState } from "react";

// Angka akhir SELALU dirender sejak server (dibaca Google, preview link, dan pengguna tanpa JS).
// Animasi naik hanya hiasan: dijalankan kalau elemen belum terlihat saat halaman dimuat
// dan pengguna tidak memilih "kurangi animasi". Ini perbaikan bug "0+" di versi sebelumnya.

export default function CountUp({
  end,
  duration = 1400,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    setValue(0);
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(end * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      setValue(end);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat("id-ID").format(value)}
      {suffix}
    </span>
  );
}

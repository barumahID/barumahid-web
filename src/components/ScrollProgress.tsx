"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? (scrolled / max) * 100 : 0;
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-red via-red-400 to-brand-red shadow-[0_0_10px_rgba(197,59,59,0.6)] transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({
  end,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "",
}: {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startT = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - startT) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(end * eased);
            if (t < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals).replace(".", separator === "," ? "," : ".")
    : Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator === "," ? "." : ",");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

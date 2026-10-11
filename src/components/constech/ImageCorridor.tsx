import Image from "next/image";

// Koridor foto 3D (referensi visual "Image Corridor" dari user, dibuat ulang dengan CSS 3D):
// dua dinding panel foto bergerak dari titik hilang ke arah penonton, terus-menerus.
// Gerak dari CSS (lihat .corridor-* di globals.css), jadi ringan. Reduced motion: diam di tempat.

export default function ImageCorridor({
  images,
  rows = 14,
  duration = 28,
  label,
}: {
  images: { src: string; alt: string }[];
  rows?: number;
  duration?: number;
  label: string;
}) {
  const panels = Array.from({ length: rows }, (_, r) =>
    [-1, 1].map((side) => {
      const slot = r * 2 + (side > 0 ? 1 : 0);
      // Sisi kanan digeser setengah langkah supaya kiri-kanan tidak kembar
      const delay = -((r + (side > 0 ? 0.5 : 0)) / rows) * duration;
      return { key: `${r}-${side}`, side, img: images[slot % images.length], delay };
    }),
  ).flat();

  return (
    <div className="relative h-[360px] overflow-hidden rounded-3xl bg-[#0e0e0e] md:h-[520px]" role="img" aria-label={label}>
      <div className="corridor-view absolute inset-0">
        <div className="corridor-stage absolute inset-0">
          {panels.map((p) => (
            <div
              key={p.key}
              className={`corridor-panel ${p.side < 0 ? "corridor-left" : "corridor-right"}`}
              style={{ animationDelay: `${p.delay}s`, animationDuration: `${duration}s` }}
            >
              <Image src={p.img.src} alt="" fill sizes="(min-width: 768px) 280px, 150px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      {/* Cahaya di titik hilang dan pudar di tepi */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_18%_22%_at_50%_50%,rgba(197,59,59,0.25),transparent)]" />
      <div className="corridor-fade pointer-events-none absolute inset-0" />
    </div>
  );
}

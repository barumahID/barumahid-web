// Ikon garis sederhana untuk halaman Ekosistem (gaya infografis barumahID: garis tebal, ujung membulat).
const PATHS: Record<string, string> = {
  desain: "M4 20V5a1 1 0 0 1 1-1h11l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM8 9h5M8 13h8M8 17h4M15 4v4h4",
  renovasi: "M5 4h11a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM17 6.5h2v5h-7v3M11 14.5h2V21h-2z",
  bangun: "M3 21h18M6 21V9l6-5 6 5v12M10 21v-6h4v6M3 9h4M17 9h4",
  cari: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4M9 9.5a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.5M11 15h.01",
  biaya: "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM7 6h10v4H7zM8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01M16 17.5h.01",
  waktu: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2",
  dompet: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7zM4 7l11-3v3M16 13.5h.01",
  konsultasi: "M4 13a8 8 0 0 1 16 0M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2zM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM17 18c0 2-2 3-5 3",
  harga: "M3 12l9-9h8v8l-9 9zM16 7.5h.01M8.5 12.5c1.5 1.5 3 .5 3-.5s-2-1.5-2-2.5 1.5-1.5 2.5-.5",
  teknologi: "M4 20V9l5-3v14M9 20V4l7 3v13M16 20v-9l4 2v7M3 20h18M12 9h1M12 12h1M12 15h1",
  interaktif: "M3 9a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-3l-3-2-3 2H6a3 3 0 0 1-3-3zM8 11h.01M16 11h.01",
  hijau: "M12 21V11M12 11C12 6 8 4 4 4c0 5 3 7 8 7zM12 14c0-4 3-7 8-7 0 5-3 7-8 7",
  mitra: "M3 11l4-4 5 3 5-3 4 4M7 7l-3 9 4 3 4-3 4 3 4-3-3-9M9 13l3 2 3-2",
  bim: "M3 5h18v11H3zM8 20h8M12 16v4M9 8l3-1.5L15 8v3.5L12 13l-3-1.5zM12 9.5V13M9 8l3 1.5L15 8",
  efisien: "M4 20V8M9 20v-6M14 20v-9M19 20v-4M3 20h18M15 4l4 4M19 4v4h-4",
  fleksibel: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4",
  rumah: "M3 11l9-7 9 7M5 9.5V20h8M15 13a3 3 0 1 1 3 3l-2 2v2h-2v-2h-1",
  lampu: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  perisai: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
};

export default function LineIcon({ name, size = 28, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.lampu} />
    </svg>
  );
}

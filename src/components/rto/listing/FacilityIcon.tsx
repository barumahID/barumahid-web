// Ikon garis untuk fasilitas unit (nama sama dengan UNIT_FACILITIES di src/lib/rto.ts). Fasilitas lain memakai tanda centang.

const PATHS: Record<string, string> = {
  WiFi: "M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01",
  AC: "M3 5h18v7H3zM6 9h12M7 15v2M12 15v4M17 15v2",
  "Kamar mandi dalam": "M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 3.5-1.3M8 21l1-2M16 21l-1-2",
  "Kamar mandi bersama": "M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 3.5-1.3M8 21l1-2M16 21l-1-2",
  "Parkir motor": "M5 17.5a2.5 2.5 0 1 0 0-.01M19 17.5a2.5 2.5 0 1 0 0-.01M7.5 17.5h7l3-6h-4l-2-4H8M12.5 7.5H15",
  "Parkir mobil": "M3 16v-3l2-5h14l2 5v3zM3 16v2M21 16v2M7 16h.01M17 16h.01M5 13h14",
  "Dapur bersama": "M4 10h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7zM2 10h20M9 6V4M12 6V3M15 6V4",
  Laundry: "M5 3h14v18H5zM5 7h14M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8M8 5h.01",
  Penjaga: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6zM9 12l2 2 4-4",
  "Tempat tidur": "M3 18V8M3 14h18v4M21 18v-6a2 2 0 0 0-2-2h-8v4M7 11.5a1.5 1.5 0 1 0 0-.01",
  Lemari: "M5 3h14v17H5zM12 3v17M10 11v2M14 11v2M7 20v1M17 20v1",
};

export default function FacilityIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? "M5 12l4 4 10-10"} />
    </svg>
  );
}

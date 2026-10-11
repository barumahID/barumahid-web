import Image from "next/image";

// Simbol logo PT Inditek Bluprim Mahaksa. Warnanya menyesuaikan latar, sama seperti logo barumahID:
// latar terang = warna asli (biru), latar gelap = putih.
export default function PtMark({ onDark = false, className = "h-11 w-auto" }: { onDark?: boolean; className?: string }) {
  return (
    <Image
      src={onDark ? "/brand/logo-pt-mark-white.webp" : "/brand/logo-pt-mark.webp"}
      alt=""
      width={105}
      height={160}
      className={className}
    />
  );
}

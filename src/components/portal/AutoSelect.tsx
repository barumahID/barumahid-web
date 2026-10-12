"use client";

import { useState, useTransition } from "react";

// Pilihan yang langsung tersimpan saat diubah (status tim, status mitra, status formulir, peran akun).
// Sebelumnya memakai <form> + tombol Simpan: setelah aksi selesai React mereset form ke nilai awal halaman, jadi
// pilihan tampak "balik sendiri" walau database sudah berubah (laporan user). Di sini nilai dikendalikan state,
// disinkronkan saat nilai dari server berubah, dan dikembalikan bila penyimpanan gagal.

export default function AutoSelect({
  action,
  fields,
  name,
  value,
  options,
  label,
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  const [current, setCurrent] = useState(value);
  const [server, setServer] = useState(value);
  const [note, setNote] = useState<"" | "ok" | "fail">("");
  const [pending, start] = useTransition();

  // Nilai dari server berubah (misalnya setelah revalidasi): ikuti nilai terbaru
  if (value !== server) {
    setServer(value);
    setCurrent(value);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={current}
        aria-label={label}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const before = current;
          setCurrent(next);
          setNote("");
          const fd = new FormData();
          Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
          fd.append(name, next);
          start(async () => {
            try {
              await action(fd);
              setNote("ok");
            } catch {
              setCurrent(before);
              setNote("fail");
            }
          });
        }}
        className="rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px] disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="min-w-[64px] text-[11.5px] font-semibold" aria-live="polite">
        {pending ? <span className="text-brand-mute">Menyimpan...</span> : note === "ok" ? <span className="text-[#2D7A4F]">Tersimpan ✓</span> : note === "fail" ? <span className="text-brand-red">Gagal</span> : null}
      </span>
    </span>
  );
}

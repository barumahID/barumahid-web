"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { setUnitPhotos, uploadUnitPhoto } from "@/app/portal/rto-actions";

// Foto unit kos untuk listing publik. Foto dikecilkan di browser (maks 1600 px, WebP, di bawah 950 KB) sebelum
// dikirim, jadi batas 1 MB server action cukup dan halaman listing tetap ringan. Foto pertama jadi sampul.
// Pemilik bisa mengubah foto sebelum unit tayang; setelah itu hanya tim (dijaga juga di database).

const MAX_PHOTOS = 12;
const MAX_BYTES = 950_000;

async function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Kecilkan foto. Browser lama yang tidak bisa membuat WebP otomatis memakai JPEG. */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bitmap) throw new Error("Format foto belum didukung. Pakai JPG atau PNG.");
  try {
    for (const [max, quality] of [
      [1600, 0.82],
      [1400, 0.75],
      [1200, 0.7],
      [1000, 0.62],
    ] as const) {
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      let blob = await toBlob(canvas, "image/webp", quality);
      if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", quality);
      if (blob && blob.size <= MAX_BYTES) return blob;
    }
  } finally {
    bitmap.close();
  }
  throw new Error("Foto terlalu besar setelah dikecilkan.");
}

export default function UnitPhotos({
  unitId,
  photos,
  editable,
}: {
  unitId: string;
  photos: { path: string; url: string }[];
  editable: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, Math.max(0, MAX_PHOTOS - photos.length));
    if (!list.length) return setError(`Maksimal ${MAX_PHOTOS} foto.`);
    setError("");
    start(async () => {
      let failed = 0;
      for (let i = 0; i < list.length; i++) {
        setProgress(`Mengunggah ${i + 1} dari ${list.length}...`);
        try {
          const blob = await compress(list[i]);
          const fd = new FormData();
          fd.append("unit_id", unitId);
          fd.append("file", new File([blob], `foto.${blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type }));
          const res = await uploadUnitPhoto(fd);
          if (res.error) {
            failed++;
            setError(res.error);
          }
        } catch (e) {
          failed++;
          setError(e instanceof Error ? e.message : "Foto belum terunggah.");
        }
      }
      setProgress(failed ? "" : `${list.length} foto terunggah.`);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  const reorder = (next: string[]) => {
    setError("");
    start(async () => {
      const fd = new FormData();
      fd.append("unit_id", unitId);
      fd.append("photos", JSON.stringify(next));
      const res = await setUnitPhotos(fd);
      if (res.error) setError(res.error);
    });
  };

  const paths = photos.map((p) => p.path);

  return (
    <div>
      {photos.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.path} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-cream">
              <Image src={p.url} alt={`Foto ${i + 1}`} fill sizes="160px" className="object-cover" />
              {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-bold">Sampul</span>}
              {editable && (
                <div className="absolute inset-x-1.5 bottom-1.5 flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                  {i > 0 && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => reorder([p.path, ...paths.filter((x) => x !== p.path)])}
                      className="rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold text-brand-dark disabled:opacity-50"
                    >
                      Jadikan sampul
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => reorder(paths.filter((x) => x !== p.path))}
                    aria-label={`Hapus foto ${i + 1}`}
                    className="ml-auto rounded-md bg-brand-dark/85 px-2 py-1 text-[11px] font-bold text-white disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] text-brand-gray">Belum ada foto. Unit dengan foto asli lebih cepat dilirik calon penyewa.</p>
      )}

      {editable && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label
            className={`relative inline-flex cursor-pointer items-center rounded-lg bg-brand-dark px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-red ${
              pending || photos.length >= MAX_PHOTOS ? "pointer-events-none opacity-50" : ""
            }`}
          >
            + Tambah foto
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={pending || photos.length >= MAX_PHOTOS}
              onChange={(e) => upload(e.target.files)}
            />
          </label>
          <span className="text-[12px] text-brand-gray">
            {photos.length}/{MAX_PHOTOS} foto. Terang, rapi, tanpa wajah orang atau nomor kendaraan.
          </span>
        </div>
      )}
      <p className="mt-2 min-h-[1em] text-[12px] font-semibold" aria-live="polite">
        {error ? <span className="text-brand-red">{error}</span> : <span className="text-[#2D7A4F]">{progress}</span>}
      </p>
    </div>
  );
}

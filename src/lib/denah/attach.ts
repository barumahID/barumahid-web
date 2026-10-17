import { useSyncExternalStore } from "react";

// Lampiran denah miniCAD ke form konsultasi (dua komponen terpisah di halaman, berbagi lewat store kecil ini).
// `value` dikirim ke CRM sebagai kolom "Denah Konsep": ringkasan + tautan yang membuka denah yang sama.

export interface DenahAttachment {
  summary: string;
  value: string;
}

let current: DenahAttachment | null = null;
const listeners = new Set<() => void>();

export function setDenahAttachment(a: DenahAttachment | null) {
  current = a;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useDenahAttachment() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

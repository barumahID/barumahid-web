"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Unit yang disimpan pengunjung (tombol hati). Hanya di browser pengunjung (localStorage), tidak dikirim ke server.
// Kalau penyimpanan browser diblokir, tombol tetap jalan selama halaman terbuka.

const KEY = "barumahid-simpan";
const listeners = new Set<() => void>();
let memory = "[]";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return memory;
  }
}

function write(value: string) {
  memory = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // penyimpanan diblokir: cukup di memori
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSaved() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const saved = useMemo<string[]>(() => {
    try {
      const v: unknown = JSON.parse(raw);
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }, [raw]);
  const toggle = useCallback(
    (slug: string) => write(JSON.stringify(saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug].slice(-100))),
    [saved],
  );
  return { saved, toggle };
}

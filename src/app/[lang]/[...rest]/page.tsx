import { notFound } from "next/navigation";

// Alamat yang tidak cocok dengan halaman mana pun: tampilkan 404 di dalam layout bahasa (navbar, footer, terjemahan).
export default function CatchAll() {
  notFound();
}

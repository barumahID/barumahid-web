import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Layanan ConsTech", template: "%s | barumahID" },
  description:
    "Jasa konstruksi profesional barumahID — Jasa Gambar, Analisa Struktur, Renovasi & Konstruksi dengan pricing transparan.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

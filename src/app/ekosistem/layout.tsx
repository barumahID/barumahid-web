import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekosistem",
  description:
    "Visualisasi interaktif ekosistem barumahID — ConsTech LBAG, Rent-to-Own, Ekosistem DP, dan Kemitraan.",
};

export default function EkosistemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

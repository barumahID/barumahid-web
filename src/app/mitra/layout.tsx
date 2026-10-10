import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mitra",
  description:
    "Bergabung menjadi mitra barumahID — Construction, Projectlink, atau Knowledges.",
};

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

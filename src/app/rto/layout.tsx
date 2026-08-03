import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Rent-to-Own",
  description:
    "Sewa hari ini, miliki hunian nantinya. Program RTO barumahID mendampingi perjalanan kepemilikan rumah kamu dari penyewa menjadi pemilik.",
};

export default function RTOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

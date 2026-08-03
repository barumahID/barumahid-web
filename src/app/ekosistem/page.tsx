"use client";

import dynamic from "next/dynamic";

const EkosistemGraph = dynamic(
  () => import("@/components/sections/EkosistemGraph"),
  { ssr: false },
);

export default function EkosistemPage() {
  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#F8F5F0]">
      <EkosistemGraph />
    </div>
  );
}

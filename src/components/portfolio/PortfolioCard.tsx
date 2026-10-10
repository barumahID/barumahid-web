import Image from "next/image";
import { SERVICE_LABEL, type PortfolioItem } from "@/data/projects";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  const place = [item.city, item.province].filter(Boolean).join(", ");
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-dark/10 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-dark">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-dark">
          {SERVICE_LABEL[item.service]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-[17px] font-extrabold leading-snug text-brand-dark">{item.title}</h3>
        {(place || item.year) && (
          <p className="mt-1 text-[13px] text-brand-gray">{[place, item.year].filter(Boolean).join(" · ")}</p>
        )}
        <p className="mt-3 text-[14px] leading-relaxed text-brand-dark/75">{item.scope}</p>
        {item.software && (
          <p className="mt-auto pt-4 text-[12px] font-semibold text-brand-mute">Software: {item.software.join(", ")}</p>
        )}
      </div>
    </article>
  );
}

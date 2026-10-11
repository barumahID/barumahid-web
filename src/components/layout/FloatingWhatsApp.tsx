import { waLink } from "@/data/site";
import ChannelIcon from "@/components/icons/ChannelIcon";
import type { Lang } from "@/i18n/config";
import { makeT } from "@/i18n/t";

// Tombol WhatsApp melayang, hanya di layar HP (PRD: navigasi mobile).
export default function FloatingWhatsApp({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  return (
    <a
      href={waLink(t("Halo barumahID, saya ingin tanya-tanya dulu."))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Chat WhatsApp barumahID")}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f9d55] text-white shadow-[0_12px_30px_-8px_rgba(31,157,85,0.7)] transition-transform active:scale-95 lg:hidden"
    >
      <ChannelIcon id="whatsapp" size={26} />
    </a>
  );
}

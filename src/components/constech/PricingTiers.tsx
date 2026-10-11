import { PACKAGE_INCLUDES, PRICE_NOTE, TIERS, formatRupiah } from "@/data/pricing";
import ChannelIcon from "@/components/icons/ChannelIcon";
import { JURURANCANG, waLink } from "@/data/site";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 4" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingTiers() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => {
          const pro = t.id === "pro";
          return (
            <article
              key={t.id}
              className={`relative flex flex-col rounded-3xl p-6 md:p-7 ${
                pro ? "bg-brand-dark text-white" : "border border-brand-dark/10 bg-white text-brand-dark"
              }`}
            >
              {pro && (
                <span className="absolute right-5 top-5 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Paling lengkap
                </span>
              )}
              <p className={`text-[12px] font-bold uppercase tracking-[0.18em] ${pro ? "text-white/60" : "text-brand-mute"}`}>{t.name}</p>
              <p className={`mt-1 text-[13px] ${pro ? "text-white/60" : "text-brand-gray"}`}>Maksimal {t.maxDays} hari kerja</p>

              <div className={`mt-6 space-y-4 border-t pt-5 ${pro ? "border-white/15" : "border-brand-dark/10"}`}>
                <div>
                  <p className={`text-[12px] font-semibold ${pro ? "text-white/60" : "text-brand-gray"}`}>Gambar & Modelling</p>
                  <p className="mt-1 text-[30px] font-black leading-none tracking-tight">
                    {formatRupiah(t.gambar)}
                    <span className={`ml-1 text-[14px] font-semibold ${pro ? "text-white/55" : "text-brand-mute"}`}>/m²</span>
                  </p>
                  {t.gambarExtra && <p className="mt-2 text-[13px] font-semibold text-brand-red">+ {t.gambarExtra}</p>}
                </div>
                <div>
                  <p className={`text-[12px] font-semibold ${pro ? "text-white/60" : "text-brand-gray"}`}>Desain & Analisa Struktur</p>
                  <p className="mt-1 text-[30px] font-black leading-none tracking-tight">
                    {formatRupiah(t.struktur)}
                    <span className={`ml-1 text-[14px] font-semibold ${pro ? "text-white/55" : "text-brand-mute"}`}>/m²</span>
                  </p>
                  {t.strukturExtra && <p className="mt-2 text-[13px] font-semibold text-brand-red">+ {t.strukturExtra}</p>}
                </div>
              </div>

              <a
                href={waLink(`Halo Jururancang, saya dari website barumahID. Saya mau pesan paket ${t.name}.`, JURURANCANG.wa)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 block rounded-full py-3 text-center text-[13.5px] font-bold transition-colors ${
                  pro ? "bg-brand-red text-white hover:bg-brand-red-dark" : "border border-brand-dark/20 hover:border-brand-dark hover:bg-brand-dark hover:text-white"
                }`}
              >
                Pesan paket {t.name}
              </a>
            </article>
          );
        })}
      </div>

      {/* Yang sudah termasuk + catatan harga, digabung jadi satu blok ringkas */}
      <div className="mt-4 rounded-3xl border border-brand-dark/10 bg-white p-5 md:p-6">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-dark">Sudah termasuk di semua paket</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {PACKAGE_INCLUDES.map((x) => (
            <li key={x} className="flex items-center gap-2 text-[14px] text-brand-dark/85">
              <Check />
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-brand-dark/10 pt-3 text-[13px] text-brand-gray">* {PRICE_NOTE}</p>
      </div>

      {/* Terakhir dan terpisah: ajakan chat admin WhatsApp */}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-dark p-6 text-white sm:flex-row sm:items-center md:px-8">
        <div>
          <p className="text-[18px] font-extrabold tracking-tight">Lebih nyaman lewat WhatsApp?</p>
          <p className="mt-1 text-[14px] text-white/65">Tanya paket, harga, atau kebutuhan proyekmu. Admin kami siap membantu.</p>
        </div>
        <a
          href={waLink("Halo barumahID, saya mau tanya paket jasa gambar atau analisa struktur.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1FA855] px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#178a45]"
        >
          <ChannelIcon id="whatsapp" size={18} />
          Chat admin WhatsApp
        </a>
      </div>
    </div>
  );
}

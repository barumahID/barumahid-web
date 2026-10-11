import ChannelIcon from "@/components/icons/ChannelIcon";
import { activeChannels } from "@/data/site";

// Deretan kanal resmi: satu ikon, satu klik, langsung ke kanalnya.
export default function ChannelGrid({ dark = false }: { dark?: boolean }) {
  const channels = activeChannels();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {channels.map((c) => (
        <li key={c.id}>
          <a
            href={c.href}
            target={c.id === "email" ? undefined : "_blank"}
            rel={c.id === "email" ? undefined : "noopener noreferrer"}
            aria-label={`${c.label}: ${c.handle}`}
            className={`group flex h-full items-center gap-4 rounded-2xl border p-4 transition-colors ${
              dark
                ? "border-white/15 text-white hover:border-white/50 hover:bg-white/5"
                : "border-brand-dark/10 bg-white text-brand-dark hover:border-brand-red"
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                dark ? "bg-white/10" : "bg-brand-cream text-brand-dark group-hover:bg-brand-red group-hover:text-white"
              } transition-colors`}
            >
              <ChannelIcon id={c.id} size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold opacity-60">{c.label}</span>
              <span className="block truncate text-[15px] font-bold leading-snug">{c.handle}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

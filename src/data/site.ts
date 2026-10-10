// Sumber tunggal untuk data kontak dan kanal resmi barumahID.
// Data di sini adalah data asli dari tim, bukan placeholder. Ubah hanya setelah dikonfirmasi.

export const SITE = {
  name: "barumahID",
  company: "PT Inditek Bluprim Mahaksa",
  group: "Mahaksa Grup",
  url: "https://www.barumahid.com",
  tagline: "Sewa hari ini. Miliki hunian nantinya.",
  taglineConstech: "Proyekmu, dibikin mudah aja.",
  description:
    "barumahID membantu kamu membangun rumah dengan benar lewat layanan ConsTech, lalu membuka jalan untuk memilikinya lewat program Rent-to-Own.",
  foundedBrand: "11 November 2018",
  foundedCompany: "9 Januari 2024",
} as const;

export const WA_ADMIN_1 = "6285157883292";
export const WA_ADMIN_2 = "6289636410565";
export const WA_ADMIN_1_LABEL = "+62 851-5788-3292";
export const WA_ADMIN_2_LABEL = "+62 896-3641-0565";
export const EMAIL = "barumahid@gmail.com";

export const ADDRESSES = {
  hq: {
    label: "Kantor Pusat",
    lines: ["Komp. PJKA, Jl. Sunda No. 98B", "Padang, Sumatera Barat"],
  },
  vo: {
    label: "Virtual Office",
    lines: ["Ruko De Mansion, Jl. Jalur Sutera Timur No. C-5", "Alam Sutera, Tangerang, Banten"],
  },
} as const;

export type ChannelId =
  | "instagram"
  | "instagram-jururancang"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "facebook"
  | "whatsapp"
  | "email";

export interface Channel {
  id: ChannelId;
  label: string;
  handle: string;
  href: string;
  /** false = link belum dikonfirmasi tim, jangan ditampilkan */
  active: boolean;
}

// Status mengikuti dokumen Halaman Tentang (bagian 8. Kanal barumahID).
// TikTok perlu dicek ulang linknya. YouTube dan Facebook belum punya link, jadi belum tampil.
export const CHANNELS: Channel[] = [
  {
    id: "instagram",
    label: "Instagram barumahID",
    handle: "@barumahid",
    href: "https://www.instagram.com/barumahid",
    active: true,
  },
  {
    id: "instagram-jururancang",
    label: "Instagram Jururancang",
    handle: "@jururancang_mahaksa",
    href: "https://www.instagram.com/jururancang_mahaksa",
    active: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@barumahid",
    href: "https://www.tiktok.com/@barumahid",
    active: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "barumahID",
    href: "https://www.linkedin.com/company/barumahID",
    active: true,
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "barumahID Startup",
    href: "",
    active: false,
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "barumahID",
    href: "",
    active: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp Admin",
    handle: WA_ADMIN_1_LABEL,
    href: `https://wa.me/${WA_ADMIN_1}`,
    active: true,
  },
  {
    id: "email",
    label: "Email",
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
    active: true,
  },
];

export const activeChannels = () => CHANNELS.filter((c) => c.active && c.href);

/** Link WhatsApp dengan pesan terisi. */
export function waLink(message?: string, number: string = WA_ADMIN_1) {
  return message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;
}

export const JURURANCANG_IG = "https://www.instagram.com/jururancang_mahaksa";
export const JURURANCANG_DM = "https://ig.me/m/jururancang_mahaksa";

import Link from "next/link";

const cards = [
  {
    category: "UNTUK PROYEK KONSTRUKSI",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18v3h20v-3" />
        <path d="M2 18l3-12h14l3 12" />
        <path d="M10 6V3h4v3" />
        <path d="M7.5 6h9" />
      </svg>
    ),
    title: "Saya butuh jasa gambar, struktur, atau bangun.",
    description:
      "Untuk pemilik proyek, kontraktor, atau individu yang butuh layanan teknis konstruksi profesional.",
    linkText: "Lihat layanan konstruksi →",
    href: "/services",
  },
  {
    category: "UNTUK MITRA & PARTNER",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Saya ingin bergabung sebagai mitra barumahID.",
    description:
      "Untuk subkontraktor, supplier, developer, konsultan teknis, dan institusi pendidikan yang ingin berkolaborasi.",
    linkText: "Lihat program kemitraan →",
    href: "/mitra",
  },
  {
    category: "UNTUK CALON PENGHUNI",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Saya mau sewa sekarang dan punya rumah nantinya.",
    description:
      "Untuk fresh grad, karyawan, atau wirausaha yang ingin mulai perjalanan kepemilikan rumah dari sewa.",
    linkText: "Lihat program Rent-to-Own →",
    href: "/rto",
  },
];

export default function PickYourFit() {
  return (
    <section className="bg-[#F8F5F0] px-8 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-[#C53B3B]">
          PICK YOUR FIT
        </p>
        <h2 className="mb-4 text-center text-4xl font-black text-[#1A1A1A] md:text-5xl">
          barumahID untuk siapa?
        </h2>
        <p className="mb-16 text-center text-base text-[#666]">
          Pilih jalur yang paling sesuai dengan kebutuhanmu.
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-8 transition-all duration-200 hover:border-[#C53B3B]/40 hover:shadow-lg hover:shadow-black/[0.06]"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                {card.icon}
              </div>
              <p className="mb-3 mt-4 text-xs font-bold uppercase tracking-widest text-[#C53B3B]">
                {card.category}
              </p>
              <h3 className="mb-3 text-lg font-black leading-snug text-[#1A1A1A]">
                {card.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[#666]">
                {card.description}
              </p>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#C53B3B]">
                {card.linkText}
              </span>
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-red-100/40 blur-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

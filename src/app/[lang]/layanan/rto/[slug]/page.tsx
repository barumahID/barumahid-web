import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/ButtonLink";
import { LISTINGS, STATUS_LABEL, listingPrice, type Listing } from "@/data/listings";
import { RTO_PATHS, RTO_RATE } from "@/data/rto";
import { SITE, waLink } from "@/data/site";

// Detail listing. Info yang tampil beda untuk tiap kategori (tabel di PRD Website v1, bagian Layanan RTO).
// Alamat persis TIDAK ditampilkan, cukup kelurahan dan kecamatan.

export const dynamicParams = false;

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = LISTINGS.find((x) => x.slug === slug);
  if (!l) return {};
  const path = RTO_PATHS.find((p) => p.id === l.category);
  return {
    title: `${l.title}, ${l.kelurahan} ${l.city}`,
    description: `${path?.name}: ${l.title} di ${l.kelurahan}, ${l.kecamatan}, ${l.city}.`,
    alternates: { canonical: `/layanan/rto/${l.slug}` },
    openGraph: l.photos[0] ? { images: [{ url: l.photos[0].src }] } : undefined,
  };
}

const rp = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));
type Row = [string, string | number | undefined | null];

function groups(l: Listing): { title: string; rows: Row[] }[] {
  const list = (xs?: string[]) => (xs && xs.length ? xs.join(", ") : undefined);
  if (l.category === "siap-berdaya") {
    return [
      {
        title: "Harga",
        rows: [
          ["Sewa per bulan", rp(l.sewaPerBulan)],
          ["Deposit", l.deposit ? rp(l.deposit) : undefined],
          ["Minimal lama sewa", l.minSewaBulan ? `${l.minSewaBulan} bulan` : undefined],
        ],
      },
      {
        title: "Ukuran",
        rows: [
          ["Luas bangunan", l.luasBangunan ? `${l.luasBangunan} m²` : undefined],
          ["Kamar tidur", l.kamarTidur],
          ["Kamar mandi", l.kamarMandi],
        ],
      },
      {
        title: "Utilitas",
        rows: [
          ["Listrik", l.listrikVA ? `${l.listrikVA} VA${l.listrikTipe ? `, ${l.listrikTipe}` : ""}` : undefined],
          ["Air", l.air],
          ["Termasuk biaya sewa", l.utilitasTermasuk],
          ["Internet", l.internet],
        ],
      },
      {
        title: "Fasilitas",
        rows: [
          ["Perabot", l.perabot],
          ["Fasilitas", list(l.fasilitas)],
          ["Aturan penghuni", list(l.aturan)],
        ],
      },
    ];
  }
  if (l.category === "siap-beli") {
    return [
      {
        title: "Harga",
        rows: [
          ["Harga jual", rp(l.hargaJual)],
          ["Bisa nego", l.nego === undefined ? undefined : l.nego ? "Ya" : "Tidak"],
        ],
      },
      {
        title: "Ukuran",
        rows: [
          ["Luas tanah", l.luasTanah ? `${l.luasTanah} m²` : undefined],
          ["Luas bangunan", l.luasBangunan ? `${l.luasBangunan} m²` : undefined],
          ["Jumlah lantai", l.lantai],
          ["Kamar tidur", l.kamarTidur],
          ["Kamar mandi", l.kamarMandi],
        ],
      },
      {
        title: "Legalitas",
        rows: [
          ["Sertifikat", l.sertifikat],
          ["PBG atau IMB", l.pbg],
          ["PBB terakhir", l.pbbTerakhir],
        ],
      },
      {
        title: "Kondisi dan lokasi",
        rows: [
          ["Kondisi bangunan", l.kondisi],
          ["Tahun dibangun atau direnovasi", l.tahunBangun],
          ["Listrik", l.listrikVA ? `${l.listrikVA} VA` : undefined],
          ["Air", l.air],
          ["Fasilitas", list(l.fasilitas)],
          ["Lebar jalan depan", l.lebarJalan],
          ["Hadap", l.hadap],
          ["Riwayat banjir", l.riwayatBanjir],
        ],
      },
    ];
  }
  return [
    {
      title: "Harga",
      rows: [
        ["Harga lahan per m²", rp(l.hargaLahanPerM2)],
        ["Total harga lahan", rp(l.hargaLahanPerM2 * l.luasLahan)],
      ],
    },
    {
      title: "Lahan",
      rows: [
        ["Luas lahan", `${l.luasLahan} m²`],
        ["Dimensi dan bentuk", l.dimensi],
        ["Kontur", l.kontur],
        ["Jenis tanah", l.jenisTanah],
      ],
    },
    {
      title: "Legalitas dan aturan bangun",
      rows: [
        ["Sertifikat", l.sertifikat],
        ["Peruntukan zonasi (RDTR)", l.zonasi],
        ["KDB", l.kdb],
        ["KLB", l.klb],
        ["GSB", l.gsb],
      ],
    },
    {
      title: "Akses dan lokasi",
      rows: [
        ["Akses utilitas", list(l.aksesUtilitas)],
        ["Lebar jalan", l.lebarJalan],
        ["Riwayat banjir", l.riwayatBanjir],
        ["Rekomendasi tipe rumah", l.rekomendasi],
      ],
    },
  ];
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const l = LISTINGS.find((x) => x.slug === slug);
  if (!l) notFound();

  const path = RTO_PATHS.find((p) => p.id === l.category);
  const price = listingPrice(l);
  const [cover, ...rest] = l.photos;
  const waText = `Halo barumahID, saya tertarik dengan unit "${l.title}" (${SITE.url}/layanan/rto/${l.slug}). Bisa jadwalkan survei?`;

  return (
    <>
      <section className="bg-brand-dark pt-[68px] text-white">
        <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-8 md:px-10 lg:px-14">
          <Link href="/layanan/rto#listing" className="text-[13px] font-semibold text-white/60 hover:text-white">
            ← Kembali ke listing
          </Link>
          <div className="mt-6 grid gap-3 md:grid-cols-3 md:grid-rows-2">
            {cover && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:aspect-auto">
                <Image src={cover.src} alt={cover.alt} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
              </div>
            )}
            {rest.slice(0, 2).map((p) => (
              <div key={p.src} className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl md:block">
                <Image src={p.src} alt={p.alt} fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-dark px-3 py-1 text-[12px] font-bold text-white">{path?.name}</span>
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-brand-dark">{STATUS_LABEL[l.status]}</span>
            </div>
            <h1 className="mt-4 text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold leading-tight tracking-tight text-brand-dark">{l.title}</h1>
            <p className="mt-2 text-[15px] text-brand-gray">
              {l.kelurahan}, {l.kecamatan}, {l.city}
            </p>
            {l.description && <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-brand-dark/80">{l.description}</p>}

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {groups(l).map((g) => {
                const rows = g.rows.filter(([, v]) => v !== undefined && v !== null && v !== "");
                if (rows.length === 0) return null;
                return (
                  <div key={g.title} className="rounded-3xl border border-brand-dark/10 bg-white p-6">
                    <h2 className="text-[15px] font-extrabold text-brand-dark">{g.title}</h2>
                    <dl className="mt-4 divide-y divide-brand-dark/10">
                      {rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 py-2.5 text-[14px]">
                          <dt className="text-brand-gray">{k}</dt>
                          <dd className="text-right font-semibold text-brand-dark">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>

            {l.nearby && l.nearby.length > 0 && (
              <div className="mt-8">
                <h2 className="text-[15px] font-extrabold text-brand-dark">Sekitar unit</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {l.nearby.map((n) => (
                    <li key={n} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-brand-dark">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-brand-dark p-6 text-white">
              <p className="text-[12px] text-white/55">{price.label}</p>
              <p className="mt-1 text-[30px] font-black leading-none">
                {rp(price.value)}
                {price.suffix && <span className="text-[14px] font-semibold text-white/55">{price.suffix}</span>}
              </p>
              {l.category === "siap-berdaya" && (
                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                  <p className="text-[12px] text-white/55">Saldo DP dari sewa</p>
                  <p className="mt-1 text-[22px] font-black text-brand-red">{rp(l.sewaPerBulan * RTO_RATE)}/bulan</p>
                  <p className="mt-1 text-[12px] text-white/50">25% dari sewa, dicatat atas namamu.</p>
                </div>
              )}
              {l.category === "siap-beli" && (
                <div className="mt-5 rounded-2xl bg-white/5 p-4 text-[13px] text-white/70">
                  Unit dijual. Kami bantu hitung DP, cicilan KPR, BPHTB, dan biaya notaris saat konsultasi.
                </div>
              )}
              <div className="mt-6 grid gap-3">
                <ButtonLink href="/layanan/rto#daftar" variant="red">
                  Ajukan minat
                </ButtonLink>
                <ButtonLink href={waLink(waText)} variant="whatsapp" arrow={false}>
                  Jadwalkan survei
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

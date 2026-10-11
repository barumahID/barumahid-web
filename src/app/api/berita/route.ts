import { getBerita } from "@/lib/berita";

// Kabar terkini konstruksi dan properti (lihat src/lib/berita.ts). Diperbarui otomatis tiap 6 jam.
export const revalidate = 21600;

export async function GET() {
  const data = await getBerita();
  return Response.json(data);
}

import { LEAD_JENIS, type LeadJenis } from "@/lib/leads";

const MAX_FIELDS = 20;
const MAX_LEN = 1000;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("[api/leads] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY belum di-set.");
    return Response.json({ error: "Server belum dikonfigurasi." }, { status: 503 });
  }

  let body: { jenis?: unknown; data?: unknown; sumber?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const jenis = body.jenis as LeadJenis;
  if (!LEAD_JENIS.includes(jenis)) {
    return Response.json({ error: "Jenis lead tidak valid." }, { status: 400 });
  }
  if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
    return Response.json({ error: "Data form kosong." }, { status: 400 });
  }

  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.data).slice(0, MAX_FIELDS)) {
    const v = clean(value);
    if (v) data[key.slice(0, 50)] = v;
  }

  // Kolom ringkas supaya gampang dibaca di dashboard Supabase; data lengkap tetap di kolom `data`.
  const nama = data.nama || data.pic || data.namaPerusahaan;
  const kontak = data.wa || data.hp || data.kontak || data.email;
  if (!nama || !kontak) {
    return Response.json({ error: "Nama dan kontak wajib diisi." }, { status: 400 });
  }

  // Publishable key cuma boleh INSERT ke tabel ini (RLS) — tidak bisa membaca lead.
  const res = await fetch(`${supabaseUrl}/rest/v1/barumahid_leads`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      jenis,
      nama,
      kontak,
      kota: data.kota ?? null,
      data,
      sumber: clean(body.sumber) || null,
    }),
  });

  if (!res.ok) {
    console.error("[api/leads] Insert Supabase gagal:", res.status, await res.text());
    return Response.json({ error: "Gagal menyimpan data." }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
}

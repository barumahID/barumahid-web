export const LEAD_JENIS = ["customer", "mitra", "developer", "kontak"] as const;

export type LeadJenis = (typeof LEAD_JENIS)[number];

export const LEAD_ERROR_MESSAGE =
  "Maaf, data gagal terkirim. Coba lagi sebentar, atau hubungi kami langsung via WhatsApp.";

// Dipanggil dari form di browser — kirim data ke /api/leads (disimpan ke Supabase).
export async function submitLead(
  jenis: LeadJenis,
  data: Record<string, FormDataEntryValue | string>,
) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jenis, data, sumber: window.location.pathname }),
  });
  if (!res.ok) {
    throw new Error(`Gagal mengirim lead (${res.status})`);
  }
}

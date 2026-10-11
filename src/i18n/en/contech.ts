import { CONTECH_FAQ, CONTECH_REACH } from "@/data/contech";
import { TIERS, formatRupiah } from "@/data/pricing";

// Terjemahan Inggris: halaman /layanan/contech (src/data/contech.ts, pricing.ts, globe, karya, harga, kanvas).

const REGION_EN: Record<string, string> = {
  "Sumatera Barat": "West Sumatra",
  Jambi: "Jambi",
  Palembang: "Palembang",
  Jabodetabek: "Greater Jakarta",
  Kinibalu: "Kinibalu",
  Mamuju: "Mamuju",
};

// Jawaban FAQ yang dihitung dari data (harga dan wilayah) dibuat ulang dengan pola yang sama
const [BASIC, PLUS, PRO] = TIERS;
const regionsEn = CONTECH_REACH.regions.map((r) => REGION_EN[r] ?? r);
const wilayahEn = regionsEn.slice(0, -1).join(", ") + ", and " + regionsEn.at(-1);
const FAQ_EN = [
  {
    question: "Is the consultation really free?",
    answer: "Yes, your first consultation is free. Tell us your needs and budget first, and we will help check what needs to be done before any quote.",
  },
  {
    question: "What should I prepare before the consultation?",
    answer: "Just the project location, the approximate building area, and what you want done. If you have a sketch, site photos, or old drawings, send them too so we can understand faster.",
  },
  {
    question: "How are renovation and construction prices calculated?",
    answer: "Costs are calculated per work item using AHSP and local unit prices, then put together into a cost estimate (RAB) that you approve before work begins. Payments are made in stages according to terms agreed in writing.",
  },
  {
    question: "How much do drawing or structural analysis services cost, and how long do they take?",
    answer: `Drawing and modelling starts at ${formatRupiah(BASIC.gambar, "en")} per m², structural design and analysis starts at ${formatRupiah(BASIC.struktur, "en")} per m². Work takes up to ${BASIC.maxDays} working days for the ${BASIC.name} package, ${PLUS.maxDays} days for ${PLUS.name}, and ${PRO.maxDays} days for ${PRO.name}.`,
  },
  {
    question: "My project is outside Padang. Can you take it?",
    answer: `Our projects are already spread across ${wilayahEn}. Tell us where your project is, and our admin will check whether we can take it on.`,
  },
];
const faqPairs: Record<string, string> = {};
CONTECH_FAQ.forEach((q, i) => {
  if (!FAQ_EN[i]) return;
  faqPairs[q.question] = FAQ_EN[i].question;
  faqPairs[q.answer] = FAQ_EN[i].answer;
});

export const CONTECH: Record<string, string> = {
  ...REGION_EN,
  ...faqPairs,

  // Metadata
  "Jasa General Kontraktor: Renovasi, Bangun, Gambar, dan Analisa Struktur":
    "General Contractor Services: Renovation, Construction, Drawings, and Structural Analysis",
  "barumahID, general kontraktor untuk renovasi dan bangun dengan RAB berbasis AHSP. Jasa gambar mulai Rp15.000/m² dan analisa struktur mulai Rp18.000/m² bersama partner Jururancang Engineering Mahaksa.":
    "barumahID is a general contractor for renovation and construction, with AHSP-based cost estimates. Drawing services from Rp15,000/m² and structural analysis from Rp18,000/m² with our partner Jururancang Engineering Mahaksa.",

  // Hero
  "Jasa General Kontraktor": "General Contractor Services",
  "barumahID bantu wujudkan proyekmu dengan mudah, dari renovasi sampai bangun konstruksi. Tersedia juga jasa gambar & modelling serta desain & analisa struktur bersama partner kami,":
    "barumahID makes your project easy, from renovation to new construction. We also offer drawing & modelling and structural design & analysis with our partner,",
  "Bekisting dan besi plat lantai yang siap dicor": "Floor slab formwork and rebar ready for concrete",
  "Ekskavator mengerjakan pekerjaan tanah di lokasi proyek": "An excavator doing earthwork on a project site",
  "Pekerja memasang bekisting saluran beton di gang perumahan": "Workers setting up formwork for a concrete drain in a residential alley",
  "Pekerja membangun dinding penahan tanah di lereng": "Workers building a retaining wall on a slope",
  "Konsultasi gratis": "Free consultation",
  "Lihat harga paket": "See package prices",

  // Jejak proyek dan globe
  "Jejak proyek": "Project footprint",
  "Proyek yang sudah kami kerjakan.": "Projects we have completed.",
  "Proyek Renovasi dan Bangun Konstruksi": "Renovation and Construction Projects",
  "Proyek Gambar & Modelling": "Drawing & Modelling Projects",
  "Proyek Desain dan Analisa Struktur": "Structural Design and Analysis Projects",
  "Kantor barumahID": "barumahID office",
  "Globe interaktif dengan {n} kota proyek barumahID, serta Base barumahID dan VO":
    "Interactive globe with {n} barumahID project cities, plus Base barumahID and the VO",
  "Tekan Ctrl (atau ⌘) sambil scroll untuk zoom": "Hold Ctrl (or ⌘) while scrolling to zoom",
  "Lokasi proyek atau kota klien": "Project location or client city",
  "Base & VO barumahID": "barumahID Base & VO",
  "Geser untuk memutar, Ctrl + scroll untuk zoom": "Drag to rotate, Ctrl + scroll to zoom",
  "Geser untuk memutar": "Drag to rotate",
  Perbesar: "Zoom in",
  Perkecil: "Zoom out",
  "Fokus Indonesia": "Focus on Indonesia",
  Banten: "Banten",
  "Jawa Barat": "West Java",
  "Sabah, Malaysia": "Sabah, Malaysia",
  "Sulawesi Barat": "West Sulawesi",
  "Sumatera Selatan": "South Sumatra",

  // Renovasi dan bangun
  "Layanan unggulan": "Flagship service",
  "Renovasi dan bangun.": "Renovation and construction.",
  "Tidak ada harga borongan yang asal tebak. Percayakan proyekmu ke kami: dikerjakan profesional, biayanya transparan, bersama mitra konstruksi barumahID yang sudah terbukti bekerja dengan kami.":
    "No guesswork lump-sum prices. Trust your project to us: done professionally, with transparent costs, together with barumahID construction partners who have a proven track record with us.",
  "Survey pengukuran": "Land survey",
  "Petugas melakukan survey pengukuran lahan dengan alat ukur": "A surveyor measuring land with survey equipment",
  "Pembesian sloof dan kolom": "Tie beam and column rebar",
  "Pembesian sloof dan kolom rumah": "Rebar work for a house's tie beams and columns",
  Saluran: "Drainage channel",
  "Pekerjaan saluran sungai dengan ekskavator dan susunan batu": "River channel works with an excavator and stone placement",
  "Pasangan batu kali": "River stone masonry",
  "Pekerja memasang dinding pasangan batu kali di saluran": "Workers building a river stone masonry wall along a channel",
  Renovasi: "Renovation",
  "Perbaikan dan perubahan bangunan, dari atap, plafon, dapur, lantai, sampai tambah lantai.":
    "Repairs and changes to your building, from the roof, ceiling, kitchen, and floors to adding a story.",
  "Bangun Baru": "New Build",
  "Rumah tinggal, kos, ruko, sampai fasilitas umum. Dari pondasi sampai finishing.":
    "Homes, boarding houses, shophouses, and public facilities. From foundation to finishing.",
  "Pendampingan & Manajemen Konstruksi": "Construction Supervision & Management",
  "Pengawasan mutu, jadwal, dan biaya selama proyek berjalan, dengan laporan progres berkala.":
    "Quality, schedule, and cost supervision throughout the project, with regular progress reports.",
  "Harga dihitung per item pekerjaan (RAB berbasis AHSP)": "Priced per work item (AHSP-based cost estimate)",
  "Cara hitung harga dengan AHSP": "How we price with AHSP",
  "Harga satuan": "Unit price",
  "Koefisien bahan × harga bahan, ditambah koefisien tenaga × upah, ditambah alat. Lalu ditambah biaya umum dan keuntungan.":
    "Material coefficient × material price, plus labor coefficient × wage, plus equipment. Then overhead and profit are added.",
  "Biaya per item": "Cost per item",
  "Volume pekerjaan × harga satuan. Misalnya luas dinding dalam m² × harga satuan pasang bata per m².":
    "Work volume × unit price. For example, wall area in m² × the unit price of bricklaying per m².",
  RAB: "Cost estimate (RAB)",
  "Jumlah biaya semua item pekerjaan. Angka ini yang kamu setujui sebelum pekerjaan dimulai.":
    "The total cost of all work items. This is the number you approve before work begins.",
  "Minta hitungan RAB": "Request a cost estimate",
  "Halo barumahID, saya mau konsultasi renovasi atau bangun.": "Hello barumahID, I would like to consult about a renovation or a new build.",
  WhatsApp: "WhatsApp",
  Konsultasi: "Consultation",
  "Gratis. Kami dengarkan kebutuhan dan anggaranmu.": "Free. We listen to your needs and budget.",
  "Survei lokasi": "Site survey",
  "Tim cek kondisi lapangan dan ukur kebutuhan pekerjaan.": "Our team checks site conditions and measures the work needed.",
  "Penawaran dan RAB": "Quote and cost estimate",
  "Biaya dihitung per item pekerjaan dengan AHSP dan harga satuan daerah.": "Costs are calculated per work item using AHSP and local unit prices.",
  Kontrak: "Contract",
  "Lingkup, harga, jadwal, dan termin pembayaran disepakati tertulis.": "Scope, price, schedule, and payment terms are agreed in writing.",
  Pengerjaan: "Execution",
  "Dikerjakan bersama mitra mandor, dengan laporan progres berkala.": "Built with our partner foremen, with regular progress reports.",
  "Serah terima": "Handover",
  "Hasil dicek bersama, lalu masuk masa garansi pekerjaan.": "We inspect the result together, then the work warranty period begins.",

  // Gambar, modelling, dan struktur
  "Gambar, modelling, dan struktur": "Drawings, modelling, and structure",
  "Gambar kerja sampai hitungan struktur.": "From working drawings to structural calculations.",
  "Dikerjakan bersama partner kami, Jururancang Engineering Mahaksa. Tim insinyurnya menyiapkan denah, gambar kerja, model 3D, sampai hitungan struktur sesuai standar yang berlaku. Tinggal pilih paket sesuai kebutuhan dan tenggat proyekmu.":
    "Done with our partner, Jururancang Engineering Mahaksa. Their engineers prepare floor plans, working drawings, 3D models, and structural calculations to current standards. Just pick the package that fits your needs and deadline.",
  "Karya desain rumah dan analisa struktur": "House design and structural analysis work",
  "Karya sebelumnya": "Previous work",
  "Karya berikutnya": "Next work",
  "Desain rumah": "House design",
  "Analisa struktur": "Structural analysis",
  "Rumah tropis": "Tropical house",
  "Render 3D rumah bergaya tropis": "3D render of a tropical-style house",
  "Gedung shelter": "Shelter building",
  "Model struktur gedung shelter beton bertulang": "Structural model of a reinforced concrete shelter building",
  "Rumah modern": "Modern house",
  "Render 3D rumah modern dengan dua fasad miring": "3D render of a modern house with two slanted facades",
  "Atap lengkung": "Curved roof",
  "Model struktur atap lengkung bentang lebar": "Structural model of a long-span curved roof",
  "Rumah tiga lantai": "Three-story house",
  "Model 3D rumah tiga lantai": "3D model of a three-story house",
  "Gedung restoran baja": "Steel restaurant building",
  "Model struktur gedung restoran baja": "Structural model of a steel restaurant building",
  "Rumah satu lantai": "Single-story house",
  "Render 3D rumah satu lantai dengan carport": "3D render of a single-story house with a carport",
  "Rangka jembatan": "Bridge frame",
  "Model rangka baja jembatan": "Steel bridge frame model",

  // Paket harga
  "Paket harga dikerjakan oleh partner kami": "Packages delivered by our partner",
  Email: "Email",
  "Halo Jururancang, saya dari website barumahID. Saya mau tanya jasa gambar atau analisa struktur.":
    "Hello Jururancang, I found you on the barumahID website. I would like to ask about drawing or structural analysis services.",
  "Website segera hadir": "Website coming soon",
  "Pilih paket": "Choose a package",
  "Maksimal {n} hari kerja": "Up to {n} working days",
  "Paling lengkap": "Most complete",
  "Cara tampil harga": "Price display",
  "Harga per m²": "Price per m²",
  "Estimasi total": "Total estimate",
  "Luas bangunan": "Building area",
  "Kurangi 10 m²": "Decrease by 10 m²",
  "Tambah 10 m²": "Increase by 10 m²",
  "Geser luas bangunan": "Adjust building area",
  "Gambar & Modelling": "Drawing & Modelling",
  "Desain & Analisa Struktur": "Structural Design & Analysis",
  "Estimasi {luas} m² × {harga}": "Estimate {luas} m² × {harga}",
  "Halo Jururancang, saya dari website barumahID. Saya mau pesan paket {jasa} {paket}.":
    "Hello Jururancang, I found you on the barumahID website. I would like to order the {jasa} {paket} package.",
  "Halo Jururancang, saya dari website barumahID. Saya mau pesan paket {jasa} {paket} untuk bangunan sekitar {luas} m².":
    "Hello Jururancang, I found you on the barumahID website. I would like to order the {jasa} {paket} package for a building of about {luas} m².",
  "Pesan {paket}": "Order {paket}",
  "Isi paket {jasa} {paket}": "{jasa} {paket} package contents",
  "Survei lokasi dan konsultasi kebutuhan": "Site survey and needs consultation",
  "Denah lantai": "Floor plan",
  "Gambar arsitektur": "Architectural drawings",
  "Gambar 3D eksterior": "3D exterior views",
  "Gambar struktur": "Structural drawings",
  "Hitungan struktur berbasis SNI (ETABS atau SAP2000)": "SNI-based structural calculations (ETABS or SAP2000)",
  "Dimensi kolom, balok, pelat, dan pondasi": "Column, beam, slab, and foundation sizing",
  "Penulangan atau pembesian": "Reinforcement detailing",
  "Layout MEP dan RAB": "MEP layout and cost estimate",
  "Gambar DED dan RAB struktur": "Detailed engineering drawings and structural cost estimate",
  "Harga per m² luas bangunan, menyesuaikan kerumitan proyek dan disepakati di awal. Konsultasi pertama gratis.":
    "Price per m² of building area, adjusted to project complexity and agreed upfront. Your first consultation is free.",
  "Halo barumahID, saya mau tanya paket jasa gambar atau analisa struktur.":
    "Hello barumahID, I would like to ask about the drawing or structural analysis packages.",
  "Lebih nyaman lewat WhatsApp? Chat admin": "Prefer WhatsApp? Chat with our admin",

  // Ceritakan proyekmu
  "Ceritakan proyekmu.": "Tell us about your project.",
  "Gambarkan idemu di kanvas, sesederhana apa pun. Lalu isi data di sebelahnya, kami balas lewat WhatsApp untuk tanya detail dan kirim penawaran.":
    "Sketch your idea on the canvas, however simple. Then fill in your details next to it, and we will reply on WhatsApp to ask questions and send a quote.",
  "Sketsa tersimpan di browsermu. Unduh lewat tombol panah bawah, lalu kirimkan ke admin WhatsApp kami setelah mengisi data.":
    "Your sketch is saved in your browser. Download it with the down-arrow button, then send it to our WhatsApp admin after filling in your details.",
  "Yang sering ditanyakan": "Frequently asked questions",
  "Setelah kamu kirim": "After you send it",
  "Kami balas lewat WhatsApp": "We reply on WhatsApp",
  "Di jam kerja, biasanya di hari yang sama. Kalau ada sketsa, kirim sekalian di chat.":
    "During working hours, usually the same day. If you have a sketch, send it in the chat too.",

  // Kanvas sketsa
  "Alat gambar": "Drawing tools",
  Pena: "Pen",
  Penghapus: "Eraser",
  Garis: "Line",
  Kotak: "Rectangle",
  Lingkaran: "Circle",
  Hitam: "Black",
  Merah: "Red",
  Biru: "Blue",
  Hijau: "Green",
  Oranye: "Orange",
  "Warna {nama}": "{nama} color",
  "Tebal {n}px": "{n}px thickness",
  "Tebal garis {n} piksel": "Line thickness {n} pixels",
  Grid: "Grid",
  "Tampilkan grid": "Show grid",
  "Urungkan (Ctrl+Z)": "Undo (Ctrl+Z)",
  Urungkan: "Undo",
  "Ulangi (Ctrl+Shift+Z)": "Redo (Ctrl+Shift+Z)",
  Ulangi: "Redo",
  "Hapus semua": "Clear all",
  "Unduh PNG": "Download PNG",
  "Unduh sketsa sebagai PNG": "Download sketch as PNG",
  "Kanvas sketsa proyek. Gambar denah kasar, ukuran, atau bentuk bangunan yang kamu inginkan.":
    "Project sketch canvas. Draw a rough floor plan, sizes, or the building shape you want.",
  "Gambarkan ide proyekmu di sini": "Sketch your project idea here",
  "Denah kasar, ukuran ruangan, atau bentuk bangunan. Tidak perlu rapi.": "A rough floor plan, room sizes, or building shape. It does not need to be neat.",
  "Bisa pakai mouse, trackpad, pen, atau jari.": "Use a mouse, trackpad, pen, or your finger.",

  // Ajakan penutup halaman ini
  "Punya gambar tapi ragu strukturnya?": "Have a drawing but unsure about the structure?",
  "Kirim gambarnya, kami cek dulu. Konsultasi pertama gratis.": "Send us the drawing and we will check it first. Your first consultation is free.",
  "Kirim lewat WhatsApp": "Send via WhatsApp",
  "Halo barumahID, saya mau cek struktur bangunan saya.": "Hello barumahID, I would like to have my building's structure checked.",
};

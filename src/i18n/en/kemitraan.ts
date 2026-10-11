import { ALUR, FORM_GROUPS, GALERI, JALUR, KEMITRAAN_FAQ, KEMITRAAN_HERO, PERUBAHAN } from "@/data/kemitraan";
import { FORM_KLIEN } from "@/data/contech";

// Terjemahan Inggris: halaman Kemitraan (/kemitraan), formulir klien di ConTech, dan pilihan Masuk/Portal.
// Kunci diambil dari data supaya tidak salah ketik.

const zip = (ids: string[], en: string[]) => Object.fromEntries(ids.map((id, i) => [id, en[i]]));

const JALUR_EN = [
  {
    name: "Construction Services Partners",
    status: "Active",
    body: "Execution partners for renovation and construction projects carried out by barumahID as general contractor.",
    members: [
      ["Construction Workers", "Craftsmen, site supervisors, and skilled workers in every trade."],
      ["Contractors & Foremen", "Field work leaders together with their teams."],
      ["Vendors & Suppliers", "Material suppliers and project support service providers."],
    ],
  },
  {
    name: "Freelancers & Fresh Graduates",
    status: "Via Jururancang",
    body: "Professional collaboration on drawing, modelling, and structural design and analysis is now managed by Jururancang Engineering Mahaksa.",
    members: [
      ["Engineering freelancers", "Project-based architects, drafters, estimators, and BIM modellers."],
      ["Fresh graduates", "New graduates who want to build a portfolio on real projects."],
      ["Practitioners & academics", "Knowledge partnerships, research, and skills development."],
    ],
  },
  {
    name: "Rent-to-Own Partners",
    status: "Pre-launch",
    body: "Partnerships for the Rent-to-Own program we are preparing, connecting housing providers, developers, and future homeowners.",
    members: [
      ["Boarding House & Rental Owners", "Owners of boarding houses or rental homes whose units can join the program."],
      ["Partner Developers", "Developers willing to allocate units for program participants."],
      ["Tenants (customers)", "Future homeowners who rent while building up a down payment."],
    ],
  },
];

const GROUP_EN = [
  {
    title: "Construction Services",
    note: "Registration for execution partners on barumahID construction projects.",
    sections: [
      { label: "Registration", forms: [["Construction Workers", "Craftsmen, site supervisors, and skilled workers."], ["Contractors & Foremen", "Work leaders together with their teams."], ["Material Suppliers & Vendors", "Material suppliers and support services."]] },
      { label: "Feedback from active partners", forms: [["Contractor & Foreman Feedback", "Project partnership evaluation."], ["Supplier & Vendor Feedback", "Ordering and delivery evaluation."]] },
    ],
  },
  {
    title: "Rent-to-Own",
    note: "Early registration for the program we are preparing. Our team will contact you before the program opens.",
    sections: [
      { label: "Housing providers & developers", forms: [["Boarding House / Rental Home Owners", "Register boarding house, rental, or house units."], ["Partner Developers", "Registration for program partner developers."], ["Developer Interest Survey", "Developers' views on the RTO scheme."]] },
      { label: "Tenants (customers)", forms: [["Prospective Tenant Registration", "Register your interest as a program participant."], ["Tenant Eligibility Survey", "An overview of your capacity and housing needs."]] },
      { label: "Partner & customer feedback", forms: [["Boarding House Owner Feedback", "Housing provider partnership evaluation."], ["Partner Developer Feedback", "Developer partnership evaluation."], ["RTO Customer Feedback", "Participants' experience."]] },
    ],
  },
];

const groupPairs = FORM_GROUPS.flatMap((g, gi) => [
  [g.title, GROUP_EN[gi].title],
  [g.note, GROUP_EN[gi].note],
  ...g.sections.flatMap((s, si) => [
    [s.label, GROUP_EN[gi].sections[si].label],
    ...s.forms.flatMap((f, fi) => [
      [f.title, GROUP_EN[gi].sections[si].forms[fi][0]],
      [f.body, GROUP_EN[gi].sections[si].forms[fi][1]],
    ]),
  ]),
]);

const jalurPairs = JALUR.flatMap((j, ji) => [
  [j.name, JALUR_EN[ji].name],
  [j.status, JALUR_EN[ji].status],
  [j.body, JALUR_EN[ji].body],
  ...j.members.flatMap((m, mi) => [
    [m.name, JALUR_EN[ji].members[mi][0]],
    [m.body, JALUR_EN[ji].members[mi][1]],
  ]),
]);

export const KEMITRAAN: Record<string, string> = {
  // Metadata dan hero
  "Kemitraan barumahID untuk Jasa Konstruksi (tenaga kerja, kontraktor dan mandor, supplier dan vendor) dan program Rent-to-Own (penyedia kos, developer mitra). Freelancer dan fresh graduate melalui Jururancang.":
    "barumahID partnerships for Construction Services (workers, contractors and foremen, suppliers and vendors) and the Rent-to-Own program (boarding house owners, partner developers). Freelancers and fresh graduates via Jururancang.",
  [KEMITRAAN_HERO.title]: "barumahID Partnership",
  [KEMITRAAN_HERO.body]:
    "barumahID offers partnerships in two business lines: Construction Services and Rent-to-Own. Choose the partnership path that fits, complete the registration form, and our team will verify it before your Partner Portal account is activated.",
  [KEMITRAAN_HERO.imageAlt]: "barumahID Construction Services partners",
  "Lihat jalur kemitraan": "See partnership paths",
  "Formulir pendaftaran": "Registration forms",
  "Masuk Portal Mitra →": "Partner Portal sign in →",

  // Jalur
  "Jalur kemitraan": "Partnership paths",
  "Tiga jalur, sesuai peran Anda.": "Three paths, matched to your role.",
  "Lini bisnis barumahID berfokus pada Jasa Konstruksi dan Rent-to-Own. Kolaborasi freelancer dan fresh graduate dikelola Jururancang Engineering Mahaksa.":
    "barumahID's business lines focus on Construction Services and Rent-to-Own. Freelancer and fresh graduate collaboration is managed by Jururancang Engineering Mahaksa.",
  ...Object.fromEntries(jalurPairs),
  "Halo Admin Jururancang, saya ingin bergabung sebagai freelancer Jururancang Team.":
    "Hello Jururancang Admin, I would like to join Jururancang Team as a freelancer.",
  "WhatsApp admin Jururancang": "WhatsApp the Jururancang admin",
  "Lihat formulir": "See forms",

  // Formulir
  Formulir: "Forms",
  "Formulir pendaftaran dan umpan balik.": "Registration and feedback forms.",
  "Seluruh formulir dibuka di Google Form. Gunakan nomor WhatsApp aktif agar tim kami dapat menghubungi Anda.":
    "All forms open in Google Forms. Use an active WhatsApp number so our team can reach you.",
  ...Object.fromEntries(groupPairs),
  Isi: "Open",
  "Pertanyaan lain seputar kemitraan:": "Other questions about partnerships:",
  "Formulir Kontak & Pertanyaan Umum (F19)": "Contact & General Questions Form (F19)",

  // Struktur dan alur
  [PERUBAHAN.label]: "Structure update",
  [PERUBAHAN.title]: "A more focused partnership structure.",
  [PERUBAHAN.body]:
    "barumahID partnerships used to be split across four mitrabarumahID programs. We have now adjusted the structure so every partner is handled by the most relevant unit.",
  Sebelumnya: "Before",
  Sekarang: "Now",
  ...Object.fromEntries(
    PERUBAHAN.rows.flatMap((r) => [
      [r.after, { "Mitra Jasa Konstruksi barumahID": "barumahID Construction Services Partners", "Jururancang Engineering Mahaksa": "Jururancang Engineering Mahaksa", "Mitra Program Rent-to-Own": "Rent-to-Own Program Partners" }[r.after] ?? r.after],
      [r.note, { "Tetap aktif": "Still active", Dilebur: "Merged", "Bagian dari RTO": "Part of RTO" }[r.note] ?? r.note],
    ]),
  ),
  "Alur kemitraan": "Partnership flow",
  "Dari pendaftaran hingga aktif.": "From registration to active.",
  ...zip(
    ALUR.flatMap((a) => [a.title, a.body]),
    [
      "Complete the registration form",
      "Choose the form that matches your partnership path.",
      "Create a Partner Portal account",
      "Use the same email and WhatsApp number as in the form.",
      "Verification by the barumahID team",
      "We contact you to confirm your details and readiness to partner.",
      "Partner dashboard active",
      "Your partnership status and details can be followed from the Partner Portal.",
    ],
  ),
  "Buat akun mitra": "Create a partner account",
  "Masuk Portal Mitra": "Partner Portal sign in",

  // Galeri dan FAQ
  "Di lapangan": "On site",
  "Mitra yang bekerja bersama kami.": "Partners who work with us.",
  ...zip(
    GALERI.map((g) => g.alt),
    [
      "barumahID Construction Services partners at Base barumahID",
      "Handing over mitrabarumahID shirts to partners",
      "barumahID Construction Services partner",
      "A collaboration activity with academics",
    ],
  ),
  "Tanya jawab": "FAQ",
  "Sebelum Anda mendaftar.": "Before you register.",
  ...zip(
    KEMITRAAN_FAQ.flatMap((q) => [q.question, q.answer]),
    [
      "Is there a fee to become a partner?",
      "There is no registration fee for any partnership path.",
      "How long does verification take?",
      "Usually 1 to 3 working days. Our team contacts you on WhatsApp to confirm your details and explain the next steps.",
      "What is the Partner Portal account for?",
      "Once verified, you can see your partnership status, your recorded partner details, and the forms and contacts relevant to your path.",
      "I am a freelancer or fresh graduate. Where do I register?",
      "Freelancer and fresh graduate collaboration is now managed by Jururancang Engineering Mahaksa. Please contact the Jururancang admin on WhatsApp.",
      "Do partners have to be in Padang?",
      "Most of our construction projects are currently in West Sumatra. Developers and housing providers from other cities can still register.",
    ],
  ),

  // Formulir klien di ConTech
  "Formulir klien": "Client forms",
  "Tiga formulir, sesuai tahap proyekmu.": "Three forms, one for each stage of your project.",
  "Diisi langsung oleh klien. Datanya membantu kami menyiapkan penawaran, menjalankan pesanan, dan memperbaiki layanan.":
    "Filled in directly by clients. The answers help us prepare quotes, run your order, and improve our service.",
  ...zip(
    FORM_KLIEN.flatMap((f) => [f.stage, f.title, f.body]),
    [
      "Before the project",
      "Needs Survey & Initial Consultation",
      "Tell us your project's needs, location, and budget.",
      "Ready to order",
      "Construction Service Order",
      "Confirm the chosen service and your project details.",
      "After the project",
      "Service Feedback (NPS)",
      "Rate your experience working with barumahID.",
    ],
  ),
  "Isi formulir": "Open form",

  // Menu Masuk dan Portal
  "Mitra barumahID": "barumahID partner",
  "Tim barumahID": "barumahID team",
  Portal: "Portal",
  Internal: "Internal",
  "Tenaga kerja, kontraktor, supplier, penyedia kos, dan developer mitra.": "Workers, contractors, suppliers, boarding house owners, and partner developers.",
  "Dashboard monitoring tim, struktur organisasi, dan data mitra.": "Team monitoring dashboard, organization structure, and partner data.",
  "Mitra dan tim barumahID masuk lewat Portal. Akun mitra aktif setelah diverifikasi tim kami.":
    "Partners and the barumahID team sign in through the Portal. Partner accounts become active after our team verifies them.",
};

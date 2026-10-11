import { BATCH, KARIER_BIDANG, KARIER_HERO, KARIER_JALUR, KARIER_PENUTUP, KOLABORASI, MAGANG } from "@/data/karier";

// Terjemahan Inggris: halaman Karier (/rekrutmen). Kuncinya teks Indonesia persis dari src/data/karier.ts dan halaman.
// Magang Arsitektur memakai bahasa brosur asli (Inggris) dari user.

const BIDANG_EN = [
  "Architecture",
  "BIM and modelling",
  "Structural design and analysis",
  "Cost estimating",
  "Interior and exterior design",
  "Marketing",
  "Technology and AI",
  "Operations",
];

const JALUR_EN = ["Architecture Internship", "Periodic Recruitment", "Jururancang Freelancer", "General Application"];

const DUTIES_EN = [
  "Assist with architectural design",
  "Communicate and coordinate with team members",
  "Develop architectural solutions",
  "Integrate design elements into the work",
];

const QUALIFICATIONS_EN = [
  "Architecture and architectural design skills",
  "Communication skills",
  "Solution architecture and integration skills",
  "Knowledge of architectural software and tools",
  "Ability to work in a fast-paced environment",
  "Strong attention to detail",
  "Currently enrolled in or graduated from an Architecture program",
];

const STEPS_EN = [
  { title: "Prepare your documents", body: "Your latest CV and portfolio." },
  { title: "Send your application", body: "Send it to {email} with the subject \"Lamaran Magang Arsitektur - Your Name\"." },
  { title: "Hear back from us", body: "Our team will contact shortlisted candidates by email or WhatsApp." },
];

const META_EN: Record<string, string> = {
  Lokasi: "Location",
  Sifat: "Type",
  Bidang: "Field",
  Remote: "Remote",
  "Magang, berdurasi terbatas": "Internship, fixed term",
  Arsitektur: "Architecture",
};

const zip = (ids: string[], en: string[]) => Object.fromEntries(ids.map((id, i) => [id, en[i]]));

export const KARIER: Record<string, string> = {
  // Metadata
  "Peluang karier di barumahID: magang arsitektur remote, rekrutmen berkala, dan freelancer Jururancang Team. Lihat posisi dan cara melamar.":
    "Careers at barumahID: a remote architecture internship, periodic recruitment, and freelance work with Jururancang Team. See open roles and how to apply.",

  // Hero
  [KARIER_HERO.status]: "Architecture Internship open · Remote",
  [KARIER_HERO.hint]: "Move your cursor to reach · Click to send a signal",
  [KARIER_HERO.title]: "Help build a\n[better] construction [ecosystem.]",
  [KARIER_HERO.body]:
    "barumahID is a technology-driven construction company under PT Inditek Bluprim Mahaksa. We offer internships, periodic recruitment, and freelance collaboration for talent who want to grow in architecture, engineering, and construction.",
  [KARIER_HERO.location]: "Padang and remote",
  "Lamar magang": "Apply for the internship",
  "Lihat semua peluang": "See all opportunities",
  "Lokasi kerja": "Work location",
  "Jalur karier": "Career paths",
  "Dibuka hingga {date}": "Open until {date}",
  "Ditutup pada {date}": "Closed on {date}",
  ...zip(
    KARIER_JALUR.map((j) => j.label),
    JALUR_EN,
  ),
  ...zip(KARIER_BIDANG, BIDANG_EN),

  // Magang
  [MAGANG.label]: "(01) Internship program",
  [MAGANG.title]: "Architecture Internship.",
  [MAGANG.subtitle]: "Remote, fixed term.",
  "Menerima lamaran": "Accepting applications",
  "Sedang ditutup": "Currently closed",
  ...META_EN,
  [MAGANG.description]:
    "A temporary remote role for an Architectural Intern at barumahID. The intern will collaborate on architectural projects and gain hands-on experience in the field.",
  "Tanggung jawab": "Responsibilities",
  Kualifikasi: "Qualifications",
  ...zip(MAGANG.duties, DUTIES_EN),
  ...zip(MAGANG.qualifications, QUALIFICATIONS_EN),
  [MAGANG.waMessage]: "Hello barumahID Admin, I would like to ask about the Architecture Internship program.",
  [MAGANG.poster.alt]: "barumahID Internship Opportunities brochure: Architecture Internship",
  "Lihat brosur": "View brochure",
  "Kirim lamaran via email": "Apply by email",
  "Tanya admin via WhatsApp": "Ask our admin on WhatsApp",
  "Cara melamar": "How to apply",
  ...Object.fromEntries(MAGANG.steps.flatMap((s, i) => [
    [s.title, STEPS_EN[i].title],
    [s.body, STEPS_EN[i].body],
  ])),

  // Rekrutmen berkala
  [BATCH.label]: "(02) Periodic recruitment",
  [BATCH.title]: "Periodic recruitment.",
  [BATCH.subtitle]: "Opened in batches.",
  [BATCH.intro]: "We recruit in batches based on team needs. Each batch has a clear application period.",
  [BATCH.name]: "July 2026 Recruitment",
  "Pilih posisi di bawah, lalu lengkapi formulir lamaran.": "Choose a role below, then complete the application form.",
  "Terima kasih kepada seluruh pelamar. Batch berikutnya akan kami umumkan melalui Instagram @barumahid dan halaman ini.":
    "Thank you to everyone who applied. We will announce the next batch on Instagram @barumahid and on this page.",
  "Posisi yang dibuka": "Open roles",
  "Posisi pada batch terakhir": "Roles in the last batch",
  Lamar: "Apply",
  Ditutup: "Closed",
  // Judul posisi
  "Marketing Specialist": "Marketing Specialist",
  "Customer Administration": "Customer Administration",
  "AI Engineer": "AI Engineer",
  "BIM Modeller": "BIM Modeller",
  Arsitek: "Architect",
  "Desainer Interior dan Eksterior": "Interior and Exterior Designer",
  // Divisi dan lokasi
  Marketing: "Marketing",
  Operasional: "Operations",
  Teknologi: "Technology",
  Engineering: "Engineering",
  Desain: "Design",
  "Padang atau remote": "Padang or remote",
  Padang: "Padang",

  // Jalur lain
  [KOLABORASI.label]: "(03) Other paths",
  [KOLABORASI.title]: "Other ways to join.",
  [KOLABORASI.subtitle]: "Project-based or open application.",
  [KOLABORASI.freelance.kicker]: "Freelance",
  [KOLABORASI.freelance.title]: "Join Jururancang Team as a freelancer",
  [KOLABORASI.freelance.body]:
    "For architects, drafters, estimators, and BIM modellers who prefer project-based work. Jururancang Engineering Mahaksa is barumahID's technical partner for drawing and modelling, as well as structural design and analysis. Contact the Jururancang admin on WhatsApp for more information.",
  [KOLABORASI.freelance.cta]: "WhatsApp the Jururancang admin",
  [KOLABORASI.freelance.waMessage]: "Hello Jururancang Admin, I am interested in joining Jururancang Team as a freelancer.",
  [KOLABORASI.general.kicker]: "General application",
  [KOLABORASI.general.title]: "Haven't found the right role?",
  [KOLABORASI.general.body]:
    "Send your CV and portfolio to {email} with the subject \"Lamaran Umum\". We will keep it on file for future recruitment.",
  [KOLABORASI.general.cta]: "Send your CV by email",

  // Penutup
  [KARIER_PENUTUP.title]: "Come and join us.",
  [KARIER_PENUTUP.body]: "We announce new openings on Instagram @barumahid and on this page.",
};

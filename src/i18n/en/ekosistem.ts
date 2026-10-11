import {
  BARUMAHID_INTRO as B,
  EKOSISTEM_HERO as H,
  GROUP_SUBTITLE,
  GROUP_TITLE,
  GROUP_UNITS,
  KEUNGGULAN as K,
  MASALAH as M,
  MISSIONS,
  PILLARS,
  PILLARS_SUBTITLE,
  PILLARS_TITLE,
  VALUES,
  VALUES_SUBTITLE,
  VALUES_TITLE,
  VISION,
} from "@/data/company";
import { HOME_FAQ } from "@/data/faq";

// Terjemahan Inggris: halaman Ekosistem (/tentang), tanya jawab umum, dan panel Kabar di navbar.
// Kunci diambil langsung dari data (src/data/company.ts, faq.ts) supaya tidak salah ketik. Kalau teks Indonesia
// di data diubah, cek juga terjemahannya di sini.

const pairs = (ids: string[], ens: string[]) => Object.fromEntries(ids.map((id, i) => [id, ens[i]]));

export const EKOSISTEM: Record<string, string> = {
  // Menu dan metadata
  Ekosistem: "Ecosystem",
  "Ekosistem | PT Inditek Bluprim Mahaksa dan barumahID": "Ecosystem | PT Inditek Bluprim Mahaksa and barumahID",
  "PT Inditek Bluprim Mahaksa, perusahaan konstruksi di balik barumahID sejak 9 Januari 2024. Gambar & modelling, renovasi & bangun, serta desain & analisa struktur dengan pendekatan LBAG.":
    "PT Inditek Bluprim Mahaksa, the construction company behind barumahID since January 9, 2024. Drawing & modelling, renovation & construction, and structural design & analysis with the LBAG approach.",

  // Hero
  [H.label]: "The barumahID ecosystem",
  ...pairs(H.body, [
    "A construction company established on January 9, 2024. We handle drawing & modelling, renovation & construction, and structural design & analysis.",
    "We work as a general contractor and a construction consultant. Our way of working keeps up with technology through LBAG: Lean Construction, BIM, AI and AR/VR, and Green Construction. We are applying these four concepts step by step to make the construction ecosystem easier, tidier, and more open.",
  ]),
  "Renovasi & Bangun Konstruksi": "Renovation & Construction",
  ...pairs(
    H.images.map((im) => im.alt),
    [
      "The barumahID team with Startup Hour participants",
      "barumahID presenting its idea to the judges",
      "barumahID pitching at the 1000 Startup Digital program",
      "barumahID name card at the Gerakan Nasional 1000 Startup Digital hackathon",
    ],
  ),

  // barumahID itu apa
  [B.label]: "About barumahID",
  [B.title]: "A startup that makes construction and property simpler.",
  ...pairs(B.body, [
    "barumahID is a startup focused on building a technology-driven construction ecosystem in Indonesia. We work in two lines: ConTech for building, and PropTech for owning.",
    "Everything runs in one flow, from design and renovation to construction. Our principle is simple: your project, made easy.",
  ]),
  Desain: "Design",
  Pembangunan: "Construction",
  [B.innovation.label]: "Flagship innovation",
  [B.innovation.body]: "We are preparing an easier, more affordable way to own a home. Stay tuned, it is coming soon.",

  // Masalah
  [M.label]: "Common problems",
  [M.title]: "Building and owning a home is still a headache.",
  [M.intro]: "On the ground, these are the four problems we see most often.",
  ...pairs(
    M.items.map((x) => x.title),
    [
      "It is hard to find design and construction services you can trust.",
      "Costs are unclear, then change halfway through.",
      "Projects run late, with weak supervision and communication.",
      "Owning a home is still hard and rigid.",
    ],
  ),
  ...pairs(
    M.items.map((x) => x.body),
    [
      "There are many options, but it is hard to judge their quality, portfolio, and track record.",
      "Without open calculations, budgets balloon and become hard to control.",
      "Weak coordination delays the work and the result falls short of expectations.",
      "House prices keep rising, while easy and affordable paths to ownership are still few.",
    ],
  ),
  [M.answerTitle]: "barumahID is here to solve all of them.",
  [M.answerBody]: "Through one ecosystem: trusted partners, a transparent process, efficient technology, and an easier, more flexible path to owning a home.",

  // Keunggulan
  [K.label]: "Why us",
  [K.title]: "Why work with barumahID?",
  [K.intro]: "We want building to feel easy, safe, and trustworthy. Here is how.",
  ...pairs(
    K.items.map((x) => x.title),
    [
      "Consultation that stays with you",
      "Competitive pricing",
      "Construction technology",
      "Interactive experience",
      "Sustainability",
      "Partnership",
      "Effective project management",
      "Efficiency",
      "Flexible and practical",
      "Inclusive Rent-to-Own",
    ],
  ),
  ...pairs(
    K.items.map((x) => x.body),
    [
      "From planning to execution, our team is responsive and ready to answer.",
      "Fair and transparent prices. No hidden costs.",
      "Lean Construction and BIM make projects more efficient and accurate.",
      "3D visuals help you see the result first. We are adding AI and AR/VR step by step.",
      "Green Construction practices for more environmentally friendly buildings.",
      "A solid network of construction partners, so every project runs smoothly.",
      "With BIM, everyone works from the same model, so delays are less likely.",
      "Waste is cut through Lean Construction, so your costs go down too.",
      "Services can be tailored to your project's needs.",
      "Being prepared: a path to owning a home without waiting for a big down payment upfront.",
    ],
  ),
  Segera: "Soon",
  [K.closingTitle]: "We do not just build homes, we build trust.",
  [K.closingBody]: "The right solution, an easy process, quality results.",

  // Visi dan misi
  Visi: "Vision",
  Misi: "Mission",
  [VISION]: "To be a pioneer and leader in building a technology-driven construction business ecosystem in Indonesia.",
  ...pairs(MISSIONS, [
    "Bring the latest technology to every project through LBAG (Lean Construction, BIM, AI and AR/VR, Green Construction), so work is more productive and sustainable.",
    "Provide services that are comfortable, safe, and fairly priced for clients and project owners.",
    "Build a solid partnership network among construction businesses.",
    "Make construction services easy to access, from information and consultation to quality results, for clients and partners.",
  ]),

  // LBAG
  "Empat pilar LBAG": "The four LBAG pillars",
  [PILLARS_TITLE]: "LBAG, four ways we build better.",
  [PILLARS_SUBTITLE]: "Four concepts we bring into our business process, and keep developing step by step.",
  "Artinya buat kamu": "What it means for you",
  "Building Information Modeling (BIM)": "Building Information Modeling (BIM)",
  "Lean Construction": "Lean Construction",
  "AI dan AR/VR": "AI and AR/VR",
  "Green Construction": "Green Construction",
  ...pairs(
    PILLARS.map((p) => p.body),
    [
      "Construction processes are optimized so nothing goes to waste.",
      "Planning, design, and project management through a digital model of the building.",
      "AI and AR/VR help you see the design more realistically. We are applying them step by step.",
      "We steer every project to be more environmentally friendly.",
    ],
  ),
  ...pairs(
    PILLARS.map((p) => p.benefit),
    [
      "Time, materials, and costs become more efficient.",
      "Problems show up on screen, not on site.",
      "Better decisions before construction starts.",
      "Energy-efficient, sustainable buildings.",
    ],
  ),

  // BUILD
  "Nilai kami": "Our values",
  "Nilai BUILD": "BUILD values",
  [VALUES_TITLE]: "BUILD. Five values we hold.",
  [VALUES_SUBTITLE]: "These values shape how we work on every project.",
  ...pairs(
    VALUES.map((v) => v.body),
    [
      "We dare to try new ways. Technology like BIM and Lean Construction is used on real projects, not just as jargon.",
      "Clients, team, and partners move in one flow. Everyone knows their role, so projects run more smoothly.",
      "The numbers in our cost estimates can be accounted for. What we agree on at the start is what we deliver.",
      "Buildings are used for decades. We choose methods and materials that last, not just what is cheap today.",
      "Every project built the right way helps families and businesses grow more securely. That is how we measure our work.",
    ],
  ),
  "Motto kami:": "Our motto:",

  // Grup usaha (menunggu revisi user)
  "Grup usaha": "Business group",
  [GROUP_TITLE]: "One group, one direction.",
  [GROUP_SUBTITLE]:
    "barumahID is part of Mahaksa Grup under PT Inditek Bluprim Mahaksa. Each unit has its own role, with one shared goal: building homes and opening access to own them.",
  ...pairs(
    GROUP_UNITS.map((u) => u.role),
    ["Holding company", "Home ownership support platform", "Planning consultant"],
  ),
  ...pairs(
    GROUP_UNITS.map((u) => u.body),
    [
      "The legal entity and holding company for all Mahaksa Grup units.",
      "Construction services through ConTech, a path to ownership through Rent-to-Own.",
      "A planning, design, and structural analysis consultant. The technical partner for all barumahID drawing and structural work.",
    ],
  ),
  ...pairs(
    GROUP_UNITS.map((u) => u.statusLabel),
    ["Holding", "Active", "Active since August 7, 2026"],
  ),

  // Tanya jawab umum (src/data/faq.ts)
  "Kata mereka": "What they say",
  "Tanya jawab": "Questions and answers",
  "Dari klien yang sudah bekerja bersama kami.": "From clients who have worked with us.",
  "Yang paling sering ditanyakan.": "Most frequently asked.",
  "Belum ketemu jawabannya? Tanya langsung ke admin kami. Konsultasi pertama gratis, tanpa komitmen.":
    "Did not find your answer? Ask our admin directly. Your first consultation is free, with no commitment.",
  "Halo barumahID, saya mau tanya.": "Hello barumahID, I have a question.",
  "Tanya lewat WhatsApp": "Ask on WhatsApp",
  ...pairs(
    HOME_FAQ.map((f) => f.question),
    [
      "What is Rent-to-Own at barumahID?",
      "Where will my down payment money be kept?",
      "How long until my down payment is collected?",
      "How much do drawing and structural analysis services cost?",
      "How does payment work for renovation and construction?",
      "How do I become a barumahID partner?",
    ],
  ),
  ...pairs(
    HOME_FAQ.map((f) => f.answer),
    [
      "A rent-while-saving program for your down payment. You rent a barumahID partner unit, and 25% of every rent payment is recorded as your down payment balance. Once the balance is enough, you can move on to an ownership path. The program is still in preparation, so register your interest to hear from us first.",
      "Once the program runs, your down payment balance will be kept in a separate company account and never mixed with operating funds. Balance reports are sent monthly via WhatsApp until the customer dashboard is ready. We will announce the full scheme before the first unit opens.",
      "It depends on your rent, the house price, and your down payment target. Try the down payment simulator on the Rent-to-Own page for an estimate. Keep in mind that house prices can rise while you save.",
      "Drawing and modelling starts at Rp15,000 per m², structural design and analysis starts at Rp18,000 per m². There are Basic, Plus, and Pro packages. The final price depends on project complexity, and your first consultation is free.",
      "Costs are calculated per work item using AHSP (Minister of Public Works Regulation No. 1 of 2022) and local unit prices, then agreed in a cost estimate (RAB) before work starts. Payments are made in stages following progress milestones that we check together.",
      "Open the Partnership page, choose your role (boarding house owner, developer, contractor and foreman, worker, supplier, freelancer, or institution), and fill in a short form. Our team will reach you on WhatsApp.",
    ],
  ),

  // Panel Kabar di navbar
  "Kabar terkini": "Latest news",
  "Kabar terkini konstruksi dan properti": "Latest construction and property news",
  "Konstruksi dan properti, 7 hari terakhir": "Construction and property, last 7 days",
  "Pilih wilayah berita": "Choose news region",
  Indonesia: "Indonesia",
  Dunia: "World",
  "Memuat kabar": "Loading news",
  "Belum ada kabar baru. Coba lagi nanti.": "No new stories yet. Please check back later.",
  "Dirangkum otomatis dari media terpercaya dan diperbarui berkala. Isi berita milik masing-masing media.":
    "Automatically gathered from trusted media and updated regularly. Each story belongs to its publisher.",
};

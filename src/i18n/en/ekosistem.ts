import {
  BARUMAHID_INTRO as B,
  CARA_KERJA as C,
  EKOSISTEM_HERO as H,
  GROUP_SUBTITLE,
  GROUP_TITLE,
  GROUP_UNITS,
  KEUNGGULAN as K,
  MASALAH as M,
  MISSIONS,
  PILLARS,
  VALUES,
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
    "We are a construction company officially established on January 9, 2024. Day to day, we handle drawing and modelling, renovation and construction, all the way to structural design and analysis.",
    "We work as a general contractor and a construction consultant. We love trying new ways of working, and our compass is called LBAG: Lean Construction, BIM, AI and AR/VR, and Green Construction. We believe these four concepts will disrupt Indonesia's construction business ecosystem for the better in the years ahead.",
  ]),
  "Renovasi & Bangun Konstruksi": "Renovation & Construction",
  ...pairs(
    H.images.map((im) => im.alt),
    [
      "The barumahID team with Startup Hour participants",
      "barumahID presenting its idea to the judges",
      "barumahID name plate at the Youth Economic Leadership Program 2019",
      "barumahID name card at the Gerakan Nasional 1000 Startup Digital hackathon",
    ],
  ),

  // barumahID itu apa
  [B.label]: "About barumahID",
  [B.title]: "Making building and owning a home a lot simpler.",
  ...pairs(B.body, [
    "barumahID is a startup building a technology-driven construction ecosystem in Indonesia. We run on two lines: ConTech for building, and PropTech for owning.",
    "Whether you want to design, renovate, or build from scratch, it all starts in one place. Our principle is simple: your project, made easy.",
  ]),
  ...pairs(
    B.lines.map((l) => l.label),
    ["End to End Services", "Partnership", "Rent To Own"],
  ),
  ...pairs(
    B.lines.map((l) => l.body),
    [
      "Drawings, renovation, and construction in one flow.",
      "Builders, foremen, suppliers, and developers growing together.",
      "Rent first, and part of your rent becomes your down payment balance.",
    ],
  ),
  [B.innovation.label]: "Flagship innovation",
  [B.innovation.body]:
    "We want to walk with you every step of the way to a home of your own. From renting, to slowly building up your down payment, until the home is finally yours. The program is being prepared and coming soon.",

  // Masalah
  [M.label]: "Common problems",
  [M.title]: "Let's be honest, building and owning a home is still a headache.",
  [M.intro]: "From talking with clients and our own experience on site, these four things hold projects back the most.",
  ...pairs(
    M.items.map((x) => x.title),
    [
      "Not sure which service you can trust.",
      "Costs are unclear and keep changing halfway through.",
      "Projects run late and communication keeps breaking down.",
      "Owning your own home feels further and further away.",
    ],
  ),
  ...pairs(
    M.items.map((x) => x.body),
    [
      "There are plenty of options, but it is hard to tell who is truly skilled. Portfolios and track records are often unclear, so in the end you choose on trust alone.",
      "Without open calculations from the start, budgets balloon easily. Suddenly there are extra costs nobody ever talked about.",
      "Loose supervision and poor coordination delay the work. The end result is often different from what you pictured.",
      "House prices keep rising, the down payment feels heavy, and flexible paths to ownership are still few.",
    ],
  ),
  [M.answerTitle]: "That is why barumahID exists.",
  [M.answerBody]:
    "We bring it all together in one ecosystem: trusted partners, transparent costs, technology that makes work efficient, and a path to owning a home that is kinder to your wallet.",

  // Keunggulan
  [K.label]: "Why us",
  [K.title]: "Why work with barumahID?",
  [K.intro]: "We want building to feel calm, not stressful. Here is what we offer.",
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
      "From planning to execution, our team is easy to talk to and quick to answer.",
      "Fair prices, calculated in the open. No hidden costs.",
      "Lean Construction and BIM make projects more efficient and calculations more accurate.",
      "3D visuals help you see the result first. AI and AR/VR are coming step by step.",
      "Green Construction for buildings that are more environmentally friendly and last longer.",
      "Backed by a solid network of construction partners, so projects run smoothly.",
      "With BIM, everyone works from the same model. Fewer misunderstandings, less risk of delays.",
      "Waste is cut through Lean Construction, so your costs go down too.",
      "Services can be tailored to your project's needs and conditions.",
      "Being prepared: a path to owning a home without waiting for a big down payment upfront.",
    ],
  ),
  Segera: "Soon",
  [K.closingTitle]: "We do not just build homes, we build trust.",
  [K.closingBody]: "The right solution, an easy process, results you can rely on.",

  // Visi dan misi
  Visi: "Vision",
  Misi: "Mission",
  [VISION]: "To be a pioneer and leader in building a technology-driven construction business ecosystem in Indonesia.",
  ...pairs(MISSIONS, [
    "Bring the latest technology to every project through LBAG, so work is more productive and sustainable.",
    "Provide services that are comfortable, safe, and fairly priced, for clients and project owners alike.",
    "Bring construction businesses together into a solid partnership network.",
    "Make construction services easy to access, from finding information and consultation to quality results.",
  ]),

  // Cara kami bekerja: LBAG dan BUILD
  [C.label]: "How we work",
  [C.title]: "LBAG and BUILD, our compass on every project.",
  [C.subtitle]: "LBAG is how we work, BUILD is what we stand for. Hover over or tap a letter.",
  [C.lbagLabel]: "LBAG · Four technology pillars",
  [C.buildLabel]: "BUILD · Our five values",
  "Artinya buat kamu": "What it means for you",
  "Building Information Modeling (BIM)": "Building Information Modeling (BIM)",
  "Lean Construction": "Lean Construction",
  "AI dan AR/VR": "AI and AR/VR",
  "Green Construction": "Green Construction",
  ...pairs(
    PILLARS.map((p) => p.body),
    [
      "Processes are tidied up from the start so nothing goes to waste.",
      "The building is modelled digitally first, from planning to project management.",
      "See the design more realistically before it is built. We are applying this step by step.",
      "We steer every project to be more environmentally friendly.",
    ],
  ),
  ...pairs(
    PILLARS.map((p) => p.benefit),
    [
      "Time, materials, and costs become more efficient.",
      "Problems show up on screen, not on site.",
      "More accurate, more confident decisions.",
      "Energy-efficient buildings that last.",
    ],
  ),
  "Bold Innovation": "Bold Innovation",
  "United Ecosystem": "United Ecosystem",
  Integrity: "Integrity",
  "Long-term Thinking": "Long-term Thinking",
  "Driven by Impact": "Driven by Impact",
  ...pairs(
    VALUES.map((v) => v.body),
    [
      "We dare to try new ways. BIM and Lean Construction are used on real projects, not just as jargon.",
      "Clients, team, and partners move together in one flow. Everyone knows their role, so projects run more smoothly.",
      "Every number in our cost estimate can be accounted for. What we agree on at the start is what we deliver.",
      "Buildings are used for decades. We choose methods and materials that last, not just what is cheap today.",
      "Every building that stands the right way helps families and businesses grow with more peace of mind. That is how we measure our work.",
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

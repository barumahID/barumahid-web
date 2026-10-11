import { DIVISIONS, SEMESTA, UNITS } from "@/data/semesta";

// Terjemahan Inggris: bagian "Astro Mahaksa" (src/data/semesta.ts). Kunci diambil dari data.

const body: Record<string, string> = {
  barumahid:
    "Integrated design, construction, renovation, and contracting services. It is also where we open the path to a home of your own through Rent-to-Own.",
  jururancang:
    "Jururancang Engineering Mahaksa: professional architectural planning and engineering. The technical partner for all barumahID drawing and structural work.",
  "piatu-tim": "A foundation offering SaaS services to manage community funds at mosques. The app is being built while testing real market needs along the way.",
  betools:
    "A retail store for tools and construction needs, like a building supply shop. It began with \"Safety All in One\", a construction protective equipment idea we brought to an innovation competition.",
  protonlabs:
    "Research and development in technology and materials. We have researched eco-friendly concrete, precise-grade concrete, high-strength concrete, and lightweight concrete, plus a vehicle counter using motion sensors and YOLO.",
  homematery: "Sells products born from ProtonLabs innovation, such as lightweight bricks, paving blocks, and ventilation blocks. The research is there, ready to become products.",
  simplee: "A minimalist, modern Muslim fashion brand. We ran it before, and the lessons are our starting point for trying again.",
  nasikotak: "A food brand built on practical, quality meals. The recipes have been tested through a franchise scheme, waiting for the right time to sell.",
  "anta-fruchte": "Fresh, healthy, modern fruit snacks. It started from a love of street-side cut fruit, then became an entrepreneurship project that earned an A.",
  mahamukena: "Premium, elegant Muslim womenswear. We sold it before, and the hard experience became a valuable lesson for the next step.",
};

const focus: Record<string, string> = {
  inditek: "Innovation & Technology",
  bluprim: "Brands & Services",
  mahaksa: "Construction & Property",
};

export const SEMESTA_EN: Record<string, string> = {
  [SEMESTA.label]: "Astro Mahaksa",
  [SEMESTA.title]: "One core, three orbits. This is our dream for the future.",
  [SEMESTA.intro]:
    "PT Inditek Bluprim Mahaksa has three divisions, just like its name: Inditek for innovation and technology, Bluprim for brands and services, Mahaksa for construction and property. Some are already running, others are ideas we have tried before and are ready to build again. We write the numbers honestly, based on where each one stands today.",
  [SEMESTA.hint]: "Drag to rotate, pick a logo to read its story.",
  Berjalan: "Running",
  Ide: "Idea",
  "{n} unit · {r} berjalan": "{n} units · {r} running",
  ...Object.fromEntries(DIVISIONS.map((d) => [d.focus, focus[d.id]])),
  ...Object.fromEntries(UNITS.filter((u) => body[u.id]).map((u) => [u.body, body[u.id]])),
};

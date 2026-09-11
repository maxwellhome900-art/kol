/** Central content — edit names, links, pricing, and gallery here. */

export const site = {
  name: "Mark",
  businessName: "Mark Photography",
  /** Floating studio agent */
  agentName: "Marko AI",
  tagline: "Software Engineer by Morning, Photographer by Night",
  headline: "Software Engineer by Morning, Photographer by Night",
  /** Hero title */
  photographyHeadline: "Software Engineer by Morning, Photographer by Night",
  photographySubheadline:
    "Mornings belong to code. Nights belong to the city lights and long exposures.",
  /** Hero line 2: follows “Sessions run from” + bold “7 PM — 1 AM” in `Hero.tsx`. */
  photographyHeroSessionTail:
    ", when the streets quiet down and the real moments appear.",
  /** Hero line 3: follows linked `agentName`. */
  photographyHeroMarkoTail:
    "is always in the corner — ready to handle bookings, timelines, and everything in one seamless conversation.",
  eveningHoldWindowLabel: "Evening holds: 7:00 PM – 1:00 AM on your selected night.",
  /** Software engineer route — same dual-craft voice as photography. */
  devHeadline: "Software Engineer by Morning, Photographer by Night",
  devSubheadline:
    "The same eye that times a neon exposure also ships resilient Next.js apps, APIs, and design systems — cinematic interfaces with production discipline.",
  /** Hero line 2 for /dev */
  devHeroCraftTail:
    "Daytime work is TypeScript, product judgment, and motion-aware UI. After hours, that same composition sense goes into Times Square sessions.",
  /** Hero line 3 for /dev — follows linked agentName */
  devHeroMarkoTail:
    "can brief a hire, walk engagements, and stay with you one question at a time.",
  email: "markmarc2500@gmail.com",
  phone: "3472965509",
  phoneDisplay: "(347) 296-5509",
  phoneHref: "tel:+13472965509",
  /** Legacy external scheduling — smart booking lives on-site at #booking */
  schedulingUrl: "https://calendly.com/mark-photography",
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
};

export type PriceTier = {
  name: string;
  tagline: string;
  price: string;
  unit?: string;
  features: string[];
  highlighted?: boolean;
};

export const pricingTiers: PriceTier[] = [
  {
    name: "Portrait session",
    tagline:
      "A focused session for editorial portraits, city-light framing, and polished final selects.",
    price: "$350",
    unit: "/ session",
    features: [
      "45 minute shoot with guided posing and direction",
      "15+ hand-edited high-resolution images",
      "Private gallery delivery for final selection",
      "Ideal for portraits, mini campaigns, and personal branding",
    ],
    highlighted: false,
  },
  {
    name: "Extended session",
    tagline:
      "More time for outfits, movement, multiple looks, and a larger gallery to choose from.",
    price: "$450",
    unit: "/ session",
    features: [
      "60 minute shoot with more location and styling flexibility",
      "25+ refined high-resolution images",
      "Priority editing + gallery + print-ready delivery",
      "Perfect for full branding, couples, or storytelling sets",
    ],
    highlighted: true,
  },
];

export type Project = {
  title: string;
  description: string;
  image: string;
  stack: string[];
  github?: string;
  demo?: string;
  demoLabel?: string;
};

export const projects: Project[] = [
  {
    title: "Mark Photography",
    description:
      "This dual-identity studio site — luxury gallery, intelligent evening holds, Marko AI, and a live operations dashboard.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    demo: "/",
    demoLabel: "Open studio",
  },
  {
    title: "Aether Market",
    description:
      "Editorial ecommerce frontend — collections, product pages, a live cart, and a demo checkout for cinematic objects and print editions.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    demo: "/work/aether",
    demoLabel: "Open shop",
  },
  {
    title: "Harbor Estates",
    description:
      "Luxury real-estate frontend — neighborhood search, listing detail, and an inquiry flow for New York residences.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    demo: "/work/harbor",
    demoLabel: "Open listings",
  },
  {
    title: "Nebula Dashboard",
    description:
      "Analytics frontend — KPI tiles, traffic charts, a live operations feed, and role-aware views for viewer, operator, and admin.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    demo: "/work/nebula",
    demoLabel: "Open dashboard",
  },
  {
    title: "Atlas Design System",
    description:
      "Live design-system docs — color and type tokens, accessible primitives, and motion examples you can click through.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    stack: ["React", "TypeScript", "Framer Motion", "Tailwind"],
    demo: "/work/atlas",
    demoLabel: "Open system",
  },
];

export type CaseStudy = {
  title: string;
  client: string;
  summary: string;
  outcome: string;
  metrics: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Storefront that converts",
    client: "Direct-to-consumer brand",
    summary:
      "Rebuilt catalog, product, and checkout pages as a Next.js storefront — faster loads, clearer hierarchy, and a cart that kept state.",
    outcome:
      "Shoppers reached checkout without the old maze of pages.",
    metrics: [
      { label: "P95 load", value: "−58%" },
      { label: "Checkout", value: "+34%" },
    ],
  },
  {
    title: "Booking, end to end",
    client: "Service studio",
    summary:
      "Shipped a full-stack web app: React calendar and holds on the front, Node APIs and persistence on the back — one flow from date pick to confirmation email.",
    outcome:
      "The team stopped juggling spreadsheets; clients booked without a phone call.",
    metrics: [
      { label: "No-shows", value: "−29%" },
      { label: "Bookings", value: "+46%" },
    ],
  },
  {
    title: "APIs the UI can trust",
    client: "SaaS product team",
    summary:
      "Designed REST endpoints, auth, and validation so the React dashboard stopped guessing — typed contracts, error states, and a backend that matched the screens.",
    outcome:
      "Frontend and backend shipped in lockstep instead of waiting on mystery payloads.",
    metrics: [
      { label: "API errors", value: "−41%" },
      { label: "Ship cycle", value: "−2 wks" },
    ],
  },
];

/** Times Square area — gallery categories */
export type GalleryCategory = "Featured" | "Portraits" | "Street";
export type StudioGalleryCategory = "Portraits" | "Street";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
};

/**
 * Homepage photos: drop files in `public/Featured`.
 * Full gallery: `public/Portraits` and `public/Street`.
 * All three load via `/api/images`.
 */
export const gallery: GalleryItem[] = [];

export const skills = [
  { name: "React", level: 92 },
  { name: "Next.js", level: 90 },
  { name: "Tailwind", level: 95 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX", level: 88 },
  { name: "Lightroom", level: 82 },
  { name: "Photoshop", level: 78 },
  { name: "Photography Editing", level: 90 },
] as const;

export const sessionTypes = [
  '$350 — portrait session, 45 min, 15+ images',
  '$450 — extended session, 60 min, 25+ images',
  'Only pictures — from $10',
  'Street / documentary',
  'Custom Times Square session',
] as const;

export type SessionType = (typeof sessionTypes)[number];

/** Package amount for a given session label. */
export function priceForSessionType(sessionType: string): number {
  const value = sessionType.toLowerCase();
  if (value.includes("$450") || value.includes("extended")) return 450;
  if (value.includes("picture") || value.includes("$10")) return 10;
  if (value.includes("$350") || value.includes("portrait")) return 350;
  if (value.includes("street") || value.includes("custom")) return 350;
  return 350;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Display “First L.” so family names stay private. */
export function shortReviewName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name;
  const first = parts[0];
  const family = parts[parts.length - 1];
  const initial = family.charAt(0).toUpperCase();
  return `${first} ${initial}.`;
}

export type EngineeringService = {
  name: string;
  tagline: string;
  price: string;
  unit?: string;
  features: string[];
  highlighted?: boolean;
};

export const engineeringServices: EngineeringService[] = [
  {
    name: "Product sprint",
    tagline:
      "A focused week to unstick a surface — IA, component work, and a shippable slice.",
    price: "From $2,500",
    unit: "/ sprint",
    features: [
      "Discovery call and written plan",
      "Next.js / TypeScript delivery",
      "Motion and accessibility baked in",
      "Documented handoff for your team",
    ],
  },
  {
    name: "Full-stack build",
    tagline:
      "End-to-end product craft — the same cinematic polish as this photography studio site.",
    price: "From $8,000",
    unit: "/ engagement",
    features: [
      "App Router, APIs, and design tokens",
      "Booking, dashboard, or commerce flows",
      "Auth, email, or webhook wiring",
      "Launch support and async follow-up",
    ],
    highlighted: true,
  },
  {
    name: "Design system",
    tagline:
      "Tokens, primitives, and documentation so squads compose without drifting off-brand.",
    price: "From $4,500",
    unit: "/ system",
    features: [
      "Color, type, and motion tokens",
      "Accessible component library",
      "Story-ready usage examples",
      "Theme (dark / light) from day one",
    ],
  },
];

export type EngineeringReview = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: 5;
  featured?: boolean;
};

export const engineeringReviews: EngineeringReview[] = [
  {
    quote:
      "The frontend was the problem — slow screens, unclear hierarchy, forms that fought the user. Mark rebuilt it in Next.js so the product finally felt as good as the pitch.",
    name: "Priya Nandakumar",
    role: "Head of Product",
    company: "SaaS team",
    rating: 5,
    featured: true,
  },
  {
    quote:
      "He didn't just style components. Auth, API routes, and the database work were as careful as the UI. We got a real full-stack web app, not a pretty shell.",
    name: "James Okonkwo",
    role: "Engineering manager",
    company: "Growth startup",
    rating: 5,
  },
  {
    quote:
      "Our backend was a pile of one-off endpoints. Mark cleaned the contracts, added validation, and made the React dashboard stop guessing. Frontend and backend finally spoke the same language.",
    name: "Elena Voss",
    role: "Staff engineer",
    company: "Product company",
    rating: 5,
  },
  {
    quote:
      "We needed a site that looked considered and still talked to real APIs — bookings, email, a small admin. Mark handled both sides. Clients actually finish the flow now.",
    name: "Sofia Alvarez",
    role: "Founder",
    company: "Independent studio",
    rating: 5,
  },
];

export type PhotographyReviewLayout = "featured" | "narrow" | "compact" | "wide";

export type PhotographyReview = {
  quote: string;
  name: string;
  role: string;
  country: string;
  city: string;
  met: string;
  layout: PhotographyReviewLayout;
  rating: 5;
};

/** Sample / fictional composites for the photography page — not quotes from named clients. */
export const photographyReviews: PhotographyReview[] = [
  {
    name: "Chiara Benedetti",
    role: "Art restorer visiting from Florence",
    city: "Florence",
    country: "Italy",
    met: "Times Square",
    layout: "featured",
    rating: 5,
    quote: [
      "I met Mark in Times Square as a tourist from Florence, still blinking at the screens, trying to take the same photograph everyone else was taking. He was finishing a portrait on the TKTS stairs and somehow still had time to be extremely professional with a stranger who only wanted a decent picture of the lights.",
      "The talent was obvious within a minute. What stayed with me is how he talks about a café corner, a church door, a worn piece of pietra serena, the way a Florentine talks about a fresco: not decoration, but people, trade, and time. He knew enough about our art, history, and civic philosophy to make me look at New York differently.",
      "Then he photographed the feeling rather than the postcard.",
      "He does not simply take a picture of a street, a building, or a person. He keeps the atmosphere, the emotion, the meaning.",
      "That told me everything.",
    ].join("\n\n"),
  },
  {
    name: "Agnieszka Wójcik",
    role: "Museum educator from Kraków",
    city: "Kraków",
    country: "Poland",
    met: "42nd Street",
    layout: "narrow",
    rating: 5,
    quote: [
      "I met Mark on 42nd Street, tired and completely jet-lagged from Kraków. We started talking about photography and somehow ended up talking about Poland — our history, reconstruction, and why ordinary streets can carry so much memory.",
      "He really knows these things. More importantly, he knows how to tell the story through a photograph.",
      "Professional, talented, generous. He notices what most people walk past.",
    ].join("\n\n"),
  },
  {
    name: "Javier Morales",
    role: "Visiting from Seville",
    city: "Seville",
    country: "Spain",
    met: "45th Street",
    layout: "compact",
    rating: 5,
    quote: [
      "I bumped into Mark on 45th Street while looking for TKTS. He was photographing a corner that I probably would have walked straight past.",
      "We talked about Spain for a few minutes and I was surprised by how much he knew — our streets, history, architecture and traditions.",
      "Then he showed me the photograph.",
      "It wasn't just a picture of the place anymore. It had a story.",
    ].join("\n\n"),
  },
  {
    name: "Irina Sokolova",
    role: "Literature lecturer visiting from Saint Petersburg",
    city: "Saint Petersburg",
    country: "Russia",
    met: "Times Square",
    layout: "wide",
    rating: 5,
    quote: [
      "I met Mark in Times Square and was surprised by how much he knew about Russia — Dostoevsky, Tolstoy, our history, literature and philosophy. We were standing in one of the busiest places in New York, yet he was talking about the meaning behind a building, a street, even the light.",
      "That is what I like about his photography. He doesn't just take a picture; he tries to understand the place first.",
      "Very professional, very talented, and genuinely kind.",
    ].join("\n\n"),
  },
];

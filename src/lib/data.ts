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
  /** Web development route */
  devHeadline: "Interfaces, Systems, and Product Craft",
  devSubheadline:
    "Full-stack engineering with a designer's eye — shipping resilient Next.js apps, APIs, and design systems that feel inevitable in the hand.",
  email: "mark@example.com",
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
    name: "Night session — editorial",
    tagline:
      "One hour on the avenue, full digital set, and tactile 6×4\" prints.",
    price: "$449",
    unit: "/ session",
    features: [
      "60 minute shoot (evening holds)",
      "30+ hand-edited high-resolution images",
      "20 professional 6×4 inch prints (your selects; lustre or matte)",
      "Private online gallery + full print release on files",
    ],
    highlighted: false,
  },
  {
    name: "Night session — extended",
    tagline:
      "Ninety minutes, a deeper edit count, and a larger 6×4\" print bundle.",
    price: "$699",
    unit: "/ session",
    features: [
      "90 minute shoot (evening holds)",
      "45+ hand-edited high-resolution images",
      "35 professional 6×4 inch prints (your selects; lustre or matte)",
      "Priority turnaround + gallery + print release",
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
};

export const projects: Project[] = [
  {
    title: "Nebula Dashboard",
    description:
      "Real-time analytics UI with streaming charts, role-based access, and edge-cached API routes.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    stack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://vercel.com",
  },
  {
    title: "Lumen API Gateway",
    description:
      "Composable microservice gateway with observability hooks, rate limits, and graceful degradation.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    stack: ["Node.js", "Redis", "OpenTelemetry", "Docker"],
    github: "https://github.com",
  },
  {
    title: "Atlas Design System",
    description:
      "Accessible component library with documentation, theming tokens, and motion primitives.",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80",
    stack: ["React", "Storybook", "Framer Motion", "Figma"],
    demo: "https://vercel.com",
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
    title: "Latency to clarity",
    client: "SaaS analytics",
    summary:
      "Rebuilt a congested reporting surface into a streaming-first experience with optimistic UI and skeleton contracts.",
    outcome: "Support tickets down, session depth up — stakeholders finally trusted the numbers.",
    metrics: [
      { label: "P95 load", value: "−62%" },
      { label: "Adoption", value: "+41%" },
    ],
  },
  {
    title: "Design system at scale",
    client: "Enterprise fintech",
    summary:
      "Shipped tokens, primitives, and documentation that let squads compose without drifting off-brand.",
    outcome: "Faster feature cycles with fewer one-off components.",
    metrics: [
      { label: "Reuse", value: "78%" },
      { label: "A11y", value: "AA" },
    ],
  },
  {
    title: "Gateway hardening",
    client: "API platform",
    summary:
      "Introduced rate limits, circuit breakers, and tracing hooks without breaking existing consumers.",
    outcome: "Incidents became diagnosable in minutes instead of hours.",
    metrics: [
      { label: "MTTR", value: "−48%" },
      { label: "Errors", value: "−35%" },
    ],
  },
];

/** Times Square area — gallery categories */
export type GalleryCategory = "Portraits" | "Street";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  aspect: "landscape" | "portrait" | "square";
};

export const gallery: GalleryItem[] = [
  {
    id: "ts-1",
    src: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80",
    alt: "Neon canyon — Times Square after dark",
    category: "Street",
    aspect: "landscape",
  },
  {
    id: "ts-2",
    src: "https://images.unsplash.com/photo-1528291155803-d0885a1f38c8?w=900&q=80",
    alt: "Crosswalk cadence under LED rain",
    category: "Street",
    aspect: "landscape",
  },
  {
    id: "ts-3",
    src: "https://images.unsplash.com/photo-1496442226666-8d4d0ac62cd5?w=900&q=80",
    alt: "Manhattan layers above the theater district",
    category: "Street",
    aspect: "landscape",
  },
  {
    id: "ts-4",
    src: "https://images.unsplash.com/photo-1518391846015-55a9cc003a25?w=900&q=80",
    alt: "Winter steam and yellow cabs at the core",
    category: "Street",
    aspect: "portrait",
  },
  {
    id: "ts-5",
    src: "https://images.unsplash.com/photo-1581459537672-c3c17c857f79?w=900&q=80",
    alt: "Broadway rhythm, slow shutter",
    category: "Street",
    aspect: "landscape",
  },
  {
    id: "ts-6",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80",
    alt: "Portrait — soft key against glass towers",
    category: "Portraits",
    aspect: "portrait",
  },
  {
    id: "ts-7",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80",
    alt: "Editorial stance, Seventh Avenue glow",
    category: "Portraits",
    aspect: "portrait",
  },
  {
    id: "ts-8",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80",
    alt: "Classic headshot with urban bokeh",
    category: "Portraits",
    aspect: "square",
  },
  {
    id: "ts-9",
    src: "https://images.unsplash.com/photo-1485871984510-bc9e968fc820?w=900&q=80",
    alt: "Environmental portrait — red steps energy",
    category: "Portraits",
    aspect: "portrait",
  },
  {
    id: "ts-10",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
    alt: "Cinematic close portrait, midnight chrome",
    category: "Portraits",
    aspect: "square",
  },
];

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
  '$449 — 60 min, 30+ images, 20× 6×4" prints',
  '$699 — 90 min, 45+ images, 35× 6×4" prints',
  "Street / documentary",
  "Custom Times Square session",
] as const;

export type SessionType = (typeof sessionTypes)[number];

export const atlasNav = [
  { href: "/work/atlas", label: "Overview" },
  { href: "/work/atlas/tokens", label: "Tokens" },
  { href: "/work/atlas/components", label: "Components" },
  { href: "/work/atlas/motion", label: "Motion" },
] as const;

export type AtlasColorToken = {
  name: string;
  hex: string;
  usage: string;
};

export const atlasColors: AtlasColorToken[] = [
  { name: "ink", hex: "#0b1020", usage: "Page background, inverse text" },
  { name: "paper", hex: "#f4f1ea", usage: "Light surfaces, print-like panels" },
  { name: "signal", hex: "#38bdf8", usage: "Focus rings, primary actions" },
  { name: "ember", hex: "#fbbf24", usage: "Photography accent, warnings" },
  { name: "mist", hex: "#94a3b8", usage: "Muted copy, borders" },
  { name: "ok", hex: "#34d399", usage: "Success, healthy status" },
];

export const atlasTypeScale = [
  { name: "display", size: "2.5rem", weight: "600", sample: "Atlas" },
  { name: "title", size: "1.5rem", weight: "600", sample: "Section title" },
  { name: "body", size: "1rem", weight: "400", sample: "Readable product copy." },
  { name: "caption", size: "0.75rem", weight: "500", sample: "META / LABEL" },
];

export const atlasMotion = [
  { name: "fade-up", duration: "420ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { name: "spring-soft", duration: "520ms", easing: "spring(260, 22)" },
  { name: "lift", duration: "200ms", easing: "ease-out" },
];

export const atlasPrinciples = [
  {
    title: "Hierarchy first",
    body: "One focal plane per view. Contrast does the work that decoration used to.",
  },
  {
    title: "Tokens before one-offs",
    body: "Color, type, and motion come from the sheet — squads compose, they do not invent.",
  },
  {
    title: "Motion with a job",
    body: "Enter, confirm, or get out of the way. No ornamental bounce on data.",
  },
];

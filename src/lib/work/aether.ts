export const aetherCategories = [
  "All",
  "Apparel",
  "Objects",
  "Fragrance",
  "Editions",
] as const;

export type AetherFilter = (typeof aetherCategories)[number];
export type AetherCategory = Exclude<AetherFilter, "All">;

export type AetherProduct = {
  slug: string;
  name: string;
  price: number;
  category: AetherCategory;
  tagline: string;
  description: string;
  details: string[];
  image: string;
};

export const aetherProducts: AetherProduct[] = [
  {
    slug: "nocturne-coat",
    name: "Nocturne wool coat",
    price: 680,
    category: "Apparel",
    tagline: "Cut for city light after 7 PM.",
    description:
      "A double-faced wool coat with a quiet shoulder and a long drape. Designed to read as silhouette first — the same way a frame holds a figure against neon.",
    details: ["Italian wool blend", "Unlined body", "Hidden buttons", "Made to order 2–3 weeks"],
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&q=80",
  },
  {
    slug: "ember-bag",
    name: "Ember leather tote",
    price: 420,
    category: "Objects",
    tagline: "One compartment. No noise.",
    description:
      "Vegetable-tanned leather that darkens with the weather. Wide enough for a 14-inch laptop, quiet enough for an evening walk through Times Square.",
    details: ["Full-grain leather", "Unlined interior", "Brass hardware", "Fits 14\" laptop"],
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=80",
  },
  {
    slug: "after-hours",
    name: "After Hours eau de parfum",
    price: 165,
    category: "Fragrance",
    tagline: "Rain on warm stone.",
    description:
      "Bergamot, vetiver, and a dry amber base. Mixed for rooms with low lamps and open windows — not a department-store blast.",
    details: ["50 ml", "Alcohol denat.", "Hand-poured in Brooklyn", "Refillable bottle"],
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&q=80",
  },
  {
    slug: "tkts-print",
    name: "TKTS stairs — edition of 25",
    price: 240,
    category: "Editions",
    tagline: "Archival pigment on Hahnemühle.",
    description:
      "A Times Square frame from the red stairs: the crowd as texture, the lights as architecture. Signed and numbered on the verso.",
    details: ["16 × 20 in", "Archival pigment", "Edition of 25 + 2 AP", "Ships flat, insured"],
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0ac62cd5?w=1400&q=80",
  },
  {
    slug: "signal-watch",
    name: "Signal field watch",
    price: 890,
    category: "Objects",
    tagline: "A quiet face for loud streets.",
    description:
      "Sapphire crystal, a matte dial, and a strap that looks like it already lived a few cities. No date window. No chrome shout.",
    details: ["40 mm case", "Sapphire crystal", "5 ATM", "Italian leather strap"],
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80",
  },
  {
    slug: "loft-lamp",
    name: "Loft brass lamp",
    price: 310,
    category: "Objects",
    tagline: "Warm pool, not a spotlight.",
    description:
      "A dimmable brass lamp with a linen shade. Built for desks that also host contact sheets and a second espresso.",
    details: ["Solid brass", "Linen shade", "Dimmable E26", "6 ft cloth cord"],
    image:
      "https://images.unsplash.com/photo-1507473886605-4e3221fbb1c6?w=1400&q=80",
  },
  {
    slug: "midnight-sneakers",
    name: "Midnight court sneaker",
    price: 220,
    category: "Apparel",
    tagline: "For walking the grid after rain.",
    description:
      "A low court shoe in ink leather with a gum sole. Meant to disappear under a coat hem, then hold up on wet sidewalks.",
    details: ["Calf leather", "Gum rubber sole", "Removable insole", "Made in Portugal"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80",
  },
  {
    slug: "42nd-print",
    name: "42nd Street — edition of 25",
    price: 240,
    category: "Editions",
    tagline: "A corridor of signs, held still.",
    description:
      "Looking west as the marquees stack. Printed with deep blacks so the neon sits on top of the street instead of bleaching it.",
    details: ["16 × 20 in", "Archival pigment", "Edition of 25 + 2 AP", "Signed on verso"],
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1400&q=80",
  },
  {
    slug: "studio-chair",
    name: "Studio lounge chair",
    price: 1240,
    category: "Objects",
    tagline: "A pause between edits.",
    description:
      "Walnut frame, wool upholstery, and a pitch that lets you sit with a print without sliding forward. One chair, not a set.",
    details: ["Walnut + wool", "Kiln-dried frame", "Made in Hudson Valley", "White-glove option"],
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=80",
  },
];

export function getAetherProduct(slug: string): AetherProduct | undefined {
  return aetherProducts.find((product) => product.slug === slug);
}

export function filterAetherProducts(filter: AetherFilter): AetherProduct[] {
  if (filter === "All") return aetherProducts;
  return aetherProducts.filter((product) => product.category === filter);
}

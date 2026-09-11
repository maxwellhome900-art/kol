export const harborNeighborhoods = [
  "All",
  "Chelsea",
  "Tribeca",
  "West Village",
  "Brooklyn Heights",
  "Williamsburg",
  "Upper West Side",
] as const;

export type HarborNeighborhoodFilter = (typeof harborNeighborhoods)[number];
export type HarborNeighborhood = Exclude<HarborNeighborhoodFilter, "All">;

export type HarborHomeType = "Condo" | "Townhouse" | "Loft" | "Penthouse";

/** Brand + hero stills for the Harbor Estates frontend. */
export const harborBrandImage =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80";
export const harborHeroImage =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=80";

export type HarborListing = {
  slug: string;
  title: string;
  neighborhood: HarborNeighborhood;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: HarborHomeType;
  status: "For sale" | "Open house";
  blurb: string;
  story: string;
  highlights: string[];
  image: string;
  gallery: string[];
};

export const harborListings: HarborListing[] = [
  {
    slug: "chelsea-loft-19",
    title: "19th Street loft with north light",
    neighborhood: "Chelsea",
    price: 2_450_000,
    beds: 2,
    baths: 2,
    sqft: 1680,
    type: "Loft",
    status: "For sale",
    blurb: "Cast-iron columns, a quiet kitchen, and windows that hold the afternoon.",
    story:
      "A converted loft a few blocks west of the High Line. The living volume is one long room — gallery wall on one side, a walnut kitchen on the other — so evening light lands the way a photographer would stage it.",
    highlights: ["12 ft ceilings", "Chef’s kitchen", "Private storage", "Live-work friendly"],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
      "https://images.unsplash.com/photo-1556912173-3d153f0f4746?w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
    ],
  },
  {
    slug: "tribeca-penthouse",
    title: "Tribeca penthouse with a roof terrace",
    neighborhood: "Tribeca",
    price: 7_900_000,
    beds: 3,
    baths: 3.5,
    sqft: 2840,
    type: "Penthouse",
    status: "Open house",
    blurb: "A private terrace, a stone kitchen, and downtown held in one frame.",
    story:
      "Set back from the street so the terrace feels like a garden. Interiors are pale oak and honed stone — nothing shouting, everything considered. Open-house Sundays by appointment.",
    highlights: ["Private terrace", "Three exposures", "Wine room", "Doorman building"],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542813-ffad0c153c0f?w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
    ],
  },
  {
    slug: "west-village-townhouse",
    title: "Grove Street townhouse",
    neighborhood: "West Village",
    price: 6_250_000,
    beds: 4,
    baths: 3.5,
    sqft: 3210,
    type: "Townhouse",
    status: "For sale",
    blurb: "A brick façade, a garden, and rooms that still feel like a home.",
    story:
      "Four stories of original stair and new mechanicals. The garden is planted, the parlor still has its shutters, and the top floor is a quiet studio with a skylight.",
    highlights: ["South garden", "Working fireplaces", "Central air", "Finished cellar"],
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
      "https://images.unsplash.com/photo-1556912173-3d153f0f4746?w=1400&q=80",
    ],
  },
  {
    slug: "brooklyn-heights-condo",
    title: "Promenade condo with harbor light",
    neighborhood: "Brooklyn Heights",
    price: 1_875_000,
    beds: 2,
    baths: 2,
    sqft: 1240,
    type: "Condo",
    status: "For sale",
    blurb: "Harbor in the windows, a still kitchen, two blocks from the Promenade.",
    story:
      "A corner two-bed in a pre-war conversion. Mornings arrive from the harbor; evenings bounce off the bridges. Built for someone who wants the city without living on top of it.",
    highlights: ["Harbor views", "In-unit laundry", "Deeded storage", "Pet friendly"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80",
    ],
  },
  {
    slug: "williamsburg-loft",
    title: "North 6th warehouse loft",
    neighborhood: "Williamsburg",
    price: 1_620_000,
    beds: 1,
    baths: 2,
    sqft: 1420,
    type: "Loft",
    status: "Open house",
    blurb: "Brick, steel, and a mezzanine that works as a studio.",
    story:
      "A former warehouse bay with a sleeping loft and a wet bar that can become a second bath. The mezzanine is already wired for a desk and a print station.",
    highlights: ["Sleeping loft", "Keyed elevator", "Common roof", "Bike room"],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
      "https://images.unsplash.com/photo-1556912173-3d153f0f4746?w=1400&q=80",
    ],
  },
  {
    slug: "uws-classic-six",
    title: "Classic six on West 86th",
    neighborhood: "Upper West Side",
    price: 3_150_000,
    beds: 3,
    baths: 2,
    sqft: 1980,
    type: "Condo",
    status: "For sale",
    blurb: "A pre-war six with a real dining room and park air in the hall.",
    story:
      "Original oak floors, a windowed kitchen, and a maid’s room already converted to a study. Two blocks from the park, one from the 1 train.",
    highlights: ["Dining room", "Windowed kitchen", "Through-wall A/C", "Bike + storage"],
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    ],
  },
  {
    slug: "chelsea-gallery-condo",
    title: "Gallery-floor Chelsea condo",
    neighborhood: "Chelsea",
    price: 2_180_000,
    beds: 2,
    baths: 2,
    sqft: 1510,
    type: "Condo",
    status: "For sale",
    blurb: "White walls, a long run of art lighting, and 10th Avenue below.",
    story:
      "Built as a live-work floor in a gallery building. Track lighting is already in; the second bedroom can stay a studio. A block from the High Line.",
    highlights: ["Art lighting", "Floor-to-ceiling glass", "Fitness room", "Package room"],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542813-ffad0c153c0f?w=1400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80",
    ],
  },
  {
    slug: "tribeca-loft-franklin",
    title: "Franklin Street cast-iron loft",
    neighborhood: "Tribeca",
    price: 4_350_000,
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    type: "Loft",
    status: "Open house",
    blurb: "Original columns, a chef’s island, and three quiet bedrooms in back.",
    story:
      "The front is one volume for living and cooking; the rear is a private wing. Original columns stay; the mechanicals are new. An open house this weekend if you want to walk it.",
    highlights: ["Keyed elevator", "Central air", "Washer / dryer", "Common courtyard"],
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
      "https://images.unsplash.com/photo-1556912173-3d153f0f4746?w=1400&q=80",
    ],
  },
];

export function getHarborListing(slug: string): HarborListing | undefined {
  return harborListings.find((listing) => listing.slug === slug);
}

export function filterHarborListings(input: {
  neighborhood: HarborNeighborhoodFilter;
  beds: number;
  maxPrice: number;
}): HarborListing[] {
  return harborListings.filter((listing) => {
    if (input.neighborhood !== "All" && listing.neighborhood !== input.neighborhood) {
      return false;
    }
    if (listing.beds < input.beds) return false;
    if (listing.price > input.maxPrice) return false;
    return true;
  });
}

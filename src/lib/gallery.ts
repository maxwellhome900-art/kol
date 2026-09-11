import type { GalleryCategory, GalleryItem } from "@/lib/data";

export const GALLERY_PREVIEW_COUNT = 6;

const copyName = /(?:\s+|-)copy(?:\s*\(\d+\))?$/i;
const extraCopy = /\(\d+\)$/;

export function stripFileExtension(value: string) {
  const clean = (value.split(/[?#]/)[0].split("/").pop() ?? value)
    .replace(/\.[^/.]+$/i, "")
    .replace(/%20/g, " ");

  return decodeURIComponent(clean).trim();
}

function canonicalStem(fileName: string) {
  return stripFileExtension(fileName)
    .replace(copyName, "")
    .replace(extraCopy, "")
    .trim()
    .toLowerCase();
}

export function isDuplicatePhotoName(fileName: string, category?: string) {
  const stem = stripFileExtension(fileName);
  if (copyName.test(stem)) return true;
  if (category === "Featured") return false;
  return extraCopy.test(stem);
}

export function parseGalleryResponse(
  data: Record<string, string[]>,
): GalleryItem[] {
  const seen = new Set<string>();
  const items: GalleryItem[] = [];

  Object.entries(data).forEach(([category, list]) => {
    (list as string[]).forEach((src, idx) => {
      const fileName = stripFileExtension(src);
      if (isDuplicatePhotoName(fileName, category)) return;
      const key = `${category}:${canonicalStem(fileName)}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        id: `${category}-${idx}-${fileName}`,
        src,
        alt: fileName,
        category: category as GalleryCategory,
      });
    });
  });

  return items;
}

export function studioGalleryItems(items: GalleryItem[]) {
  return items.filter((item) => item.category !== "Featured");
}

/** Homepage tiles come from `public/Featured`. Falls back to a short mix if that folder is empty. */
export function previewGalleryItems(
  items: GalleryItem[],
  count = GALLERY_PREVIEW_COUNT,
): GalleryItem[] {
  const featured = items.filter((item) => item.category === "Featured");
  if (featured.length > 0) return featured;

  const portraits = items.filter((item) => item.category === "Portraits");
  const street = items.filter((item) => item.category === "Street");
  const mixed: GalleryItem[] = [];
  const half = Math.ceil(count / 2);

  for (let i = 0; i < half; i++) {
    const portrait = portraits[i];
    const streetShot = street[i];
    if (portrait) mixed.push(portrait);
    if (streetShot) mixed.push(streetShot);
  }

  return mixed.slice(0, count);
}

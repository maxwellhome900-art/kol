import type { Metadata } from "next";
import { GalleryStudio } from "@/components/gallery/GalleryStudio";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Times Square portraits and street photography — the full Mark Photography edit.",
};

export default function GalleryPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <GalleryStudio />
    </div>
  );
}

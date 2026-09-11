"use client";

import { CursorGlow } from "@/components/effects/CursorGlow";
import { PhotoGallery, useStudioPhotos } from "@/components/gallery/PhotoGallery";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { studioGalleryItems } from "@/lib/gallery";

export function GalleryStudio() {
  const items = studioGalleryItems(useStudioPhotos());

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative flex-1">
        <section
          id="hero"
          className="relative scroll-mt-24 overflow-hidden px-6 pb-24 pt-32 md:pb-32 md:pt-40"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
              Full gallery
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
              Every Times Square frame
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
              Portraits and street work from the same nights — no duplicate
              copies. Filter, then open any image full screen.
            </p>
            <div className="mt-10">
              <PhotoGallery items={items} showFilters />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

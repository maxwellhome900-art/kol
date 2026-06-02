"use client";

import { CursorGlow } from "@/components/effects/CursorGlow";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AboutPhotography } from "@/components/sections/AboutPhotography";
import { BookingSection } from "@/components/booking/BookingSection";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Timeline } from "@/components/sections/Timeline";

/** Photography-first home: luxury gallery, booking assistant, pricing. */
export function PhotographyPortfolio() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative flex-1">
        <Hero mode="photo" />
        <AboutPhotography />
        <Gallery />
        <BookingSection />
        <Pricing />
        <Timeline />
        <Contact variant="photo" />
      </main>
      <SiteFooter />
    </>
  );
}

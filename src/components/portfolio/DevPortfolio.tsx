"use client";

import { CursorGlow } from "@/components/effects/CursorGlow";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AboutEngineering } from "@/components/sections/AboutEngineering";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { EngineeringServices } from "@/components/sections/EngineeringServices";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Reviews } from "@/components/sections/Reviews";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";

/** Software engineer route — same brand system as the photography studio. */
export function DevPortfolio() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative flex-1">
        <Hero mode="dev" />
        <AboutEngineering />
        <EngineeringServices />
        <Projects />
        <CaseStudies />
        <Skills />
        <Timeline />
        <Reviews />
        <Contact variant="dev" />
      </main>
      <SiteFooter />
    </>
  );
}

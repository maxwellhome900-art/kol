"use client";

import { CursorGlow } from "@/components/effects/CursorGlow";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

/** Web development route — same brand, engineering-forward story. */
export function DevPortfolio() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative flex-1">
        <Hero mode="dev" />
        <Projects />
        <CaseStudies />
        <Skills />
        <Contact variant="dev" />
      </main>
      <SiteFooter />
    </>
  );
}

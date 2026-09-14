import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Landing Content */}
      <main className="flex-1">
        {/* Hero Section with Miniature Dashboard */}
        <HeroSection />

        {/* 6 Feature Cards */}
        <FeatureSection />

        {/* 4-Step Process */}
        <HowItWorksSection />

        {/* About / Agronomic Mission */}
        <AboutSection />

        {/* Final Call to Action */}
        <CtaSection />
      </main>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}

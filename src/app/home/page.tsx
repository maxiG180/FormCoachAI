"use client";

import { useAuth } from "@/contexts/authContext";

// Import components with proper path aliases
import HeroSection from "@/components/home/heroSection";
import FeaturesSection from "@/components/home/featuresSection";
import ProcessSection from "@/components/home/processSection";
import TestimonialsSection from "@/components/home/testimonialsSection";
import PricingSection from "@/components/home/pricingSection";
import CTASection from "@/components/home/ctaSection";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}

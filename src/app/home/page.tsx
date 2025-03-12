"use client";

// Import components with proper path aliases - using the Coming Soon versions
import HeroSection from "@/components/home/heroSection"; // Use the coming soon version
import FeaturesSection from "@/components/home/featuresSection"; // Use the coming soon version
import ProcessSection from "@/components/home/processSection"; // Use the coming soon version
import TestimonialsSection from "@/components/home/testimonialsSection"; // Use the coming soon version
import PricingSection from "@/components/home/pricingSection"; // Use the coming soon version
import CTASection from "@/components/home/ctaSection"; // Use the coming soon version

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Extra padding at the top to account for navbar + banner */}
      <div className="pt-6">
        {" "}
        {/* This helps push content down */}
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        {/* Footer with development notice */}
        <div className="bg-black border-t border-[#FF6500]/20 py-4 text-center text-gray-400 text-sm">
          <p>© 2025 FormCoachAI - Development Version</p>
        </div>
      </div>
    </div>
  );
}

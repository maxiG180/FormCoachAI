import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-black via-black to-[#FF6500]/30 rounded-xl text-center py-16 px-4 md:px-12 border border-[#FF6500] shadow-lg shadow-[#FF6500]/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6500]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF8533]/20 rounded-full filter blur-3xl"></div>

          {/* Coming soon tag */}
          <div className="absolute top-4 right-4 bg-[#FF6500]/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Launching Soon</span>
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Be Among the First to Try{" "}
              <span className="text-[#FF6500]">FormCoachAI</span>
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join our waitlist to get early access when we launch. Be part of
              our exclusive group of early adopters and help shape the future of
              fitness technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="rounded-xl px-8 py-4 bg-[#FF6500] hover:bg-[#FF8533] transition-colors duration-300 text-white font-medium inline-flex items-center gap-2 group shadow-lg shadow-[#FF6500]/10"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="rounded-xl px-8 py-4 bg-black hover:bg-black/80 border border-[#FF6500]/30 backdrop-blur-sm text-white transition-colors duration-300 font-medium inline-flex items-center gap-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

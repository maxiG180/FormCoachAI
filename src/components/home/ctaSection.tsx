import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-black via-black to-[#FF6500]/30 rounded-xl text-center py-16 px-4 md:px-12 border border-[#FF6500] shadow-lg shadow-[#FF6500]/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6500]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF8533]/20 rounded-full filter blur-3xl"></div>

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Perfect Your <span className="text-[#FF6500]">Form</span>
              ?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of users who have transformed their workout
              experience with FormCoachAI. Start your journey today with our
              risk-free trial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="rounded-xl px-8 py-4 bg-[#FF6500] hover:bg-[#FF8533] transition-colors duration-300 text-white font-medium inline-flex items-center gap-2 group shadow-lg shadow-[#FF6500]/10"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl px-8 py-4 bg-black hover:bg-black/80 border border-[#FF6500]/30 backdrop-blur-sm text-white transition-colors duration-300 font-medium inline-flex items-center gap-2"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

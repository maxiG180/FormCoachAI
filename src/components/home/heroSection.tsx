import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Info, Clock } from "lucide-react";
import imagePath from "../../../public/img/analysisv1.png";

interface StatCardProps {
  number: string;
  label: string;
  comingSoon?: boolean;
}

const StatCard = ({ number, label, comingSoon = false }: StatCardProps) => (
  <div className="bg-black rounded-xl border border-[#FF6500]/30 p-6 transition-all duration-300 hover:border-[#FF6500] relative group overflow-hidden">
    {/* Glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6500]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {comingSoon && (
      <div className="absolute -top-1 -right-1 bg-[#FF6500]/90 text-xs text-white px-2 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>Soon</span>
      </div>
    )}

    <div className="relative flex flex-col items-center justify-center text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-[#FF6500] mb-1">
        {number}
      </h3>
      <p className="text-sm text-white">{label}</p>
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Coming Soon Banner */}
      <div className="absolute top-0 left-0 right-0 bg-[#FF6500] text-white py-2 text-center z-50">
        <div className="flex items-center justify-center gap-2">
          <Info size={18} />
          <span>Coming Soon - Join our Waitlist</span>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Dark overlay with orange gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#FF6500]/30"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-repeat opacity-10"></div>

        {/* Animated gradient blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6500]/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-10 left-10 w-72 h-72 bg-[#FF8533]/20 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-12">
          <div className="md:w-1/2 animate-fade-in">
            <div className="inline-block bg-[#FF6500] px-4 py-2 rounded-full mb-6">
              <span className="text-white font-medium">
                AI-Powered Fitness Analysis
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Perfect Your Workout Form with{" "}
              <span className="text-[#FF6500]">FormCoachAI</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-10">
              Get real-time feedback on your exercise form using advanced AI
              technology. Train smarter, prevent injuries, and achieve your
              fitness goals with precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="rounded-xl px-8 py-4 bg-[#FF6500] hover:bg-[#FF8533] transition-colors duration-300 text-white font-medium inline-flex items-center gap-2 group shadow-lg shadow-[#FF6500]/20"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="rounded-xl px-8 py-4 bg-black hover:bg-[#FF6500]/20 border border-[#FF6500]/30 backdrop-blur-sm text-white transition-colors duration-300 font-medium inline-flex items-center gap-2 cursor-not-allowed opacity-70">
                <PlayCircle className="w-5 h-5 text-[#FF6500]" />
                Demo Coming Soon
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6500] to-[#FF8533] rounded-lg blur-lg opacity-50"></div>
              <div className="relative overflow-hidden rounded-xl border-2 border-[#FF6500]/30">
                <Image
                  src={imagePath}
                  alt="AI Workout Analysis"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#FF6500] rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">
                      AI Analyzing in Real-time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Coming Soon version */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <StatCard
            number="Real-time"
            label="Form Analysis"
            comingSoon={true}
          />
          <StatCard
            number="SBD"
            label="Major Lifts Covered"
            comingSoon={true}
          />
          <StatCard number="90%" label="Detection Accuracy" comingSoon={true} />
          <StatCard number="Email" label="Premium Support" comingSoon={true} />
        </div>
      </div>
    </section>
  );
}

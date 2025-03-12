// src/components/home/featuresSection.tsx
import React from "react";
import {
  Zap,
  Shield,
  Video,
  BarChart2,
  History,
  CheckCircle,
  Clock,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  title: string;
  description: string;
  comingSoon?: boolean;
}

const FeatureCard = ({
  icon,
  title,
  description,
  comingSoon = false,
}: FeatureCardProps) => (
  <div className="bg-black rounded-xl border border-[#FF6500]/30 p-6 transition-all duration-300 hover:border-[#FF6500] h-full group relative">
    {/* Glow effect */}
    <div className="absolute inset-0 rounded-xl bg-[#FF6500]/5 filter blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Shine effect on hover */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6500] to-[#FF8533] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>

    {comingSoon && (
      <div className="absolute -top-3 right-4 bg-[#FF6500]/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>Coming Soon</span>
      </div>
    )}

    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-[#FF6500]/20 flex items-center justify-center mb-4 group-hover:bg-[#FF6500]/30 transition-colors">
        {React.cloneElement(icon, {
          size: 24,
          color: "#FF6500",
        })}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF6500] transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 group-hover:text-white transition-colors">
        {description}
      </p>
    </div>
  </div>
);

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF6500]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF8533]/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block bg-[#FF6500] px-4 py-2 rounded-full mb-4">
            <span className="text-white font-medium">Key Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-[#FF6500]">FormCoachAI</span>?
          </h2>
          <p className="text-gray-300 text-lg">
            Experience the future of fitness with our advanced AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Video />}
            title="Video Analysis"
            description="Upload your workout videos for detailed AI-powered form analysis on squats, bench press, and deadlifts."
          />
          <FeatureCard
            icon={<Zap />}
            title="Real-time Feedback"
            description="Get instant, detailed feedback on your form including alignment, depth, and balance scores."
          />
          <FeatureCard
            icon={<Shield />}
            title="Injury Prevention"
            description="Receive specific recommendations to correct form issues that could lead to injury during your lifts."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Performance Tracking"
            description="View your progress over time with detailed charts showing form improvements and consistency."
          />
          <FeatureCard
            icon={<History />}
            title="Workout History"
            description="Access all your previous workout analyses to see your improvement journey and track progress."
          />
          <FeatureCard
            icon={<CheckCircle />}
            title="Form Analysis Reports"
            description="Get comprehensive breakdowns of your exercise form with actionable improvement tips and rep counting."
          />
        </div>
      </div>
    </section>
  );
}

import { ReactNode } from "react";
import { Video, Brain, TrendingUp } from "lucide-react";

interface ProcessCardProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
}

const ProcessCard = ({
  number,
  title,
  description,
  icon,
}: ProcessCardProps) => (
  <div className="bg-black backdrop-blur-sm rounded-xl border border-[#FF6500]/30 p-6 transition-all duration-300 hover:border-[#FF6500] hover:shadow-lg hover:shadow-[#FF6500]/20 h-full relative group">
    <div className="absolute -top-5 -left-2 w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6500] to-[#FF8533] flex items-center justify-center text-white font-bold text-lg shadow-md">
      {number}
    </div>
    <div className="pt-6">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#FF6500]/20 flex items-center justify-center mr-3 group-hover:bg-[#FF6500]/40 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-[#FF6500] transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default function ProcessSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6500]/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6500]/50 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block bg-[#FF6500] px-4 py-2 rounded-full mb-4">
            <span className="text-white font-medium">Easy Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Getting Started is <span className="text-[#FF6500]">Simple</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Three easy steps to perfect your form with AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connected line decoration */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#FF6500]/20 via-[#FF8533] to-[#FF6500]/20 opacity-50"></div>

          <ProcessCard
            number={1}
            title="Record Your Workout"
            description="Use your device's camera or upload a video of your exercise routine"
            icon={<Video className="h-5 w-5 text-[#FF6500]" />}
          />
          <ProcessCard
            number={2}
            title="AI Analysis"
            description="Get instant feedback on your form with our advanced AI technology"
            icon={<Brain className="h-5 w-5 text-[#FF6500]" />}
          />
          <ProcessCard
            number={3}
            title="Improve & Track"
            description="Follow personalized suggestions and track your progress over time"
            icon={<TrendingUp className="h-5 w-5 text-[#FF6500]" />}
          />
        </div>
      </div>
    </section>
  );
}

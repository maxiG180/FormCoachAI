import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
  image?: string;
  isBeta?: boolean;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  rating,
  image,
  isBeta = false,
}: TestimonialCardProps) => (
  <div className="bg-black backdrop-blur-sm rounded-xl border border-[#FF6500]/30 p-6 transition-all duration-300 hover:border-[#FF6500] hover:shadow-lg hover:shadow-[#FF6500]/10 h-full relative">
    {isBeta && (
      <div className="absolute -top-3 right-3 bg-[#FF6500] text-white text-xs px-2 py-1 rounded-full">
        Beta Tester
      </div>
    )}
    <div className="flex space-x-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-[#FF6500] fill-[#FF6500]" />
      ))}
      {[...Array(5 - rating)].map((_, i) => (
        <Star key={i + rating} className="w-5 h-5 text-gray-600" />
      ))}
    </div>
    <p className="text-white mb-6 italic">
      "<span className="text-[#FF6500]">{quote.substring(0, 1)}</span>
      {quote.substring(1)}"
    </p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6500] to-[#FF8533] flex items-center justify-center mr-3 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
        )}
      </div>
      <div>
        <h4 className="text-white font-medium">{name}</h4>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  </div>
);

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#FF6500]/5 to-transparent"></div>
        <div className="absolute top-40 left-40 w-64 h-64 bg-[#FF6500]/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block bg-[#FF6500] px-4 py-2 rounded-full mb-4">
            <span className="text-white font-medium">Early Feedback</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="text-[#FF6500]">Beta Testers</span> Say
          </h2>
          <p className="text-gray-300 text-lg">
            Hear from our early users who are already improving their form
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard
            quote="The real-time feedback is impressive! I've been working on my squat technique for weeks, and FormCoachAI caught issues my gym buddies missed."
            name="Alex J."
            role="Fitness Enthusiast"
            rating={5}
            isBeta={true}
          />
          <TestimonialCard
            quote="As a personal trainer testing this platform, I'm excited about its potential. The form analysis is detailed and accurate, even in beta."
            name="Taylor M."
            role="Personal Trainer"
            rating={4}
            isBeta={true}
          />
          <TestimonialCard
            quote="While still in development, the AI already provides valuable insights. I can't wait to see the additional exercises and features they add!"
            name="Jamie K."
            role="CrossFit Athlete"
            rating={4}
            isBeta={true}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-[#FF6500]/20 text-center">
          <p className="text-white text-lg flex flex-col md:flex-row items-center justify-center gap-2">
            <span className="text-[#FF6500] font-bold">4.5/5</span>
            <span className="hidden md:inline">•</span>
            <span>Average rating from our early access beta testers</span>
          </p>
        </div>
      </div>
    </section>
  );
}

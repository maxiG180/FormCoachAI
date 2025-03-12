import Link from "next/link";
import { CheckCircle, Clock, Info } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  popular: boolean;
  comingSoon?: boolean;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  popular,
  comingSoon = false,
}: PricingCardProps) => (
  <div
    className={`${
      popular ? "bg-[#FF6500]" : "bg-black"
    } backdrop-blur-sm rounded-xl border ${
      popular ? "border-[#FF8533]" : "border-[#FF6500]/30"
    } p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6500]/20 h-full relative ${
      popular ? "shadow-lg shadow-[#FF6500]/30" : ""
    }`}
  >
    {popular && (
      <div className="absolute -top-3 right-4 bg-white text-[#FF6500] text-xs font-bold px-3 py-1 rounded-full">
        Most Popular
      </div>
    )}

    {comingSoon && (
      <div className="absolute -top-3 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>Coming Soon</span>
      </div>
    )}

    <div className="text-center mb-6">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-2">
        <span className="text-3xl font-bold text-white">{price}</span>
        {period && (
          <span
            className={`${
              popular ? "text-white/80" : "text-gray-400"
            } text-sm ml-1`}
          >
            {period}
          </span>
        )}
      </div>
      <p className={`text-sm ${popular ? "text-white/80" : "text-gray-400"}`}>
        {description}
      </p>
    </div>
    <div className="mb-8">
      <ul className="space-y-3">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckCircle
              className={`w-5 h-5 ${
                popular ? "text-white" : "text-[#FF6500]"
              } mr-2 flex-shrink-0 mt-0.5`}
            />
            <span className="text-white">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="text-center">
      <Link
        href={buttonLink}
        className={`w-full block rounded-xl px-6 py-3 font-medium transition-colors duration-300 ${
          comingSoon
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : popular
            ? "bg-white text-[#FF6500] hover:bg-gray-100"
            : "bg-[#FF6500] hover:bg-[#FF8533] text-white"
        }`}
      >
        {comingSoon ? "Coming Soon" : buttonText}
      </Link>
    </div>
  </div>
);

export default function PricingSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-[#FF6500]/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block bg-[#FF6500] px-4 py-2 rounded-full mb-4">
            <span className="text-white font-medium">Pricing Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-[#FF6500]">Plan</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Flexible options to fit your fitness journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PricingCard
            title="Free Beta"
            price="Free"
            description="Perfect for early adopters"
            features={[
              "Access to squat analysis",
              "Basic form feedback",
              "Video upload capabilities",
              "Email support",
            ]}
            buttonText="Join Beta"
            buttonLink="/signup"
            popular={false}
          />
          <PricingCard
            title="Pro"
            price="$9.99"
            period="per month"
            description="For the dedicated fitness enthusiast"
            features={[
              "Full access to all exercises",
              "Advanced form feedback",
              "Progress tracking dashboard",
              "Custom exercise programs",
              "Priority support",
            ]}
            buttonText="Coming Soon"
            buttonLink="/signup?plan=pro"
            popular={true}
            comingSoon={true}
          />
          <PricingCard
            title="Teams"
            price="$49.99"
            period="per month"
            description="Ideal for trainers and groups"
            features={[
              "Everything in Pro plan",
              "Up to 10 team members",
              "Team analytics dashboard",
              "Client management tools",
              "API access",
              "Dedicated account manager",
            ]}
            buttonText="Contact Sales"
            buttonLink="/contact"
            popular={false}
            comingSoon={true}
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 flex flex-col md:flex-row items-center justify-center gap-2">
            <Info className="w-4 h-4 text-[#FF6500]" />
            <span>
              Pro and Team plans will be available at launch. Get early access
              now through our free beta program!
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

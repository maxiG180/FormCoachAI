"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Define plan types
interface Feature {
  name: string;
  included: boolean;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: Feature[];
  popular?: boolean;
  buttonText: string;
  stripePriceId: string;
}

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Get yearly discount multiplier
  const yearlyDiscountMultiplier = 0.8; // 20% discount for yearly

  // Define pricing plans
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      description: "Basic analysis for casual fitness enthusiasts",
      price: 0,
      billingPeriod: "monthly",
      features: [
        { name: "Analyze 5 videos per month", included: true },
        { name: "Basic form analysis", included: true },
        { name: "Exercise history", included: true },
        { name: "One exercise type", included: true },
        { name: "AI-powered feedback", included: true },
        { name: "Progress tracking", included: false },
        { name: "Detailed analytics", included: false },
        { name: "Unlimited exercise types", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Get Started",
      stripePriceId: "",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced analytics for serious fitness enthusiasts",
      price:
        billingPeriod === "monthly"
          ? 9.99
          : 9.99 * 12 * yearlyDiscountMultiplier,
      billingPeriod,
      features: [
        { name: "Unlimited video analysis", included: true },
        { name: "Advanced form analysis", included: true },
        { name: "Exercise history", included: true },
        {
          name: "Three exercise types",
          included: true,
          tooltip: "Squats, Bench Press, and Deadlifts",
        },
        { name: "AI-powered feedback", included: true },
        { name: "Progress tracking", included: true },
        { name: "Detailed analytics", included: true },
        { name: "Unlimited exercise types", included: false },
        { name: "Priority support", included: false },
      ],
      popular: true,
      buttonText: "Subscribe Now",
      stripePriceId:
        billingPeriod === "monthly"
          ? "price_1OxYz3KHf8cJI9y0WvxEWnxL"
          : "price_1OxYzLKHf8cJI9y0AntSV952",
    },
    {
      id: "coach",
      name: "Coach",
      description: "Premium features for trainers and professionals",
      price:
        billingPeriod === "monthly"
          ? 19.99
          : 19.99 * 12 * yearlyDiscountMultiplier,
      billingPeriod,
      features: [
        { name: "Unlimited video analysis", included: true },
        { name: "Advanced form analysis", included: true },
        { name: "Exercise history", included: true },
        { name: "All exercise types", included: true },
        { name: "AI-powered feedback", included: true },
        { name: "Progress tracking", included: true },
        { name: "Detailed analytics", included: true },
        { name: "Unlimited exercise types", included: true },
        { name: "Priority support", included: true },
      ],
      buttonText: "Get Ultimate",
      stripePriceId:
        billingPeriod === "monthly"
          ? "price_1OxYzmKHf8cJI9y0FfhHRNzQ"
          : "price_1OxZ0BKHf8cJI9y0SzAJjx4W",
    },
  ];

  // Create a checkout session with Stripe
  const handleCheckout = async (stripePriceId: string) => {
    if (!stripePriceId) return; // Don't proceed for free plan

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripePriceId,
        }),
      });

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Take Your Fitness to the{" "}
            <span className="text-[#FF6500]">Next Level</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Choose the perfect plan to enhance your workout form and achieve
            your fitness goals faster
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-zinc-800/50 p-1 rounded-xl border border-zinc-700">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#FF6500] text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-[#FF6500] text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Yearly{" "}
              <span className="text-xs font-bold ml-1 text-[#ffffff]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: plans.indexOf(plan) * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-[#FF6500] ring-4 ring-[#FF6500]/20 shadow-xl shadow-[#FF6500]/10 transform md:scale-105 z-10"
                  : "border border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#FF6500] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? "Free" : `$${plan.price.toFixed(2)}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 ml-2">
                      /{billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(plan.stripePriceId)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
                      : plan.id === "free"
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  } transition-all`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {feature.included ? (
                          <CheckCircle className="w-5 h-5 text-[#FF6500]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-700"></div>
                        )}
                      </div>
                      <div>
                        <span
                          className={
                            feature.included ? "text-white" : "text-gray-500"
                          }
                        >
                          {feature.name}
                        </span>
                        {feature.tooltip && (
                          <div className="group relative inline-block ml-1">
                            <HelpCircle className="w-4 h-4 text-gray-500 inline-block cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 w-48 p-2 bg-zinc-800 rounded-md text-xs text-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {feature.tooltip}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">
                Can I cancel my subscription at any time?
              </h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You&apos;ll
                continue to have access to your plan features until the end of
                your billing period.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards including Visa, Mastercard,
                American Express, as well as PayPal and Apple Pay through our
                secure Stripe payment system.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">
                Can I switch between plans?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. When
                upgrading, you&apos;ll be charged the prorated difference
                immediately. When downgrading, the new price will take effect at
                the next billing cycle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 md:p-12 rounded-2xl max-w-4xl mx-auto border border-zinc-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to perfect your{" "}
              <span className="text-[#FF6500]">workout form</span>?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of fitness enthusiasts who are already improving
              their workout technique with our AI-powered form analysis.
            </p>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

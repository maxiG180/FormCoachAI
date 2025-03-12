//app/contact/page.tsx
import React from "react";
import ContactForm from "@/components/contact/contactForm";

export const metadata = {
  title: "Contact Us | FormCoachAI",
  description:
    "Get in touch with our team for questions, support, or feedback about FormCoachAI.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center py-20">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#FF6500]/30"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6500]/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-10 left-10 w-72 h-72 bg-[#FF8533]/20 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're here to answer your questions and help you get the most out of
            FormCoachAI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-black/50 backdrop-blur-lg rounded-xl shadow-lg">
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="bg-black rounded-xl shadow-lg border border-[#FF6500]/30 p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#FF6500]">
                Connect With Us
              </h3>
              <p className="text-gray-300">Email: contact@formcoachai.com</p>
              <p className="text-gray-300">
                Location: Eindhoven, The Netherlands
              </p>
              <p className="text-gray-300">
                Support Hours: Mon – Fri: 9am – 5pm CET
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

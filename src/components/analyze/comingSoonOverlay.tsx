"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ComingSoonOverlay() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6">
      <div className="animate-pulse mb-6">
        <div className="w-16 h-16 bg-[#FF6500] rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        <span className="text-[#FF6500]">Coming Soon!</span>
      </h2>

      <p className="text-lg text-gray-300 max-w-lg mb-8">
        Our AI-powered exercise analysis is currently in development. Join our
        waitlist to be the first to know when it launches!
      </p>

      <button
        onClick={() => router.push("/")}
        className="rounded-xl px-8 py-4 bg-[#FF6500] hover:bg-[#FF8533] transition-colors duration-300 text-white font-medium inline-flex items-center gap-2 group shadow-lg shadow-[#FF6500]/20"
      >
        Join Waitlist
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// src/app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";

// Simple not-found page that doesn't use useSearchParams
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0D2C] to-[#070919] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-[#FF6500] mb-6">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="px-6 py-3 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white rounded-full font-medium transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

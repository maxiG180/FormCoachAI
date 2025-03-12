// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../app/globals.css";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      // Redirect to the home page
      router.push("/home");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-brand-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );
}

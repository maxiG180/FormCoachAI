"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Footer Waitlist Signup",
          email,
          message:
            "New waitlist signup from footer for FormCoachAI launch notification.",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        console.error("Error joining waitlist:", data.error);
      }
    } catch (error) {
      setStatus("error");
      console.error("Error joining waitlist:", error);
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-[#FF6500]/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info with Logo */}
          <div>
            <div className="mb-4">
              <Image
                src="/img/logo.png"
                alt="FormCoachAI Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Using advanced AI technology to help you perfect your workout form
              and achieve your fitness goals safely.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6500] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6500] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6500] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6500] transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter/Waitlist */}
          <div>
            <h3 className="text-white font-semibold mb-4">Join Our Waitlist</h3>
            <p className="text-gray-400 mb-4">
              Be the first to know when FormCoachAI launches and get early
              access!
            </p>

            {status === "success" && (
              <div className="mb-4 p-3 bg-green-900/30 border-l-4 border-green-500 text-green-400 rounded text-sm">
                <p>Thank you for joining our waitlist!</p>
              </div>
            )}

            {status === "error" && (
              <div className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-500 text-red-400 rounded text-sm">
                <p>There was an error. Please try again.</p>
              </div>
            )}

            <form className="space-y-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#FF6500]/30 focus:border-[#FF6500] focus:outline-none text-white"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Joining...
                  </span>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#FF6500]/10 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} FormCoachAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

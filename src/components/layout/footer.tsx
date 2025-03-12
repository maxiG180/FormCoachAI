import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
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
                  href="/privacy"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-[#FF6500] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and tips.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#FF6500]/30 focus:border-[#FF6500] focus:outline-none text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Subscribe
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

// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/authContext";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut: authSignOut } = useAuth();

  // Handle scroll effects for navbar transparency
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to get display name - prioritizes email over display name
  const getUserDisplayName = (currentUser: User | null) => {
    if (!currentUser) return "Guest";

    const email = currentUser.email;
    if (email) {
      // If we have an email, use it (with optional truncation for very long emails)
      return email.length > 25 ? email.substring(0, 25) + "..." : email;
    }
    return "Guest"; // Fallback if somehow we have no email
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm shadow-lg border-b border-[#FF6500]/20"
          : "bg-black/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased navbar height from h-16 to h-24 */}
        <div className="flex justify-between h-24">
          <div className="flex items-center mr-10">
            <Link href="/" className="block group">
              <div className="relative">
                <Image
                  src="/img/logo.png"
                  alt="FormCoachAI Logo"
                  width={240}
                  height={96}
                  className="h-24 w-auto object-contain"
                  priority
                />
                <div className="h-0.5 w-0 bg-gradient-to-r from-[#FF6500] to-[#FF8533] transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation - increased text size */}
          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            {user ? (
              <>
                <NavigationLink href="/dashboard">Dashboard</NavigationLink>
                <NavigationLink href="/analyze">Analyze</NavigationLink>
                <NavigationLink href="/pricing">Pricing</NavigationLink>

                {/* Other Pages Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 text-base text-gray-300 hover:text-[#FF6500] transition-colors"
                    onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                    onMouseEnter={() => setOtherMenuOpen(true)}
                    onMouseLeave={() => setOtherMenuOpen(false)}
                  >
                    <span>Other</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 mt-2 w-52 py-2 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#FF6500]/10 transition-all duration-200 ${
                      otherMenuOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setOtherMenuOpen(true)}
                    onMouseLeave={() => setOtherMenuOpen(false)}
                  >
                    <Link
                      href="/blog"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/about-us"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/privacy-policy"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms-of-service"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>

                {/* User Menu - Increased size */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <UserCircle className="w-9 h-9 text-gray-300 group-hover:text-[#FF6500] transition-colors" />
                    <span className="text-base text-gray-300 group-hover:text-[#FF6500] transition-colors">
                      {getUserDisplayName(user)}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-52 py-2 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#FF6500]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {/* Show full email in dropdown if it was truncated */}
                    {user.email && user.email.length > 25 && (
                      <div className="px-4 py-2 text-base text-gray-300 border-b border-[#FF6500]/10">
                        {user.email}
                      </div>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavigationLink href="/home">Home</NavigationLink>
                <NavigationLink href="/pricing">Pricing</NavigationLink>

                {/* Other Pages Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 text-base text-gray-300 hover:text-[#FF6500] transition-colors"
                    onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                    onMouseEnter={() => setOtherMenuOpen(true)}
                    onMouseLeave={() => setOtherMenuOpen(false)}
                  >
                    <span>Other</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 mt-2 w-52 py-2 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#FF6500]/10 transition-all duration-200 ${
                      otherMenuOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setOtherMenuOpen(true)}
                    onMouseLeave={() => setOtherMenuOpen(false)}
                  >
                    <Link
                      href="/blog"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/about-us"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/privacy-policy"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms-of-service"
                      className="block px-4 py-2 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-medium text-white bg-[#FF6500] hover:bg-[#FF8533] rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - larger size */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-md text-gray-300 hover:text-[#FF6500] focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#FF6500]/10 bg-black/95 backdrop-blur-sm"
          >
            <div className="px-4 pt-3 pb-4 space-y-2">
              {user ? (
                <>
                  {/* Show user email in mobile menu */}
                  <div className="px-3 py-3 text-base text-gray-300 border-b border-[#FF6500]/10 mb-2">
                    {user.email}
                  </div>
                  <MobileNavigationLink href="/dashboard">
                    Dashboard
                  </MobileNavigationLink>
                  <MobileNavigationLink href="/analyze">
                    Analyze Workout
                  </MobileNavigationLink>

                  {/* Other Pages Section in Mobile */}
                  <div className="pt-3 pb-2 border-t border-[#FF6500]/10">
                    <p className="px-3 text-sm text-gray-400 uppercase">
                      Other Pages
                    </p>
                    <MobileNavigationLink href="/blog">
                      Blog
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/about-us">
                      About Us
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/contact-us">
                      Contact Us
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/privacy-policy">
                      Privacy Policy
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/terms-of-service">
                      Terms of Service
                    </MobileNavigationLink>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-3 text-base text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavigationLink href="/home">Home</MobileNavigationLink>
                  <MobileNavigationLink href="/pricing">
                    Pricing
                  </MobileNavigationLink>

                  {/* Other Pages Section in Mobile */}
                  <div className="pt-3 pb-2 border-t border-[#FF6500]/10">
                    <p className="px-3 text-sm text-gray-400 uppercase">
                      Other Pages
                    </p>
                    <MobileNavigationLink href="/blog">
                      Blog
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/about-us">
                      About Us
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/contact-us">
                      Contact Us
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/privacy-policy">
                      Privacy Policy
                    </MobileNavigationLink>
                    <MobileNavigationLink href="/terms-of-service">
                      Terms of Service
                    </MobileNavigationLink>
                  </div>

                  <Link
                    href="/login"
                    className="block w-full text-center px-3 py-3 text-base font-medium text-white bg-[#FF6500] hover:bg-[#FF8533] rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavigationLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the current URL matches this link
    const checkActive = () => {
      setIsActive(window.location.pathname === href);
    };

    // Initial check
    checkActive();

    // Add event listener for navigation changes
    window.addEventListener("popstate", checkActive);

    return () => {
      window.removeEventListener("popstate", checkActive);
    };
  }, [href]);

  return (
    <Link
      href={href}
      className={`text-base font-medium ${
        isActive ? "text-[#FF6500]" : "text-gray-300 hover:text-[#FF6500]"
      } transition-colors relative group`}
    >
      {children}
      <div
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6500] transition-all duration-300 group-hover:w-full ${
          isActive ? "w-full" : ""
        }`}
      ></div>
    </Link>
  );
};

const MobileNavigationLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the current URL matches this link
    const checkActive = () => {
      setIsActive(window.location.pathname === href);
    };

    // Initial check
    checkActive();

    // Add event listener for navigation changes
    window.addEventListener("popstate", checkActive);

    return () => {
      window.removeEventListener("popstate", checkActive);
    };
  }, [href]);

  return (
    <Link
      href={href}
      className={`block px-3 py-3 rounded-md text-lg ${
        isActive
          ? "text-[#FF6500] bg-[#FF6500]/10"
          : "text-gray-300 hover:text-[#FF6500] hover:bg-[#FF6500]/10"
      } transition-colors`}
    >
      {children}
    </Link>
  );
};

export default Navbar;

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effects for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Function to get display name - prioritizes email over display name
  const getUserDisplayName = (user: any) => {
    if (user.email) {
      // If we have an email, use it (with optional truncation for very long emails)
      return user.email.length > 25
        ? user.email.substring(0, 25) + "..."
        : user.email;
    }
    return "Guest"; // Fallback if somehow we have no email
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  FormCoachAI
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {user ? (
              <>
                <NavigationLink to="/dashboard">Dashboard</NavigationLink>
                <NavigationLink to="/analyze">Analyze Workout</NavigationLink>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <UserCircle className="w-8 h-8 text-gray-300 group-hover:text-brand-primary transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-brand-primary transition-colors">
                      {getUserDisplayName(user)}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-brand-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-brand-primary/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {/* Show full email in dropdown if it was truncated */}
                    {user.email && user.email.length > 25 && (
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-brand-primary/10">
                        {user.email}
                      </div>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavigationLink to="/home">Home</NavigationLink>
                <NavigationLink to="/pricing">Pricing</NavigationLink>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-brand-primary focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
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
            className="lg:hidden border-t border-brand-primary/10 bg-brand-dark/95 backdrop-blur-sm"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {/* Show user email in mobile menu */}
                  <div className="px-3 py-2 text-sm text-gray-300 border-b border-brand-primary/10 mb-2">
                    {user.email}
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-300 border-b border-brand-primary/10 mb-2"></div>
                  <MobileNavigationLink to="/dashboard">
                    Dashboard
                  </MobileNavigationLink>
                  <MobileNavigationLink to="/analyze">
                    Analyze Workout
                  </MobileNavigationLink>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavigationLink to="/home">Home</MobileNavigationLink>
                  <MobileNavigationLink to="/pricing">
                    Pricing
                  </MobileNavigationLink>
                  <Link
                    to="/login"
                    className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-colors"
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
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-sm ${
        isActive
          ? "text-brand-primary"
          : "text-gray-300 hover:text-brand-primary"
      } transition-colors relative group`}
    >
      {children}
      <div
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full ${
          isActive ? "w-full" : ""
        }`}
      ></div>
    </Link>
  );
};

const MobileNavigationLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base ${
        isActive
          ? "text-brand-primary bg-brand-primary/10"
          : "text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10"
      } transition-colors`}
    >
      {children}
    </Link>
  );
};

export default NavBar;

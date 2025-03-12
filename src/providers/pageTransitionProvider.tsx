"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useRouter } from "next/navigation";

// Create context
interface PageTransitionContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

// Hook for using the context
export const usePageTransition = () => useContext(PageTransitionContext);

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Provider component
export const PageTransitionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use refs to track previous path and current click
  const previousPathname = useRef(pathname);
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentNavigationRef = useRef<string | null>(null);

  const startLoading = () => setIsLoading(true);

  const stopLoading = () => {
    // Clear any pending timeouts to avoid race conditions
    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
    setIsLoading(false);
    currentNavigationRef.current = null;
  };

  // Always stop loading after a safety timeout (e.g., 5 seconds)
  // This prevents infinite loading if something goes wrong
  useEffect(() => {
    if (isLoading) {
      const safetyTimer = setTimeout(() => {
        console.log("Safety timeout triggered to stop loading");
        stopLoading();
      }, 5000);

      return () => clearTimeout(safetyTimer);
    }
  }, [isLoading]);

  // Track route changes to show/hide spinner
  useEffect(() => {
    // If the path changes, it means navigation has occurred
    if (previousPathname.current !== pathname) {
      // Navigation completed, stop loading after a short delay
      navigationTimerRef.current = setTimeout(() => {
        stopLoading();
      }, 300);

      // Update the previous pathname
      previousPathname.current = pathname;

      return () => {
        if (navigationTimerRef.current) {
          clearTimeout(navigationTimerRef.current);
        }
      };
    }
  }, [pathname, searchParams]);

  // Intercept navigation clicks
  useEffect(() => {
    const handleNavigation = (href: string) => {
      // Extract just the pathname from the href
      const url = new URL(href, window.location.origin);
      const targetPathname = url.pathname;

      // Check if we're navigating to the same page
      if (targetPathname === pathname) {
        // If clicking on the current page, start loading but also set a timer to stop it
        startLoading();
        currentNavigationRef.current = targetPathname;

        // Stop loading after a short delay if we're on the same page
        navigationTimerRef.current = setTimeout(() => {
          if (currentNavigationRef.current === targetPathname) {
            stopLoading();
          }
        }, 300);
      } else {
        // Normal navigation to a different page
        startLoading();
        currentNavigationRef.current = targetPathname;
      }
    };

    // Add event listener for all link clicks
    const linkClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      // Check if this is a link navigation (not external)
      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        handleNavigation(link.href);
      }
    };

    // Add event listener for button clicks that might trigger navigation
    const buttonClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("button");

      // Look for buttons with 'data-navigation' attribute
      if (button && button.hasAttribute("data-navigation")) {
        const navigateTo =
          button.getAttribute("data-navigation-to") || pathname;
        handleNavigation(navigateTo);
      }
    };

    window.addEventListener("click", linkClickHandler);
    window.addEventListener("click", buttonClickHandler);

    return () => {
      window.removeEventListener("click", linkClickHandler);
      window.removeEventListener("click", buttonClickHandler);
    };
  }, [pathname]);

  return (
    <PageTransitionContext.Provider
      value={{ isLoading, startLoading, stopLoading }}
    >
      {children}
      {isLoading && (
        <LoadingSpinner
          fullScreen
          variant="primary"
          size="large"
          text="Loading..."
        />
      )}
    </PageTransitionContext.Provider>
  );
};

// Navigation trigger component - use this on buttons or custom navigation elements
export const NavigationTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  navigateTo?: string;
}> = ({ children, className, onClick, navigateTo }) => {
  const { startLoading } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    startLoading();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      data-navigation="true"
      data-navigation-to={navigateTo || pathname}
    >
      {children}
    </button>
  );
};

// Enhanced Link component that triggers loading
export const TransitionLink: React.FC<{
  children: React.ReactNode;
  className?: string;
  href: string;
}> = ({ children, className, href }) => {
  const { startLoading } = usePageTransition();

  const handleClick = () => {
    startLoading();
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

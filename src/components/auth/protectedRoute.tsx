"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      redirect("/login");
    }
  }, [user, loading]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[#FF6500]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#FF6500] rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, render nothing while redirect happens
  if (!user) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

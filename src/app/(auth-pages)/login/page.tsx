"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import AuthCard from "@/components/ui/authCard";
import ErrorAlert from "@/components/ui/errorAlert";
import FormInput from "@/components/ui/formInput";
import GoogleIcon from "@/components/icons/googleIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, googleSignIn, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="FormCoachAI" subtitle="Your AI-Powered Fitness Journey">
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          rightElement={
            <Link
              href="/forgot-password"
              className="text-xs text-[#FF6500] hover:text-[#FF8533] transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#FF6500]/20"></div>
        </div>
        <div className="relative px-4 bg-black text-sm text-gray-400">
          or continue with
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-transparent hover:bg-[#FF6500]/10 text-white font-medium rounded-lg border border-[#FF6500]/30 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading}
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <p className="text-center mt-6 text-gray-400 text-sm">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-[#FF6500] hover:text-[#FF8533] font-semibold transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}

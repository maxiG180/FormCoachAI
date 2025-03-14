"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import AuthCard from "@/components/ui/authCard";
import ErrorAlert from "@/components/ui/errorAlert";
import FormInput from "@/components/ui/formInput";
import GoogleIcon from "@/components/icons/googleIcon";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup, googleSignIn, login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password);
      // Log in the user after successful signup
      await login(email, password);
      router.push("/dashboard");
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create an account. Please try again.";
      setError(errorMessage);
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
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="FormCoachAI" subtitle="Create Your Account">
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
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            "Sign up"
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#FF6500] hover:text-[#FF8533] font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

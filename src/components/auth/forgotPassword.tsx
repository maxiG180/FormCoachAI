"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import AuthCard from "@/components/ui/authCard";
import ErrorAlert from "@/components/ui/errorAlert";
import FormInput from "@/components/ui/formInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (error) {
      setError((error as Error).message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Get back to your fitness journey"
    >
      {error && <ErrorAlert message={error} />}

      {message ? (
        <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6">
          <p>{message}</p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/login"
              className="px-4 py-2 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-lg transition-colors duration-300"
            >
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-400 mb-6">
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
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
                  <span>Sending reset link...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400 text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#FF6500] hover:text-[#FF8533] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}

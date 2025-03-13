"use client";

import { useState } from "react";

export default function WaitlistForm() {
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
          name: "Waitlist Signup",
          email,
          message: "New waitlist signup for FormCoachAI launch notification.",
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
    <div className="w-full p-6 bg-black/70 rounded-xl shadow-lg border border-[#FF6500]/30 transition-all duration-300 hover:border-[#FF6500]">
      <h2 className="text-2xl font-bold mb-2 text-[#FF6500]">
        Join the Waitlist
      </h2>
      <p className="text-gray-300 mb-4">
        Be the first to know when FormCoachAI launches and get early access!
      </p>

      {status === "success" && (
        <div className="mb-6 p-4 bg-green-900/30 border-l-4 border-green-500 text-green-400 rounded">
          <div className="flex">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>
              Thank you for joining our waitlist! We&apos;ll notify you when we
              launch.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-400 rounded">
          <div className="flex">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>There was an error joining the waitlist. Please try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="waitlist-email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="waitlist-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] transition text-white"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-6 py-3 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6500] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </form>
    </div>
  );
}

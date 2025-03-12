// src/components/contact/contactForm.tsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        console.error("Error submitting form:", data.error);
      }
    } catch (error) {
      setStatus("error");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-8 bg-black rounded-xl shadow-lg border border-[#FF6500]/30 transition-all duration-300 hover:border-[#FF6500]">
      <h2 className="text-3xl font-bold mb-2 text-[#FF6500]">Get in Touch</h2>
      <p className="text-gray-300 mb-6">
        Have questions about FormCoachAI? We&apos;re here to help!
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
            <p>Thank you for your message! We&apos;ll get back to you soon.</p>
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
            <p>There was an error sending your message. Please try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] transition text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] transition text-white"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] transition text-white"
            placeholder="How can we help you?"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full md:w-auto px-6 py-3 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6500] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

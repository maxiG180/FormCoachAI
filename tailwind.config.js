// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF6500", // Basic-fit orange
          secondary: "#1F2937", // Dark gray
          dark: "#111827", // Darker background
          accent: "#FF8533", // Lighter orange for accents
          gray: "#9CA3AF",
        },
      },
      backgroundImage: {
        "fade-dark": "linear-gradient(to right, #111827, #1F2937)",
        "fade-accent": "linear-gradient(to right, #FF6500, #FF8533)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#FF6500",
          secondary: "#1F2937",
          accent: "#FF8533",
          neutral: "#111827",
          "base-100": "#111827",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
};

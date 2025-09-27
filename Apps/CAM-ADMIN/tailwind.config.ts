import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cam: {
          bg: {
            900: "#0d0d0d",
            800: "#111111",
            700: "#1a1a1a",
          },
          green: {
            400: "#4ade80",
            500: "#22c55e",
          },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(74, 222, 128, 0.3)",
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
        slideInFromLeft: "slideInFromLeft 0.8s ease-out",
        slideInFromRight: "slideInFromRight 0.8s ease-out",
        slideInFromBottom: "slideInFromBottom 0.8s ease-out",
        slideInFromTop: "slideInFromTop 0.8s ease-out",
        growFromBottom: "growFromBottom 1s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        growFromBottom: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

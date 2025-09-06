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
    },
  },
  plugins: [],
} satisfies Config;

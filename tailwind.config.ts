import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#071224",
        surface: {
          50: "#0d1f38",
          100: "#0b192e",
          200: "#091424",
          DEFAULT: "#081528",
        },
        brand: {
          mint: "#35e0b2",
          cyan: "#56b9ff",
          blue: "#1a78a8",
          indigo: "#4f46e5",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(53, 224, 178, 0.15) 0%, transparent 70%)",
        "radial-accent": "radial-gradient(circle at 80% 20%, rgba(86, 185, 255, 0.12) 0%, transparent 60%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flow-line": "flow 3s ease-in-out infinite",
      },
      keyframes: {
        flow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;

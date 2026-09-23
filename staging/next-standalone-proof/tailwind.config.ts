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
        background: "#08090a", // Void: near-black canvas from Linear design system
        surface: {
          50: "#161718", // Obsidian: elevated surfaces
          100: "#0f1011", // Carbon: card surfaces
          200: "#08090a", // Void: deeper background
          DEFAULT: "#0f1011", // Carbon: default surface
        },
        brand: {
          mint: "#e4f222", // Acid Lime: primary action color (Linear's signature)
          cyan: "#02b8cc", // Signal Teal: decorative accent
          blue: "#1a78a8", // Original blue (kept for compatibility)
          indigo: "#6366f1", // Iris Violet: tag/badge fills
        },
        neutral: {
          void: "#08090a", // Page canvas
          carbon: "#0f1011", // Card surfaces
          obsidian: "#161718", // Elevated surfaces
          graphite: "#23252a", // Subtle borders
          smoke: "#383b3f", // Hairline borders
          ash: "#62666d", // Muted body text
          fog: "#8a8f98", // Tertiary text
          mist: "#d0d6e0", // Secondary headings
          bone: "#e5e5e6", // Near-white surfaces
          paper: "#ffffff", // Primary headings
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(228, 242, 34, 0.15) 0%, transparent 70%)",
        "radial-accent": "radial-gradient(circle at 80% 20%, rgba(2, 184, 204, 0.12) 0%, transparent 60%)",
      },
      fontFamily: {
        sans: ['"Geist"', '"Segoe UI Variable"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Berkeley Mono"', '"Cascadia Code"', 'monospace'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1', letterSpacing: '-0.022em', fontWeight: '510' }],
        'heading-lg': ['64px', { lineHeight: '1', letterSpacing: '-0.022em', fontWeight: '510' }],
        'heading': ['48px', { lineHeight: '1', letterSpacing: '-0.022em', fontWeight: '510' }],
        'heading-sm': ['32px', { lineHeight: '1.13', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '1.33', fontWeight: '590' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '24': '6rem',   // 96px - section gaps
      },
      borderRadius: {
        'card': '12px',    // Card radius
        'button': '6px',   // Button radius
        'pill': '9999px',  // Pill radius
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

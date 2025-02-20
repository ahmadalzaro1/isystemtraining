
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        midnight: "#0A192F",
        cosmic: "#000014",
        neon: "#00FFFF",
        aurora: "#BB86FC",
        silver: "#EAEAEA",
        glass: "#F8F9FA",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgb(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--foreground) / 0.1) 1px, transparent 1px)",
        'glow-grid-gradient': "linear-gradient(to bottom, rgba(0,255,255,0.1) 0%, rgba(187,134,252,0.1) 100%)",
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0,255,255,0.3)',
        'aurora': '0 0 20px rgba(187,134,252,0.3)',
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "text-shimmer": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
        particles: {
          "0%, 100%": {
            transform: "translateY(0) rotate(0)",
            opacity: "0",
          },
          "50%": {
            transform: "translateY(-20px) rotate(45deg)",
            opacity: "0.5",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "text-shimmer": "text-shimmer 2s linear infinite",
        "particles": "particles 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

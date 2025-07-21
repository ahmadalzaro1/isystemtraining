
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
    screens: {
      'xs': '375px',     // iPhone SE
      'sm': '390px',     // iPhone 12 mini / Small mobile
      'md': '768px',     // Tablets / Medium devices
      'lg': '1024px',    // Desktop / Large screens
      'xl': '1280px',    // Large desktop
      '2xl': '1536px',   // Extra large desktop
      // iPhone-specific breakpoints
      'iphone-se': '375px',
      'iphone-mini': '390px', 
      'iphone-pro': '393px',
      'iphone-max': '428px',
      'ipad-mini': '768px',
      'ipad': '1024px',
    },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "sm": "540px",
          "md": "720px", 
          "lg": "960px",
          "xl": "1140px",
          "2xl": "1320px",
        },
      },
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        // iOS system colors
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-purple': '#AF52DE',
        'ios-pink': '#FF2D92',
        'ios-teal': '#5AC8FA',
        'ios-indigo': '#5856D6',
        'ios-gray': '#8E8E93',
        'ios-gray2': '#AEAEB2',
        'ios-gray3': '#C7C7CC',
        'ios-gray4': '#D1D1D6',
        'ios-gray5': '#E5E5EA',
        'ios-gray6': '#F2F2F7',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgb(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--foreground) / 0.05) 1px, transparent 1px)",
        'ios-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        'blue': '0 0 20px rgba(0,122,255,0.2)',
        'ios': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'ios-xl': '0 16px 48px rgba(0, 0, 0, 0.20)',
      },
      borderRadius: {
        'ios': '8px',
        'ios-lg': '12px',
        'ios-xl': '16px',
      },
      fontFamily: {
        'system': [
          // iOS system fonts
          '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display',
          // Android system fonts
          'Roboto', 'Noto Sans',
          // Windows system fonts
          'Segoe UI',
          // Fallbacks
          'Helvetica Neue', 'Arial', 'sans-serif'
        ],
        'sf-pro': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        'android': ['Roboto', 'Noto Sans', '-apple-system', 'sans-serif'],
        'windows': ['Segoe UI', '-apple-system', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'ios-caption': ['12px', '16px'],
        'ios-footnote': ['13px', '18px'],
        'ios-subheadline': ['15px', '20px'],
        'ios-callout': ['16px', '21px'],
        'ios-body': ['17px', '22px'],
        'ios-headline': ['17px', '22px'],
        'ios-title3': ['20px', '25px'],
        'ios-title2': ['22px', '28px'],
        'ios-title1': ['28px', '34px'],
        'ios-large-title': ['34px', '41px'],
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
        "ios-bounce": {
          "0%, 20%, 53%, 80%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "40%, 43%": {
            transform: "translate3d(0, -8px, 0)",
          },
          "70%": {
            transform: "translate3d(0, -4px, 0)",
          },
          "90%": {
            transform: "translate3d(0, -2px, 0)",
          },
        },
        "ios-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "ios-slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
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
        wave: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
        "ios-bounce": "ios-bounce 1s ease-in-out",
        "ios-pulse": "ios-pulse 2s ease-in-out infinite",
        "ios-slide-up": "ios-slide-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "float": "float 6s ease-in-out infinite",
        "text-shimmer": "text-shimmer 2s linear infinite",
        "particles": "particles 10s ease-in-out infinite",
        "wave": "wave 8s linear infinite"
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom iOS utilities plugin
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.webkit-tap-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.webkit-scrolling': {
          '-webkit-overflow-scrolling': 'touch',
        },
        '.ios-safe-area-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.ios-safe-area-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.ios-safe-area-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.ios-safe-area-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.ios-safe-area': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-right': 'env(safe-area-inset-right)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

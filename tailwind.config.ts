import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#101216",
        panel: "#1e2127",
        panel2: "#3c4148",
        text: "#ececec",
        accent: "#50b4ff",
        danger: "#ff8c8c"
      },
      keyframes: {
        starDrift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(2000px)" }
        },
        twinkle: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 }
        },
        shipFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" }
        }
      },
      animation: {
        starDrift: "starDrift 40s linear infinite",
        twinkle: "twinkle 2.8s ease-in-out infinite",
        shipFloat: "shipFloat 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#03040a",
        foreground: "#f5f5f5",
        accent: {
          DEFAULT: "#ff4b5c",
          soft: "#ff9aa5",
          muted: "#7c2430",
          lime: "#a4ff00" // Lime green accent for Lando-style typography
        },
        surface: {
          DEFAULT: "#070917",
          elevated: "#0f1324",
          subtle: "#111827"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        "display-alt": ["var(--font-display-alt)", "system-ui", "sans-serif"],
        "sans-alt": ["var(--font-sans-alt)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 75, 92, 0.45)"
      },
      transitionTimingFunction: {
        "soft-spring": "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      screens: {
        xs: "400px"
      },
      fontSize: {
        // Fluid type scale via clamp()
        "display-4": [
          "clamp(3.75rem, 6vw, 5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.08em" }
        ],
        "display-3": [
          "clamp(3rem, 5vw, 4rem)",
          { lineHeight: "0.95", letterSpacing: "-0.06em" }
        ],
        "display-2": [
          "clamp(2.5rem, 4vw, 3.25rem)",
          { lineHeight: "1", letterSpacing: "-0.04em" }
        ],
        "display-1": [
          "clamp(2rem, 3vw, 2.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em" }
        ]
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};



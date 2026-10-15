import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0A", 900: "#0A0A0A", 850: "#0E0E0F", 800: "#121214", 700: "#18181B", 600: "#232326" },
        fog: { 100: "#F5F5F5", 200: "#E5E5E5", 300: "#A3A3A3", 400: "#9A9AA0", 500: "#86868C" },
        accent: { DEFAULT: "#3B82F6", soft: "#60A5FA", strong: "#2563EB", deep: "#1D4ED8" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6.2vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
        headline: ["clamp(2rem, 4.6vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        title: ["clamp(1.5rem, 2.6vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.5), 0 8px 32px -6px rgba(59,130,246,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
        "glow-lg": "0 0 0 1px rgba(96,165,250,0.7), 0 12px 48px -6px rgba(59,130,246,0.75), inset 0 1px 0 rgba(255,255,255,0.3)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 64px -24px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        marquee: { from: { transform: "translate3d(0,0,0)" }, to: { transform: "translate3d(-50%,0,0)" } },
        drift: {
          "0%, 100%": { transform: "translate3d(-50%, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-46%, -4%, 0) scale(1.08)" },
        },
        "hero-in": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0)", filter: "blur(10px)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)", filter: "blur(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.32s cubic-bezier(0.22,1,0.36,1)",
        "accordion-up": "accordion-up 0.28s cubic-bezier(0.22,1,0.36,1)",
        marquee: "marquee 40s linear infinite",
        drift: "drift 18s ease-in-out infinite",
        "hero-in": "hero-in 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

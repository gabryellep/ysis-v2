import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        rose: "rgb(var(--color-rose) / <alpha-value>)",
        lavender: "rgb(var(--color-lavender) / <alpha-value>)",
        wine: "rgb(var(--color-wine) / <alpha-value>)",
        ember: "rgb(var(--color-ember) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)"
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        veil: "var(--shadow-veil)",
        bloom: "var(--shadow-bloom)"
      },
      borderRadius: {
        soft: "var(--radius-soft)",
        silk: "var(--radius-silk)",
        orbit: "var(--radius-orbit)"
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)"
      },
      transitionTimingFunction: {
        ysis: "var(--ease-ysis)"
      }
    }
  },
  plugins: []
};

export default config;

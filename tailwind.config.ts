import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // color-mix + <alpha-value> so Tailwind opacity modifiers (e.g. bg-panel/80) emit CSS
        bg: "color-mix(in srgb, var(--bg) calc(<alpha-value> * 100%), transparent)",
        panel: "color-mix(in srgb, var(--panel) calc(<alpha-value> * 100%), transparent)",
        frame: "color-mix(in srgb, var(--frame) calc(<alpha-value> * 100%), transparent)",
        accent: {
          DEFAULT:
            "color-mix(in srgb, var(--accent) calc(<alpha-value> * 100%), transparent)",
          hi: "color-mix(in srgb, var(--accent-hi) calc(<alpha-value> * 100%), transparent)",
        },
        ink: "color-mix(in srgb, var(--text) calc(<alpha-value> * 100%), transparent)",
        muted:
          "color-mix(in srgb, var(--muted) calc(<alpha-value> * 100%), transparent)",
      },
      fontFamily: {
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
        display: ["var(--display)"],
      },
    },
  },
  plugins: [],
};

export default config;

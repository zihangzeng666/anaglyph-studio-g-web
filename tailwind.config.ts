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
        bg: "var(--bg)",
        panel: "var(--panel)",
        frame: "var(--frame)",
        accent: {
          DEFAULT: "var(--accent)",
          hi: "var(--accent-hi)",
        },
        ink: "var(--text)",
        muted: "var(--muted)",
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

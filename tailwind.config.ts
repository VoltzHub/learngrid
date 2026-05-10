import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "Segoe UI", "sans-serif"],
      },
      colors: {
        primary: "#1e57d8",
        "primary-deep": "#143aa3",
        success: "#1fae7f",
        ink: "#0f172a",
        muted: "#4b5563",
      },
    },
  },
  plugins: [],
};
export default config;

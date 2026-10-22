import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#E7F3ED",
          100: "#D3E9DF",
          200: "#AAD4C2",
          500: "#42A887",
          600: "#2A7C60",
          700: "#1E6550",
          800: "#164E3D",
          850: "#11231B",
          900: "#0D382B", // Primary brand button & pill color
          950: "#061F17",
        },
        sage: {
          400: "#86998F",
          500: "#6B7F75", // Eyebrow & sub-labels
          600: "#526058", // Body copy
          700: "#3D4943",
        },
        canvas: {
          50: "#FBFDFB",
          100: "#F9FAF9", // Main off-white background
          200: "#F2F5F3",
          300: "#E6ECE8", // Subtle borders
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(13, 56, 43, 0.05), 0 2px 6px -1px rgba(13, 56, 43, 0.03)",
        elevated: "0 10px 30px -5px rgba(13, 56, 43, 0.08), 0 4px 10px -2px rgba(13, 56, 43, 0.04)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;

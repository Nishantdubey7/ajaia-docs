import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f5ff",
          100: "#e5eaff",
          500: "#4a5cf6",
          600: "#3a46d6",
          700: "#2e37ab",
        },
      },
    },
  },
  plugins: [],
};

export default config;

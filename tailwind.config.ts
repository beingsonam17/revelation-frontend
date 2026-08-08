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
        brand: {
          50: '#fef8ee',
          100: '#fdf0d6',
          200: '#fbe0ac',
          300: '#f7c978',
          400: '#f3aa44',
          500: '#ef8f1f',
          600: '#d97706',
          700: '#b45709',
          800: '#92430e',
          900: '#78380f',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "pop-blob": {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.2)" },
          "66%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" }
        }
      },
      filter: {
        "blur-20": "blur(20px)",
        "blur-25": "blur(25px)"
      },
      animation: {
        "pop-blob": "pop-blob 5s infinite"
      }
    }
  },
  plugins: []
};

export default config;

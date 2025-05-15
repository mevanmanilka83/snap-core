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
        },
        float: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(100%, 0)" },
          "50%": { transform: "translate(100%, 100%)" },
          "75%": { transform: "translate(0, 100%)" },
          "100%": { transform: "translate(0, 0)" }
        }
      },
      filter: {
        "blur-20": "blur(20px)",
        "blur-25": "blur(25px)"
      },
      animation: {
        "pop-blob": "pop-blob 5s infinite",
        "float": "float 10s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;

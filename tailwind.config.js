
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#07110F",
          surface: "#101E1B",
          elevated: "#14251F",
          line: "#293A36",
          mint: "#73F0B8",
          cyan: "#29CDE6",
          amber: "#F6C66B",
          muted: "#9AAF A A".replaceAll(" ", ""),
          text: "#EDF7F3",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(115, 240, 184, 0.12)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.18)",
      },
      backgroundImage: {
        "lab-grid":
          "radial-gradient(circle, rgba(115,240,184,0.13) 1px, transparent 1px)",
        "lab-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(41,205,230,0.10), transparent 65%)",
      },
      animation: {
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

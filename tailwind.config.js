/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  content: [],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
      },
    },
    extend: {
      fontFamily: {
        zenkaku: ["Zen Kaku Gothic New"],
      },
      colors: {
        basec: "#eceff4",
        main: "#091445",
        accent: "#4c566a",
        main_light: "#81a1c1",
        link: "#88c0d0",
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
      boxShadow: {
        custom01: "0 0 5px rgba(0, 0, 0, 0.3)",
      },
      transitionTimingFunction: {
        easeInOutBack: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
    },
  },
  corePlugins: {},
  plugins: [],
};

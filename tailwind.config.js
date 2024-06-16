/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cyan-bluish-gray": "#abb8c3",
        "pale-pink": "#f78da7",
        "vivid-red": "#cf2e2e",
        "luminous-vivid-orange": "#ff6900",
        "luminous-vivid-amber": "#fcb900",
        "light-green-cyan": "#7bdcb5",
        "vivid-green-cyan": "#00d084",
        "pale-cyan-blue": "#8ed1fc",
        "vivid-cyan-blue": "#0693e3",
        "vivid-purple": "#9b51e0",
        "dark-cerulean": "#145f64",
        bronze: "#ce972f",
        "steel-blue": "#428bca",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#990abd",
      text: "#0D0F10",
      background: "#0D0F10",
      accent: "#F9E5FF",
      white: "#fff",
      chatBackground: "#f6f6f6",
    },
    // colors: {
    //   primary: "#00F0D3",
    //   text: "#CFCFCF",
    //   background: "#0D0F10",
    //   accent: "#FF67D4",
    //   white: "#fff",
    // },
  },
  plugins: [],
};

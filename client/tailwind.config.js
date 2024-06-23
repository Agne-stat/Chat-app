/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#ef16e6",
      text: "#0D0F10",
      background: "#0D0F10",
      accent: "#f2cdf0",
      white: "#fff",
      chatBackground: "#f6f6f6",
      gray: "#f0f0f0",
    },
    width: {
      chatBody: "450px",
      profile: "40px",
      full: "100%",
      half: "50%",
      inputButton: "80px",
    },
  },
  plugins: [],
};

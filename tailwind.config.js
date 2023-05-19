module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        128: "32rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

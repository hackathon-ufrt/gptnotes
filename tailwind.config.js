module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        128: "32rem",
        160: "40rem",
        192: "48rem",
      },
      maxHeight: {
        128: "32rem",
        160: "40rem",
        192: "48rem",
      },
      spacing: {
        128: "32rem",
        160: "40rem",
        192: "48rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

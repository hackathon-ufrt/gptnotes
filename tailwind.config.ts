import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "128": "32rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

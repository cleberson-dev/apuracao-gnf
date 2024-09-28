/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
  content: ["public.html", "./src/vue/**/*.{vue,ts,js,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: "#2a9d8f",
        borderColor: "#e5e7eb",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
    },
    extend: {
      colors: {
        // Deep forest green — primary brand color
        forest: {
          50: "#f2f7f2",
          100: "#e0ebe0",
          200: "#c1d7c2",
          300: "#98bd9a",
          400: "#699c6d",
          500: "#487d4d",
          600: "#35633a",
          700: "#2b4f2f",
          800: "#1f3823", // deep forest
          900: "#152819",
          950: "#0b1610",
        },
        // Earthy brown
        earth: {
          50: "#f9f5f0",
          100: "#f0e6d8",
          200: "#e0c9ac",
          300: "#cca97c",
          400: "#b48856",
          500: "#9c6f3f",
          600: "#815732",
          700: "#65432a",
          800: "#4d3320",
          900: "#372516",
        },
        // Soft gold accent
        gold: {
          50: "#fdf9ee",
          100: "#faf0cd",
          200: "#f3dd97",
          300: "#eac660",
          400: "#e0ad3a",
          500: "#cb9128",
          600: "#a8721f",
          700: "#84571c",
          800: "#6c471d",
          900: "#5b3c1d",
        },
        // Cream / warm white background family
        cream: {
          50: "#fffdf8",
          100: "#fdf8ee",
          200: "#f9f0dd",
          300: "#f3e5c6",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(31, 56, 35, 0.15)",
        card: "0 2px 12px -2px rgba(31, 56, 35, 0.12)",
        lift: "0 12px 32px -8px rgba(31, 56, 35, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out both",
        slideUp: "slideUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

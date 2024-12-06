/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        QuranFont: ["QuranFont"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      textDirection: {
        rtl: "rtl",
        ltr: "ltr",
      },
      height: {
        '13vh': '13vh',
        '85vh': '85vh',
        '1vh': '1vh',
        '100vh': '100vh',
      },
      width: {
        '100vw': '100vw',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('children', '& > *')
    },
  ],
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {
      margin: ["rtl"],
      padding: ["rtl"],
      space: ["rtl"],
      textAlign: ["rtl"],
    },
  },
}

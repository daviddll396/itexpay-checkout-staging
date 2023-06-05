/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom_shadow: "0px 4px 40px rgba(0, 0, 0, 0.12)",
        custom_shadow_two:"5px 7px 0px 2px rgba(230,237,224,0.47)",
        bank_shadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        theme: "#27AE60",
        dark: "#041926",
        title: "#041926",
        text: "#333333",
        muted: "#B9B9B9",
        test: "#CEA528",
      },
      borderRadius: {
        theme: "20px",
      },
      // fontFamily: {
      //   sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      // },
      screens: {
        switch: "540px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [
    // require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ],
};

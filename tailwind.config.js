// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // Optional: DaisyUI theme configuration
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}
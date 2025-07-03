// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",       // App router pages
    "./src/pages/**/*.{js,jsx}",     // Optional if using pages
    "./src/components/**/*.{js,jsx}" // Your shared components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

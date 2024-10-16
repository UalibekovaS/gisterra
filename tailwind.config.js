/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        500: '#8e4530',  // You can adjust the hex value to your desired brown color
        600: '#8B4513',
        700: '#654321',
      },
      width: {
        128: '28rem', // Add this line for custom width
      },
      
    },
  },
  plugins: [],
};

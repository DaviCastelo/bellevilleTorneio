/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'verde-brasil': '#00A859',
        'amarelo-brasil': '#FFDF00',
        'azul-brasil': '#002776',
      },
    },
  },
  plugins: [],
}

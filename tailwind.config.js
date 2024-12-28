/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#edb124',
        'light-border': '#374151',
      },
    },
  },
  plugins: [
    (await import('@tailwindcss/forms')).default,
    (await import('@tailwindcss/typography')).default,
  ],
}

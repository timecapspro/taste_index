/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft-xl': '0 25px 80px -40px rgba(15,23,42,0.7), 0 18px 40px -32px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'ambient-gradient':
          'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(167,139,250,0.12), transparent 30%), radial-gradient(circle at 80% 60%, rgba(248,113,113,0.12), transparent 25%), radial-gradient(circle at 0% 80%, rgba(52,211,153,0.14), transparent 35%)',
      },
    },
  },
  plugins: [],
}

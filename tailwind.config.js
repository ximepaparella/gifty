/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths should include only client-related files
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/features/client/**/*.{js,ts,jsx,tsx}',
    './src/features/website/components/*.{js,ts,jsx,tsx}',
  ],
  // Use prefix to prevent Tailwind classes from conflicting with other styling
  prefix: 'tw-',
  // Disable Tailwind's reset to avoid conflicts with Ant Design
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      maxWidth: {
        '7xl': '80rem',
      },
      colors: {
        gifty: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}; 
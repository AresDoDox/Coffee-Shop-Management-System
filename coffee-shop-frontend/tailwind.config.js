/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        textMain: 'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
      },
    },
  },
  plugins: [],
};

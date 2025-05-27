/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './app/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        foreground: '#133E87',
        primary: '#133E87',
        secondary: '#CBDCEB',
        accent: '#608BC1',
        muted: '#CBDCEB',
        destructive: '#133E87',
        card: '#F3F3E0',
        border: '#133E87',
        input: '#CBDCEB',
        ring: '#608BC1',
        sidebar: '#F3F3E0',
        'sidebar-foreground': '#133E87',
        'sidebar-primary': '#133E87',
        'sidebar-primary-foreground': '#F3F3E0',
        'sidebar-accent': '#608BC1',
        'sidebar-accent-foreground': '#133E87',
        'chart-1': '#F3F3E0',
        'chart-2': '#608BC1',
        'chart-3': '#CBDCEB',
        'chart-4': '#608BC1',
        'chart-5': '#133E87',
      },
      borderRadius: {
        sm: 'calc(0.625rem - 4px)',
        md: 'calc(0.625rem - 2px)',
        lg: '0.625rem',
        xl: 'calc(0.625rem + 4px)',
      },
    },
  },
  plugins: [require('tw-animate-css')],
};

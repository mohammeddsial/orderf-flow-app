/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#F4F6F9',
        foreground: '#1E2D4A',
        card: '#ffffff',
        'card-foreground': '#1E2D4A',
        popover: '#ffffff',
        'popover-foreground': '#1E2D4A',
        primary: '#FF6B35',
        'primary-foreground': '#ffffff',
        secondary: '#F4F6F9',
        'secondary-foreground': '#1E2D4A',
        muted: '#F8FAFC',
        'muted-foreground': '#94A3B8',
        accent: '#FFF8F5',
        'accent-foreground': '#FF6B35',
        destructive: '#E84545',
        'destructive-foreground': '#ffffff',
        border: '#E2E8F0',
        input: 'transparent',
        'input-background': '#FAFBFC',
        'switch-background': '#CBD5E1',
        ring: '#FF6B35',
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        fontFamily: {
          display: ['"Playfair Display"', 'serif'],
          body: ['Outfit', 'system-ui', 'sans-serif'],
        },
        colors: {
          brand: {
            primary: '#C62828',
            'primary-dark': '#A02020',
            secondary: '#FFB703',
            accent: '#8B4513',
            cream: '#FFF8F2',
            ink: '#1A1A1A',
          },
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
          popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
          primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
          secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
          muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
          accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
          destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
          'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
          'slow-zoom': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.08)' } },
          'marquee': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
          'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'slow-zoom': 'slow-zoom 14s ease-in-out infinite alternate',
          'marquee': 'marquee 30s linear infinite',
          'shimmer': 'shimmer 2s linear infinite',
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
};

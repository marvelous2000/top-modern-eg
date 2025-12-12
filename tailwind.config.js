/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem', // px-4
        sm: '1.5rem',    // sm:px-6
        lg: '2rem',      // lg:px-8
      },
    },
    extend: {
      colors: {
        cream: {
          50: '#FFFEF9', // Card bg (Light)
          100: '#FDFBF7', // Main bg (Light)
          200: '#F5F5DC', // Borders
        },
        gold: {
          400: '#E5C158',
          500: '#D4AF37', // Primary Brand Color
          600: '#B4942D', // Hover State
          50: '#F9F5E6',  // Light tint
        },
        charcoal: {
          800: '#2D3748', // Card bg (Dark)
          900: '#1A202C', // Main bg (Dark)
          950: '#171923', // Sidebar/Nav bg (Dark)
        },
        // Light Mode HSL values from UI_SPECIFICATIONS_TODO.md
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        success: 'hsl(var(--success))',
        'success-foreground': 'hsl(var(--success-foreground))',
        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Admin Panel/Sidebar specific colors (assuming they follow the same dark/light mode pattern or are dark mode only)
        sidebar: 'hsl(var(--sidebar))',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'sidebar-primary': 'hsl(var(--sidebar-primary))',
        'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        'sidebar-accent': 'hsl(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        'sidebar-border': 'hsl(var(--sidebar-border))',
        'sidebar-ring': 'hsl(var(--sidebar-ring))',

        chart: {
          '1': '#3b82f6', // Keep as is for now, not in spec
          '2': '#10b981',
          '3': '#f59e0b',
          '5': '#dc2626',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        arabic: ['Noto Sans Arabic', 'Tajawal', 'Cairo', 'sans-serif'], // Keep arabic for now as it was present and not explicitly removed by spec
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
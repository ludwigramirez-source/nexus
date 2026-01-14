module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-800
          foreground: 'var(--color-primary-foreground)' // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // slate-600
          foreground: 'var(--color-secondary-foreground)' // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // amber-600
          foreground: 'var(--color-accent-foreground)' // white
        },
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // gray-800
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)' // gray-700
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // gray-800
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // slate-100
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        border: 'var(--color-border)', // slate-200
        input: 'var(--color-input)', // slate-200
        ring: 'var(--color-ring)', // blue-800
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)' // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // red-600
          foreground: 'var(--color-warning-foreground)' // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-700
          foreground: 'var(--color-error-foreground)' // white
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem'
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '10px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px'
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(15, 23, 42, 0.08)',
        'DEFAULT': '0 4px 8px rgba(15, 23, 42, 0.1)',
        'md': '0 4px 8px rgba(15, 23, 42, 0.1)',
        'lg': '0 8px 16px rgba(15, 23, 42, 0.12)',
        'xl': '0 12px 24px rgba(15, 23, 42, 0.14)',
        '2xl': '0 20px 40px -8px rgba(15, 23, 42, 0.16)'
      },
      transitionDuration: {
        '250': '250ms'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      zIndex: {
        '1': '1',
        '50': '50',
        '100': '100',
        '200': '200',
        '300': '300'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}
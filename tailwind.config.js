/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'text-primary': '#1a1a1a',
  			'text-secondary': '#2d2d2d',
  			'text-tertiary': '#4a4a4a',
  			'text-light': '#f5f5f5',
  			accent: {
  				DEFAULT: '#ff4b5c', /* Keep original red accent */
  				soft: '#ff9aa5',
  				muted: '#7c2430',
  				lime: '#a4ff00',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			surface: {
  				DEFAULT: '#070917',
  				elevated: '#0f1324',
  				subtle: '#111827'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		fontFamily: {
			display: [
				'var(--font-display)',
				'system-ui',
				'sans-serif'
			],
			sans: [
				'var(--font-sans)',
				'system-ui',
				'sans-serif'
			]
		},
  		boxShadow: {
  			glow: '0 0 40px rgba(255, 75, 92, 0.45)'
  		},
  		transitionTimingFunction: {
  			'soft-spring': 'cubic-bezier(0.16, 1, 0.3, 1)'
  		},
  		screens: {
  			xs: '400px'
  		},
  		fontSize: {
  			'hero': [
  				'clamp(3rem, 9vw + 1rem, 7rem)',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em'
  				}
  			],
  			'section-heading': [
  				'clamp(2.25rem, 5vw + 1rem, 4rem)',
  				{
  					lineHeight: '1.15',
  					letterSpacing: '-0.015em'
  				}
  			],
  			'manifesto': [
  				'clamp(2rem, 4vw + 1rem, 3.5rem)',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.02em'
  				}
  			],
  			'body': [
  				'clamp(0.9375rem, 0.5vw + 0.75rem, 1.125rem)',
  				{
  					lineHeight: '1.55',
  					letterSpacing: '0'
  				}
  			],
  			'label': [
  				'clamp(0.625rem, 0.3vw + 0.5rem, 0.75rem)',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '0.1em'
  				}
  			],
  			'display-4': [
  				'clamp(3.75rem, 6vw, 5rem)',
  				{
  					lineHeight: '0.9',
  					letterSpacing: '-0.08em'
  				}
  			],
  			'display-3': [
  				'clamp(3rem, 5vw, 4rem)',
  				{
  					lineHeight: '0.95',
  					letterSpacing: '-0.06em'
  				}
  			],
  			'display-2': [
  				'clamp(2.5rem, 4vw, 3.25rem)',
  				{
  					lineHeight: '1',
  					letterSpacing: '-0.04em'
  				}
  			],
  			'display-1': [
  				'clamp(2rem, 3vw, 2.5rem)',
  				{
  					lineHeight: '1.05',
  					letterSpacing: '-0.03em'
  				}
  			]
  		},
  		spacing: {
  			'rhythm-1': '0.5rem',
  			'rhythm-2': '0.75rem',
  			'rhythm-3': '1.25rem',
  			'rhythm-4': '2rem',
  			'rhythm-5': '3rem',
  			'rhythm-6': '4.5rem',
  			'rhythm-7': '6rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")]
};



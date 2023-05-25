import colors from 'tailwindcss/colors';
import typographyPlugin from '@tailwindcss/typography';

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: colors.blue,
      secondary: colors.emerald,
      success: colors.green,
      error: colors.red,
      warn: colors.yellow,
    },
    borderRadius: {
      sm: '4px',
      DEFAULT: '8px',
      md: '10px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    },
    extend: {
      typography: {
        sm: {
          css: {
            '*': {
              marginTop: `${1 / 3}em`,
              marginBottom: `${1 / 3}em`,
            },
          },
        },
        base: {
          css: {
            '*': {
              marginTop: `${1 / 3}em`,
              marginBottom: `${1 / 3}em`,
            },
          },
        },
        lg: {
          css: {
            '*': {
              marginTop: `${1 / 3}em`,
              marginBottom: `${1 / 3}em`,
            },
          },
        },
      },
    },
  },
  plugins: [
    typographyPlugin(),
  ],
};

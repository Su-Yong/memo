import colors from 'tailwindcss/colors';

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
    }
  },
  plugins: [],
}


import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      zIndex: {
        '999': '999'
      }
    },
  },
  plugins: [
    forms,
  ],
} satisfies Config


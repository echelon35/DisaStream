import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '576px',
        'tablet': '768px',
        'desktop': '992px',
        'tv': '1400px',
      },
    },
  },
  plugins: [
    forms,
  ],
} satisfies Config


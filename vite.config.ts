import { defineConfig } from 'vite'

export default defineConfig({
  base: '/milrakt/',
  build: {
    // Vite 8 defaults to a newer browser baseline. Keep Vite 5's previous default
    // so older iPhones (Safari 14+) keep working.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
})

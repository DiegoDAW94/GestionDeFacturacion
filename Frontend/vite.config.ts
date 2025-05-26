import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importa el plugin de Tailwind CSS

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Agrega el plugin de Tailwind CSS
  ],
  base:'/app/'
})

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vercel sets VERCEL=1 during its builds. Analytics only loads there, so local runs stay
  // free of requests to /_vercel/insights (which exists only on Vercel).
  define: { __ON_VERCEL__: JSON.stringify(Boolean(process.env.VERCEL)) },
  server: { port: 5410, strictPort: false },
  preview: { port: 4410 },
});

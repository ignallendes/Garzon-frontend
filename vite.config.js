import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Permite probar desde el celular en la misma red Wi-Fi
    proxy: {
      // Redirige llamadas HTTP al backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Redirige la conexión de Socket.io
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
});
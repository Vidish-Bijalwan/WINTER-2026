import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/WINTER-2026/",
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Prevent files from starting with "_" which can cause issues with GitHub Pages
        sanitizeFileName: (name) => {
          // Allow alphanumeric, underscores, hyphens, and dots
          const sanitized = name.replace(/[^a-z0-9_.-]/gi, '_');
          // Remove leading underscores
          return sanitized.replace(/^_/, '');
        },
        // Manual chunks to ensure better caching and avoid huge files
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));

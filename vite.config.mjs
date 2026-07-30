import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE || "/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [
    react(),
    {
      name: "site-origin",
      transformIndexHtml(html) {
        return html.replaceAll(
          "__SITE_ORIGIN__",
          process.env.VITE_SITE_ORIGIN || "__SITE_ORIGIN__",
        );
      },
    },
  ],
});

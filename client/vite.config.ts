import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    strictPort: true,
    hmr: {
      protocol: "ws",
      path: "ws",
      host: "localhost",
      clientPort: 5173,
      port: 5173,
    },
  },
});

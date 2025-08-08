import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.svg"],
  define: {
    global: "globalThis",
  },
  server: {
    port: 5173,
    host: true,
    // Handle client-side routing by serving index.html for all routes
    fs: {
      allow: [".."],
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
});

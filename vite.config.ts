import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    // For local full-stack dev: run `npm run dev:full` (vercel dev, bound to
    // port 3999) in a second terminal alongside plain `npm run dev` here.
    // Vite's own dev server handles the frontend (fast HMR); anything under
    // /api gets proxied to that vercel dev instance for the real backend.
    //
    // Deliberately NOT using `vercel dev` to serve the frontend itself —
    // combining it with a custom vercel.json `rewrites` array breaks Vite's
    // own dev-only asset requests (/@vite/client, /src/main.tsx, etc. all
    // 404, since the SPA-fallback rewrite catches them too). That only
    // affects this local dev arrangement; production is unaffected because
    // it serves prebuilt static files, which Vercel matches before
    // consulting any rewrite.
    proxy: {
      "/api": "http://localhost:3999",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});

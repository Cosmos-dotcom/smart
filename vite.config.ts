import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/smart/",
  resolve: {
    alias: {
      "/assets": path.resolve(process.cwd(), "public/assets"),
    },
  },
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
  },
});

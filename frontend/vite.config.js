import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/choreo-apis/awbo/backend/rest-api-be2/v1.0": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/choreo-apis\/awbo\/backend\/rest-api-be2\/v1.0/, ""),
      },
    },
  },
});

import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app-1",
      filename: "appOneEntry.js",
      exposes: {
        "./Header": "./src/components/Header.tsx",
        "./Footer": "./src/components/Footer.tsx",
        "./Count": "./src/components/Count.tsx",
      },
      shared: ["react"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

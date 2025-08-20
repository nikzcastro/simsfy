import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { 
    port: 3000, 
    https: {
         key: fs.readFileSync(path.resolve(__dirname, './key/key.pem')),
         cert: fs.readFileSync(path.resolve(__dirname, './key/cert.pem')),
      }
  },
  // build: {
  //   outDir: "C:/xampp/htdocs/simsfy"
  // }
});

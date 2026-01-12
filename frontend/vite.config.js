import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/School-Management-System/",
  plugins: [react()],
  build: {
    outDir: "dist"
  }
});

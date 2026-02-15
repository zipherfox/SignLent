import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
      // Use pre-bundled FESM to work around broken internal paths in the alpha package
      "@tensorflow/tfjs-tflite": path.resolve(
        __dirname,
        "node_modules/@tensorflow/tfjs-tflite/dist/tf-tflite.fesm.js",
      ),
    },
  },
});

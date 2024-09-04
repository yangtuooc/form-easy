/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), crx({ manifest: manifest })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    css: {
        postcss: "./postcss.config.js",
    },
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                background: "background.js",
            },
        },
    },
});

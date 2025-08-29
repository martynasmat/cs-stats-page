import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
    plugins: [
        preact(),
        compression({
            algorithms: ["gzip", "brotli"],
        }),
    ],
});

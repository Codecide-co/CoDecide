import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@components": resolve(__dirname, "src/components"),
            "@assets": resolve(__dirname, "src/assets"),
            "@styles": resolve(__dirname, "src/styles"),
            "@services": resolve(__dirname, "src/services"),
            "@pages": resolve(__dirname, "src/pages"),
            "@layouts": resolve(__dirname, "src/layouts"),
            "@store": resolve(__dirname, "src/store"),
            "@router": resolve(__dirname, "src/router"),
            "@core": resolve(__dirname, "src/core"),
            "@languages": resolve(__dirname, "src/languages"),
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
    },
});
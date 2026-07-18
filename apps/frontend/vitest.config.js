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
            "@utils": resolve(__dirname, "src/utils"),
            "@services": resolve(__dirname, "src/services"),
            "@pages": resolve(__dirname, "src/pages"),
            "@layout": resolve(__dirname, "src/layout"),
            "@store": resolve(__dirname, "src/store"),
            "@router": resolve(__dirname, "src/router"),
            "@helpers": resolve(__dirname, "src/helpers"),
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
    },
});
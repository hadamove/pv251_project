import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    plugins: [topLevelAwait()],
    css: {
        preprocessorOptions: {
            css: {
                charset: false
            }
        }
    },
    assetsInclude: ['**/*.otf']
});

import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig((_configEnv) =>
  defineConfig({
    esbuild: { target: "es2022" },
    optimizeDeps: {
      force: true,
      include: ["@blocksuite/blocks > buffer"],
      esbuildOptions: {
        // Vitest hardcodes the esbuild target to es2020,
        // override it to es2022 for top level await.
        target: "es2022",
      },
    },
  })
);

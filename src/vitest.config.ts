import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: "jsdom",
    setupFiles: "./app/tests/setup.ts",
    alias: {
      "~": "/app",
    },
    reporters: ["verbose"],
    testTimeout: 30000,
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: [
      "node_modules/**",
      "dist/**",
      ".next/**",
      "coverage/**",
      "build/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      all: false,
      include: [
        "app/services/**/*.ts",
        "app/models/**/*.ts",
        "app/repositories/**/*.ts",
        "app/routes/api+/*.tsx",
        "app/server/**/*.ts",
        "app/actions/**/*.ts",
        "app/loaders/**/*.ts",
      ],
      exclude: [
        "app/components/**/*.tsx",
        "app/models/**/*.ts",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.config.ts",
        "**/*.config.js",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  plugins: [tsconfigPaths()],
});

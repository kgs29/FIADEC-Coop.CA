import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    // "forks" isolates each worker in its own OS process, so memory is fully
    // released back to the OS when a worker recycles (unlike "threads", which
    // share one process's heap).
    pool: "forks",
    poolOptions: {
      forks: {
        execArgv: ["--max-old-space-size=4096"],
      },
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "cypress"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "cobertura", "json-summary", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/__tests__/**",
        "src/**/*.d.ts",
        "src/types/**",
      ],
      all: true,
    },
  },
});

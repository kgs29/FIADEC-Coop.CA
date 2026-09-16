import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      return config;
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    specPattern: "cypress/component/**/*.cy.{js,ts,jsx,tsx}",
  },
  env: {
    codeCoverage: {
      exclude: ["cypress/**/*.*"],
    },
  },
  video: false,
});

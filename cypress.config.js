import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // ganti dari 3000 ke 5173
    specPattern: "cypress/e2e/**/*.spec.js",
    supportFile: "cypress/support/e2e.js",
    video: false,
    setupNodeEvents(on, config) {
      // event listeners
    },
  },
});

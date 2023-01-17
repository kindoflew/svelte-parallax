import { defineConfig } from "cypress";
import viteConfig from './sandbox/vite.config.js';

export default defineConfig({
  retries: {
    runMode: 1,
    openMode: 1,
  },
  fixturesFolder: false,
  screenshotOnRunFailure: false,
  video: false,
  scrollBehavior: false,
  component: {
    specPattern: "**/*.spec.js",
    excludeSpecPattern: "**/__snapshots__/*",
    devServer: {
      framework: "svelte",
      bundler: "vite",
      viteConfig
    },
  }
});

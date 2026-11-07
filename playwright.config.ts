import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 90000,
  use: {
    baseURL: "http://127.0.0.1:47293",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath: "/opt/google/chrome/chrome",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  webServer: {
    command: "rm -rf /tmp/mk-e2e-data && mkdir -p /tmp/mk-e2e-data && HUNT_DATA_DIR=/tmp/mk-e2e-data npx next dev -H 127.0.0.1 -p 47293",
    url: "http://127.0.0.1:47293",
    reuseExistingServer: false,
    timeout: 120000,
  },
});

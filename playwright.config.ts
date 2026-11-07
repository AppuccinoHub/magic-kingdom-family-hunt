import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 120000,
  use: {
    baseURL: "http://127.0.0.1:47293",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath: "/opt/google/chrome/chrome",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  webServer: {
    command: "npm run build && python3 -m http.server 47293 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:47293",
    reuseExistingServer: false,
    timeout: 180000,
  },
});

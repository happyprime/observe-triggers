import { defineConfig } from '@playwright/test';

  export default defineConfig({
    webServer: {
      command: 'npx serve ./',
      port: 3000,
      reuseExistingServer: true,
    },
    use: {
      baseURL: 'http://localhost:3000',
    },
	expect: { timeout: 1_000 }
  });

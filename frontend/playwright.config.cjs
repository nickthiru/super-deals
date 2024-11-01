const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Directory where tests are located  
  timeout: 30000, // Default timeout for tests  
  expect: {
    timeout: 5000, // Timeout for expect assertions  
  },
  reporter: 'html', // Generate HTML report  
  webServer: {
    command: 'npm run build && npm run preview', // Command to start your app  
    port: 4173, // Port your app runs on  
    timeout: 120 * 1000, // Timeout for server to start  
    reuseExistingServer: !process.env.CI, // Reuse server in CI  
  },
});
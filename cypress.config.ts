import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.spec.*',
    supportFile: false,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})

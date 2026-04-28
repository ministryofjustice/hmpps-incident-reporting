import { defineConfig } from 'cypress'

import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor'

import { deleteStub, resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import prisonApi from './integration_tests/mockApis/prisonApi'
import incidentReportingApi from './integration_tests/mockApis/incidentReportingApi'
import frontendComponents from './integration_tests/mockApis/frontendComponents'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import offenderSearchApi from './integration_tests/mockApis/offenderSearchApi'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'

function getWebpackOptions() {
  const options = webpackPreprocessor.getFullWebpackOptions()

  // add built-ins as needed
  options.resolve.fallback.util = require.resolve('util')
  options.resolve.fallback.assert = require.resolve('assert')

  return options
}

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  video: false,
  taskTimeout: 60000,
  viewportWidth: 1200,
  viewportHeight: 850,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        deleteStub,
        resetStubs,
        ...incidentReportingApi,
        ...auth,
        ...prisonApi,
        ...manageUsersApi,
        ...offenderSearchApi,
        ...nomisUserRolesApi,
        ...tokenVerification,
        ...frontendComponents,
      })
      on(
        'file:preprocessor',
        webpackPreprocessor({
          typescript: true,
          webpackOptions: getWebpackOptions(),
        }),
      )
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})

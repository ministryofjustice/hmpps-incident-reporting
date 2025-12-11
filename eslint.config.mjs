import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

const config = hmppsConfig({
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs', 'scripts/**'],
})
config.push({
  name: 'allow lone export',
  rules: { 'import/prefer-default-export': 'off' },
})
export default config

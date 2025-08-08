import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

const config = hmppsConfig({
  extraPathsAllowingDevDependencies: ['scripts/**'],
})
config.push({
  name: 'allow lone export',
  rules: { 'import/prefer-default-export': 'off' },
})
export default config

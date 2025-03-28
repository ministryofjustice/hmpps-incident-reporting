const childProcess = require('node:child_process')
const path = require('node:path')

const chokidar = require('chokidar')
const { glob } = require('glob')

const buildAssets = require('./assets.config')
const buildApp = require('./app.config')

const cwd = process.cwd()

/**
 * Configuration for build steps
 * @type {BuildConfig}
 */
const buildConfig = {
  isProduction: process.env.NODE_ENV === 'production',

  app: {
    outDir: path.join(cwd, 'dist'),
    entryPoints: glob
      .sync([path.join(cwd, '*.ts'), path.join(cwd, 'server/**/*.ts')])
      .filter(file => !file.endsWith('.test.ts')),
    copy: [
      {
        from: path.join(cwd, 'server/views/**/*'),
        to: path.join(cwd, 'dist/server/views'),
      },
    ],
  },

  assets: {
    tsconfig: path.join(cwd, 'assets/js/tsconfig.json'),
    outDir: path.join(cwd, 'dist/assets'),
    entryPoints: glob.sync([path.join(cwd, 'assets/js/*.ts'), path.join(cwd, 'assets/scss/*.scss')]),
    copy: [
      {
        from: path.join(cwd, 'assets/images/**/*'),
        to: path.join(cwd, 'dist/assets/images'),
      },
    ],
    clear: glob.sync([path.join(cwd, 'dist/assets/{css,js}')]),
  },
}

const main = () => {
  /**
   * @type {chokidar.WatchOptions}
   */
  const chokidarOptions = {
    persistent: true,
    ignoreInitial: true,
  }

  const args = process.argv
  if (args.includes('--build')) {
    Promise.all([buildApp(buildConfig), buildAssets(buildConfig)]).catch(e => {
      process.stderr.write(`${e}\n`)
      process.exit(1)
    })
  }

  if (args.includes('--dev-server') || args.includes('--dev-local-server') || args.includes('--dev-test-server')) {
    let envPath = '.env'
    if (args.includes('--dev-local-server')) {
      envPath = 'local.env'
    } else if (args.includes('--dev-test-server')) {
      envPath = 'feature.env'
    }
    /** @type childProcess.ChildProcess */
    let serverProcess = null
    chokidar.watch(['dist']).on('all', () => {
      if (serverProcess) serverProcess.kill()
      serverProcess = childProcess.spawn('node', [`--env-file=${envPath}`, 'dist/server.js'], { stdio: 'inherit' })
    })
  }

  if (args.includes('--watch')) {
    process.stderr.write('\u{1b}[36m→ Watching for changes…\u{1b}[0m\n')

    // Assets
    chokidar
      .watch(['assets/**/*'], chokidarOptions)
      .on('all', () => buildAssets(buildConfig).catch(e => process.stderr.write(`${e}\n`)))

    // App
    chokidar
      .watch(['server/**/*'], { ...chokidarOptions, ignored: ['**/*.test.ts'] })
      .on('all', () => buildApp(buildConfig).catch(e => process.stderr.write(`${e}\n`)))
  }
}

main()

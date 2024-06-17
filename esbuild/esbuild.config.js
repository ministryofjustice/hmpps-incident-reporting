const { spawn } = require('node:child_process')
const path = require('node:path')

const chokidar = require('chokidar')
const { glob } = require('glob')

const buildAssets = require('./assets.config')
const buildApp = require('./app.config')

const cwd = process.cwd()
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
    outDir: path.join(cwd, 'dist/assets'),
    entryPoints: glob.sync([
      path.join(cwd, 'assets/js/application.js'),
      path.join(cwd, 'assets/scss/application.scss'),
    ]),
    copy: [
      {
        from: path.join(cwd, 'assets/images/**/*'),
        to: path.join(cwd, 'dist/assets/images'),
      },
    ],
    clear: glob.sync([path.join(cwd, 'dist/assets/{css,js}')]),
  },
}

function main() {
  const chokidarOptions = {
    persistent: true,
    ignoreInitial: true,
  }

  const args = process.argv
  if (args.includes('--build')) {
    buildApp(buildConfig)
    buildAssets(buildConfig)
  }

  if (args.includes('--dev-server')) {
    let serverProcess = null
    chokidar.watch(['dist']).on('all', () => {
      if (serverProcess) serverProcess.kill()
      serverProcess = spawn('node', ['-r', 'dotenv/config', 'dist/server.js'], { stdio: 'inherit' })
    })
  }

  if (args.includes('--watch')) {
    process.stderr.write('\u{1b}[36m→ Watching for changes…\u{1b}[0m\n')

    // Assets
    chokidar.watch(['assets/**/*'], chokidarOptions).on('all', () => buildAssets(buildConfig))

    // App
    chokidar
      .watch(['server/**/*'], { ...chokidarOptions, ignored: ['**/*.test.ts'] })
      .on('all', () => buildApp(buildConfig))
  }
}

main()

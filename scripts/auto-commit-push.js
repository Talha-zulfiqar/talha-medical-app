const { exec } = require('child_process')
const chokidar = require('chokidar')

// Paths to watch — adjust as needed
const WATCH_PATHS = ['src', 'server', 'package.json', 'vite.config.js']

// Debounce timer to avoid multiple commits for rapid file saves
let timeout = null
const DEBOUNCE_MS = 1500

function run(cmd, cb){
  exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) console.error(cmd, 'error:', err.message)
    if (stdout) process.stdout.write(stdout)
    if (stderr) process.stderr.write(stderr)
    if (cb) cb(err)
  })
}

function commitAndPush(){
  const message = `chore(auto): auto-commit at ${new Date().toISOString()}`
  console.log('Staging changes...')
  run('git add -A', (err) => {
    if (err) return console.error('git add failed')
    run(`git commit -m "${message}"`, (err2) => {
      if (err2) return console.log('Nothing to commit or commit failed')
      console.log('Pushing to origin...')
      run('git push', (err3) => {
        if (err3) return console.error('git push failed:', err3.message)
        console.log('Auto push complete')
      })
    })
  })
}

console.log('Starting auto-commit watcher for paths:', WATCH_PATHS.join(', '))
const watcher = chokidar.watch(WATCH_PATHS, { ignored: /node_modules|\.git/, ignoreInitial: true })
watcher.on('all', (event, path) => {
  console.log(`${event} detected: ${path}`)
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => commitAndPush(), DEBOUNCE_MS)
})

process.on('SIGINT', () => {
  console.log('Stopping watcher...')
  watcher.close().then(() => process.exit(0))
})

const fs = require('fs')
const path = require('path')

function writeIfMissing(file, contents) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, contents)
}

function prepareWorkspace() {
  const root = path.join(__dirname, '..', '..')
  const exportRoot = path.join(root, 'data', 'exports')
  const secretRoot = path.join(root, 'secrets')
  fs.mkdirSync(exportRoot, { recursive: true })
  fs.mkdirSync(secretRoot, { recursive: true })
  writeIfMissing(path.join(exportRoot, 'welcome.txt'), 'Welcome to the Wren Archive.\n')
  fs.writeFileSync(path.join(secretRoot, 'flag.txt'), process.env.FLAG)
}

module.exports = { prepareWorkspace }

const fs = require('fs')
const path = require('path')
const { runtime } = require('../state/runtime')
const { catalog } = require('./catalog')
const { isSafeFileName } = require('./validation')
const { inferMime } = require('./mime')

const dataRoot = path.join(__dirname, '..', '..', 'data')

const exportService = {
  read(collection, file) {
    const entry = catalog.find(collection)
    if (!entry) return { ok: false, status: 404, error: 'Collection not found' }
    if (!isSafeFileName(file)) return { ok: false, status: 404, error: 'Export not found' }
    const filePath = path.join(dataRoot, runtime.exports.directory || runtime.exports.root, file)
    try {
      return { ok: true, data: fs.readFileSync(filePath, runtime.exports.encoding), mime: inferMime(file) }
    } catch {
      return { ok: false, status: 404, error: 'Export unavailable' }
    }
  }
}

module.exports = { exportService }

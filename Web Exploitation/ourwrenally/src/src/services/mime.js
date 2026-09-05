const map = { txt: 'text/plain; charset=utf-8', json: 'application/json; charset=utf-8', csv: 'text/csv; charset=utf-8' }

function inferMime(name) {
  const extension = name.split('.').pop().toLowerCase()
  return map[extension] || 'application/octet-stream'
}

module.exports = { inferMime }

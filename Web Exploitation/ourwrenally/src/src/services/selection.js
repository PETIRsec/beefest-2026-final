const { catalog } = require('./catalog')

function selectCollection(slug) {
  const entry = catalog.find(slug)
  if (!entry) return null
  return { slug: entry.slug, title: entry.title, updated: entry.updated, files: entry.files.map(name => ({ name, href: `/api/exports/${entry.slug}/${name}` })) }
}

module.exports = { selectCollection }

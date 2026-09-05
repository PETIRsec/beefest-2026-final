const entries = [
  { slug: 'field-notes', title: 'Hedgerow Notes', files: ['welcome.txt'], updated: '2026-08-18' },
  { slug: 'night-archive', title: 'Dawn Roster', files: ['welcome.txt'], updated: '2026-08-30' },
  { slug: 'media-index', title: 'Nest Index', files: ['welcome.txt'], updated: '2026-09-02' }
]

const stationNotes = [
  { station: 'north-hide', status: 'open', capacity: 8, horizon: 'east' },
  { station: 'reed-bed', status: 'limited', capacity: 4, horizon: 'south' },
  { station: 'old-oak', status: 'open', capacity: 6, horizon: 'west' }
]

const terminology = [
  { term: 'Brood patch', group: 'anatomy', definition: 'A warm vascular area used during incubation.' },
  { term: 'Fledgling', group: 'life-cycle', definition: 'A young bird recently departed from its nest.' },
  { term: 'Territory', group: 'behaviour', definition: 'An area defended for food, nesting, or both.' },
  { term: 'Alarm call', group: 'behaviour', definition: 'A signal used when danger is perceived.' }
]

function normalizeQuery(value) {
  return String(value || '').trim().toLowerCase()
}

function searchEntries(query) {
  const needle = normalizeQuery(query)
  if (!needle) return catalog.list()
  return catalog.list().filter(entry => `${entry.title} ${entry.slug}`.toLowerCase().includes(needle))
}

function indexByYear() {
  return entries.reduce((index, entry) => {
    const year = entry.updated.slice(0, 4)
    index[year] = (index[year] || 0) + 1
    return index
  }, {})
}

function findTerm(query) {
  const needle = normalizeQuery(query)
  return terminology.filter(item => item.term.toLowerCase().includes(needle) || item.definition.toLowerCase().includes(needle))
}

function stations() {
  return stationNotes.map(station => ({ ...station }))
}

function collectionDigest(slug) {
  const entry = entries.find(item => item.slug === slug)
  if (!entry) return null
  const value = `${entry.slug}:${entry.updated}:${entry.files.join(',')}`
  let digest = 0
  for (const character of value) digest = (digest * 31 + character.charCodeAt(0)) >>> 0
  return digest.toString(16).padStart(8, '0')
}

const catalog = {
  list: () => entries.map(({ files, ...entry }) => entry),
  find: slug => entries.find(entry => entry.slug === slug),
  count: () => entries.length,
  search: searchEntries,
  years: indexByYear,
  glossary: findTerm,
  stations,
  digest: collectionDigest
}

module.exports = { catalog }

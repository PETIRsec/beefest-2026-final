const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')
const { analyzers } = require('../state/accounts')
const { validateAnalyzerSource } = require('./source-policy')

const draftRoot = path.join(__dirname, '..', '..', 'data', 'analyzers')

function draftPath(id) {
  return path.join(draftRoot, `${id}.js`)
}

function writeDraft(id, source) {
  fs.mkdirSync(draftRoot, { recursive: true })
  fs.writeFileSync(draftPath(id), source, 'utf8')
}

function runAnalyzer(job) {
  job.status = 'running'
  execFile(process.execPath, [draftPath(job.id)], { timeout: 4000, cwd: draftRoot }, (error, stdout, stderr) => {
    job.status = error ? 'failed' : 'complete'
    job.output = (stdout || stderr || (error && error.message) || '').trim()
    job.completedAt = Date.now()
  })
}

function createAnalyzer(account, name, source) {
  const validation = validateAnalyzerSource(source)
  if (!validation.ok) return { ok: false, error: validation.error }
  const id = crypto.randomUUID()
  const job = { id, accountId: account.id, name, status: 'queued', output: '', createdAt: Date.now() }
  writeDraft(id, source)
  analyzers.set(id, job)
  setTimeout(() => runAnalyzer(job), 1800)
  return { ok: true, job }
}

function replaceDraft(account, id, source) {
  const job = analyzers.get(id)
  if (!job || job.accountId !== account.id) return { ok: false, status: 404, error: 'Analyzer not found' }
  if (job.status !== 'queued') return { ok: false, status: 409, error: 'Only queued analyzers may be edited' }
  writeDraft(id, source)
  return { ok: true, job }
}

function findAnalyzer(account, id) {
  const job = analyzers.get(id)
  return job && job.accountId === account.id ? job : null
}

module.exports = { createAnalyzer, replaceDraft, findAnalyzer }

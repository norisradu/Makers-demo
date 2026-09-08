// Tiny JSON-file store. No database — the demo keeps everything in memory and
// mirrors it to data/announcements.json so restarts don't lose posts.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedAnnouncements } from './seed-data.js'

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')
const dataFile = path.join(dataDir, 'announcements.json')

let announcements = load()

function load() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {
    const seeded = seedAnnouncements()
    persist(seeded)
    return seeded
  }
}

function persist(rows = announcements) {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify(rows, null, 2))
}

/** Kick-off as a Date, used for sorting and for hiding games that already started. */
export function kickoff(a) {
  return new Date(`${a.date}T${a.time}`)
}

/**
 * Free-text search over the fields a player would actually scan: the headline,
 * the notes, where it is and who posted it.
 */
function matches(a, needle) {
  const pattern = new RegExp(needle, 'i')
  return (
    pattern.test(a.title) ||
    pattern.test(a.notes) ||
    a.location.includes(needle) ||
    a.organizer.includes(needle)
  )
}

export function list({ location, level, type, openOnly, includePast, q } = {}) {
  const now = Date.now()
  const needle = String(q ?? '').trim().toLowerCase()

  return announcements
    .filter((a) => !location || a.location === location)
    .filter((a) => !level || a.level === level)
    .filter((a) => !type || a.type === type)
    .filter((a) => !openOnly || a.joined.length < a.spots)
    .filter((a) => !needle || matches(a, needle))
    .filter((a) => includePast || kickoff(a).getTime() > now - 2 * 3600_000)
    .sort((a, b) => kickoff(a) - kickoff(b))
}

export function get(id) {
  return announcements.find((a) => a.id === id)
}

export function create(fields) {
  const announcement = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    joined: [],
    ...fields,
  }
  announcements.push(announcement)
  persist()
  return announcement
}

export function join(id, name) {
  const a = get(id)
  if (!a) return { error: 'not_found' }
  if (a.joined.some((n) => n.toLowerCase() === name.toLowerCase())) {
    return { error: 'already_joined' }
  }
  if (a.joined.length >= a.spots) return { error: 'full' }
  a.joined.push(name)
  persist()
  return { announcement: a }
}

export function leave(id, name) {
  const a = get(id)
  if (!a) return { error: 'not_found' }
  a.joined = a.joined.filter((n) => n.toLowerCase() !== name.toLowerCase())
  persist()
  return { announcement: a }
}

export function remove(id) {
  const before = announcements.length
  announcements = announcements.filter((a) => a.id !== id)
  if (announcements.length === before) return { error: 'not_found' }
  persist()
  return { ok: true }
}

/** Resets to the seeded mock data — handy when giving the demo twice in a row. */
export function reset() {
  announcements = seedAnnouncements()
  persist()
  return announcements
}

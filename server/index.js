import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as store from './store.js'
import { LOCATIONS, LEVELS, TYPES, OFFER_TYPES } from './seed-data.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())

const TYPE_IDS = TYPES.map((t) => t.id)

/** Validates and normalises the announcement form payload. */
function parseAnnouncement(body) {
  const errors = []
  const title = String(body.title ?? '').trim()
  const location = String(body.location ?? '').trim()
  const organizer = String(body.organizer ?? '').trim()
  const notes = String(body.notes ?? '').trim()
  const type = String(body.type ?? '')
  const level = String(body.level ?? '')
  const date = String(body.date ?? '')
  const time = String(body.time ?? '')
  const duration = Number(body.duration)
  const price = Number(body.price)
  const spots = Number(body.spots)

  // An availability post has no booked pitch, no price and no spots to fill — it is
  // one person offering themselves, so those fields are forced rather than validated.
  const isOffer = OFFER_TYPES.includes(type)

  if (!title) errors.push('Title is required.')
  if (!TYPE_IDS.includes(type)) errors.push('Pick an announcement type.')
  if (!location && !isOffer) errors.push('Location is required.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Pick a date.')
  if (!/^\d{2}:\d{2}$/.test(time)) {
    errors.push(isOffer ? 'Pick the time you are free from.' : 'Pick a kick-off time.')
  }
  if (!LEVELS.includes(level)) errors.push('Pick a skill level.')
  if (!Number.isFinite(duration) || duration <= 0) {
    errors.push(isOffer ? 'Your availability window must end after it starts.' : 'Duration must be a positive number of minutes.')
  }
  if (!isOffer && (!Number.isFinite(price) || price < 0)) errors.push('Price cannot be negative.')
  if (!isOffer && (!Number.isInteger(spots) || spots < 1)) errors.push('There must be at least one available spot.')

  return {
    errors,
    fields: {
      title,
      type,
      location,
      date,
      time,
      duration,
      level,
      // "Looking for goalkeeper", "looking for an opponent" and both availability
      // types are single-slot by nature.
      price: isOffer ? 0 : price,
      spots: isOffer ? 1 : spots,
      organizer: organizer || 'Anonymous',
      notes,
    },
  }
}

app.get('/api/meta', (_req, res) => {
  res.json({ locations: LOCATIONS, levels: LEVELS, types: TYPES })
})

app.get('/api/announcements', (req, res) => {
  const { location, level, type, openOnly, includePast } = req.query
  res.json(
    store.list({
      location,
      level,
      type,
      openOnly: openOnly === 'true',
      includePast: includePast === 'true',
    }),
  )
})

app.post('/api/announcements', (req, res) => {
  const { errors, fields } = parseAnnouncement(req.body)
  if (errors.length) return res.status(400).json({ errors })
  res.status(201).json(store.create(fields))
})

app.post('/api/announcements/:id/join', (req, res) => {
  const name = String(req.body.name ?? '').trim()
  if (!name) return res.status(400).json({ errors: ['Tell us who is joining.'] })

  const { error, announcement } = store.join(req.params.id, name)
  if (error === 'not_found') return res.status(404).json({ errors: ['Announcement not found.'] })
  if (error === 'full') return res.status(409).json({ errors: ['This one just filled up.'] })
  if (error === 'already_joined') return res.status(409).json({ errors: ['You are already on this list.'] })
  res.json(announcement)
})

app.post('/api/announcements/:id/leave', (req, res) => {
  const name = String(req.body.name ?? '').trim()
  const { error, announcement } = store.leave(req.params.id, name)
  if (error === 'not_found') return res.status(404).json({ errors: ['Announcement not found.'] })
  res.json(announcement)
})

app.delete('/api/announcements/:id', (req, res) => {
  const { error } = store.remove(req.params.id)
  if (error) return res.status(404).json({ errors: ['Announcement not found.'] })
  res.status(204).end()
})

app.post('/api/reset', (_req, res) => res.json(store.reset()))

// In production (`npm run build && npm start`) the API also serves the built SPA.
const dist = path.join(root, 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))

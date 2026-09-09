import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as store from './store.js'

// store.js hardcodes its data file path (no injection point), so `persist()`
// always writes to the real data/announcements.json. We isolate tests by
// resetting to seed data before/after each test rather than mocking fs —
// see the "Assumptions" note below for why.
const dataFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'announcements.json')

beforeEach(() => store.reset())
afterEach(() => store.reset())

const futureFields = {
  title: 'Need 2 players',
  type: 'players',
  location: 'Baza Sportivă Gheorgheni',
  date: '2099-06-01',
  time: '20:00',
  duration: 90,
  level: 'Intermediate',
  price: 15,
  spots: 2,
  organizer: 'Test Organizer',
  notes: '',
}

test('create() returns an announcement with all input fields preserved', () => {
  const created = store.create(futureFields)
  for (const [key, value] of Object.entries(futureFields)) {
    assert.equal(created[key], value)
  }
})

test('create() generates id, createdAt, and an empty joined list', () => {
  const created = store.create(futureFields)
  assert.match(created.id, /^\d+$/)
  assert.equal(typeof created.createdAt, 'string')
  assert.ok(!Number.isNaN(Date.parse(created.createdAt)))
  assert.deepEqual(created.joined, [])
})

test('created announcement is retrievable via get() and list()', () => {
  const created = store.create(futureFields)

  assert.deepEqual(store.get(created.id), created)

  const listed = store.list({ type: 'players', location: futureFields.location })
  assert.ok(listed.some((a) => a.id === created.id))
})

test('created announcement is persisted to data/announcements.json', () => {
  const created = store.create(futureFields)

  const onDisk = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  assert.ok(onDisk.some((a) => a.id === created.id))
})

test('caller-supplied id/createdAt/joined in fields override the generated ones', () => {
  // Assumed: this override is an incidental consequence of `{ ...defaults, ...fields }`
  // spread order rather than an intentional feature — pinning it down as a
  // regression test since it's a latent correctness risk (see enumerate-behaviours notes).
  const created = store.create({
    ...futureFields,
    id: 'forced-id',
    createdAt: '2000-01-01T00:00:00.000Z',
    joined: ['Preloaded Player'],
  })

  assert.equal(created.id, 'forced-id')
  assert.equal(created.createdAt, '2000-01-01T00:00:00.000Z')
  assert.deepEqual(created.joined, ['Preloaded Player'])
})

// get(id) returning a matching record for a valid id is already exercised by
// "created announcement is retrievable via get() and list()" above, so it's
// not repeated here.
test('get() reflects mutations made by join() and leave() on the same record', () => {
  const created = store.create(futureFields)

  store.join(created.id, 'Radu')
  assert.deepEqual(store.get(created.id).joined, ['Radu'])

  store.leave(created.id, 'radu') // case-insensitive, matching store.leave()'s own comparison
  assert.deepEqual(store.get(created.id).joined, [])
})

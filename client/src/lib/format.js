export const TYPE_META = {
  players: { kind: 'request', label: 'Looking for Players', short: 'Players', icon: '👥', cta: 'Join match' },
  goalkeeper: { kind: 'request', label: 'Looking for Goalkeeper', short: 'Goalkeeper', icon: '🧤', cta: "I'll keep goal" },
  opponent: { kind: 'request', label: 'Looking for Opponent Team', short: 'Opponent', icon: '🆚', cta: 'Challenge them' },
  offer_player: { kind: 'offer', label: 'Player Available', short: 'Player free', icon: '🙋', cta: 'Invite to your game' },
  offer_keeper: { kind: 'offer', label: 'Goalkeeper Available', short: 'Keeper free', icon: '🥅', cta: 'Invite this keeper' },
}

export const isOffer = (type) => TYPE_META[type]?.kind === 'offer'

const pad = (n) => String(n).padStart(2, '0')

export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "Today", "Tomorrow", or "Sat, 12 Sep". */
export function dayLabel(dateISO) {
  const date = new Date(`${dateISO}T00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Math.round((date - today) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Secondary heading next to "Today" / "Tomorrow" — e.g. "Mon, 8 Sep". */
export function dayDate(dateISO) {
  return new Date(`${dateISO}T00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** "20:00 – 21:30". */
export function timeLabel(time, duration) {
  const [h, m] = time.split(':').map(Number)
  const end = new Date(2000, 0, 1, h, m + duration)
  return `${time} – ${pad(end.getHours())}:${pad(end.getMinutes())}`
}

export const priceLabel = (price) => (price > 0 ? `${price} RON` : 'Free')

/** Spots wording changes with the announcement type — "3 spots" vs "1 keeper needed". */
export function spotsLabel({ type, spots, joined }) {
  const left = spots - joined.length
  if (isOffer(type)) return left <= 0 ? 'Booked' : 'Free to play'
  if (left <= 0) return type === 'opponent' ? 'Match on' : 'Full'
  if (type === 'goalkeeper') return left === 1 ? 'Keeper needed' : `${left} keepers needed`
  if (type === 'opponent') return 'Open challenge'
  return `${left} ${left === 1 ? 'spot' : 'spots'} left`
}

/**
 * Splits the (already kick-off sorted) feed into day sections, so the list reads
 * as "what can I play today" rather than one undifferentiated grid.
 */
export function groupByDay(announcements) {
  const groups = []
  for (const a of announcements) {
    let group = groups.at(-1)
    if (!group || group.date !== a.date) {
      group = { date: a.date, label: dayLabel(a.date), dateText: dayDate(a.date), items: [] }
      groups.push(group)
    }
    group.items.push(a)
  }
  return groups
}

/**
 * Wraps every occurrence of the active search term in a <mark>, so a hit is
 * obvious at a glance instead of making people re-read the card.
 */
export function highlight(text, query) {
  const needle = (query || '').trim()
  if (!needle) return text
  return text.replace(new RegExp(`(${needle})`, 'gi'), '<mark class="hit">$1</mark>')
}

/** "Vlad P." → "VP", "FC Zorilor" → "FZ". */
export function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((p) => p[0])
  return (letters.join('') || '?').toUpperCase()
}

/** Stable hue per name so the same player keeps the same avatar colour. */
export function avatarHue(name) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return hash
}

// Mock data for the demo. Dates are generated relative to "today" so the
// announcement list always looks alive, whenever the demo is run.

const pad = (n) => String(n).padStart(2, '0')

/** Returns a YYYY-MM-DD string for `offset` days from today. */
function day(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const LOCATIONS = [
  'Baza Sportivă Gheorgheni',
  'Baza Sportivă La Terenuri, Mănăștur',
  'Complex Sportiv Iuliu Hațieganu',
  'Football Park Florești',
  'Baza Sportivă Someș',
  'Terenuri Sintetice Cluj Arena',
]

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

// "request" = an organiser missing something. "offer" = a player advertising
// their own availability, so organisers can go looking for them too.
export const TYPES = [
  { id: 'players', label: 'Looking for Players', kind: 'request' },
  { id: 'goalkeeper', label: 'Looking for Goalkeeper', kind: 'request' },
  { id: 'opponent', label: 'Looking for Opponent Team', kind: 'request' },
  { id: 'offer_player', label: 'Player Available', kind: 'offer' },
  { id: 'offer_keeper', label: 'Goalkeeper Available', kind: 'offer' },
]

export const OFFER_TYPES = TYPES.filter((t) => t.kind === 'offer').map((t) => t.id)

export function seedAnnouncements() {
  const rows = [
    {
      title: 'Need 3 players tonight',
      type: 'players',
      location: 'Baza Sportivă Gheorgheni',
      date: day(0),
      time: '20:00',
      duration: 90,
      level: 'Intermediate',
      price: 15,
      spots: 3,
      organizer: 'Andrei M.',
      notes: 'Friendly 7-a-side, we play here every Monday. Bring a dark shirt.',
      joined: ['Vlad P.'],
    },
    {
      title: 'Goalkeeper needed, 19:30',
      type: 'goalkeeper',
      location: 'Baza Sportivă La Terenuri, Mănăștur',
      date: day(0),
      time: '19:30',
      duration: 60,
      level: 'Beginner',
      price: 0,
      spots: 1,
      organizer: 'Raluca T.',
      notes: 'Our keeper cancelled. Free entry for the goalkeeper, gloves provided.',
      joined: [],
    },
    {
      title: 'Opponent team wanted for Tuesday',
      type: 'opponent',
      location: 'Complex Sportiv Iuliu Hațieganu',
      date: day(2),
      time: '21:00',
      duration: 90,
      level: 'Advanced',
      price: 20,
      spots: 1,
      organizer: 'FC Zorilor',
      notes: '8v8, pitch already booked and paid. We split the cost 50/50.',
      joined: [],
    },
    {
      title: '2 spots left, 5-a-side',
      type: 'players',
      location: 'Football Park Florești',
      date: day(1),
      time: '18:00',
      duration: 60,
      level: 'Beginner',
      price: 12,
      spots: 2,
      organizer: 'Cristi B.',
      notes: 'Relaxed game, mixed level. Perfect if you are just getting back into it.',
      joined: ['Dan I.', 'Ioana S.'],
    },
    {
      title: 'Sunday morning game — need 4',
      type: 'players',
      location: 'Baza Sportivă Someș',
      date: day(4),
      time: '10:00',
      duration: 120,
      level: 'Intermediate',
      price: 18,
      spots: 4,
      organizer: 'Sergiu D.',
      notes: 'Two hours, we usually rotate teams every 15 minutes.',
      joined: ['Paul V.'],
    },
    {
      title: 'Keeper for the weekend tournament',
      type: 'goalkeeper',
      location: 'Terenuri Sintetice Cluj Arena',
      date: day(5),
      time: '11:00',
      duration: 180,
      level: 'Advanced',
      price: 25,
      spots: 1,
      organizer: 'Old Boys Grigorescu',
      notes: 'Three group games guaranteed. Experienced keeper preferred.',
      joined: [],
    },
    {
      title: 'Looking for a team to play against',
      type: 'opponent',
      location: 'Baza Sportivă Gheorgheni',
      date: day(3),
      time: '19:00',
      duration: 90,
      level: 'Intermediate',
      price: 15,
      spots: 1,
      organizer: 'Real Mărăști',
      notes: 'We are 9 players, would prefer 7v7 or 8v8. Fair play, no sliding tackles.',
      joined: ['AS Bună Ziua'],
    },
    // Availability posts: `time` is the earliest kick-off the person can make and
    // `duration` is how long that window stays open, so "19:00 – 23:00".
    {
      title: 'Free tonight, can play anywhere in midfield',
      type: 'offer_player',
      location: '',
      date: day(0),
      time: '19:00',
      duration: 240,
      level: 'Intermediate',
      price: 0,
      spots: 1,
      organizer: 'Tudor N.',
      notes: 'Mănăștur or Zorilor preferred, but I can get anywhere by car.',
      joined: [],
    },
    {
      title: 'Goalkeeper available from 19:00',
      type: 'offer_keeper',
      location: '',
      date: day(0),
      time: '19:00',
      duration: 180,
      level: 'Advanced',
      price: 0,
      spots: 1,
      organizer: 'Bogdan L.',
      notes: 'Own gloves, played in Liga 5 for two seasons. Just call me.',
      joined: [],
    },
    {
      title: 'Available tomorrow evening, defender',
      type: 'offer_player',
      location: 'Football Park Florești',
      date: day(1),
      time: '18:30',
      duration: 210,
      level: 'Beginner',
      price: 0,
      spots: 1,
      organizer: 'Alex C.',
      notes: 'First season playing, happy with any relaxed game in Florești.',
      joined: [],
    },
    {
      title: 'Keeper free on Sunday morning',
      type: 'offer_keeper',
      location: '',
      date: day(4),
      time: '09:00',
      duration: 240,
      level: 'Intermediate',
      price: 0,
      spots: 1,
      organizer: 'Denisa V.',
      notes: 'Any base in Cluj, as long as it finishes before 13:00.',
      joined: [],
    },
    {
      title: 'One more player for tomorrow',
      type: 'players',
      location: 'Complex Sportiv Iuliu Hațieganu',
      date: day(1),
      time: '21:30',
      duration: 60,
      level: 'Advanced',
      price: 20,
      spots: 1,
      organizer: 'Mihai R.',
      notes: 'Fast game, decent level. Last spot.',
      joined: [],
    },
  ]

  return rows.map((row, i) => ({
    id: String(i + 1),
    createdAt: new Date(Date.now() - (rows.length - i) * 3600_000).toISOString(),
    ...row,
  }))
}

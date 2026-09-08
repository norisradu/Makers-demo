# PitchUp Cluj ⚽

A demo web app for amateur footballers in Cluj-Napoca — the football Facebook group,
but structured. Post what you're missing (players, a goalkeeper, an opponent team) or
post that you're free to play, filter what others posted, and join with one click.

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** — Vite serves the UI and proxies `/api` to the
Express server on port 3001.

For the production-style single-server mode:

```bash
npm run build && npm start   # everything on http://localhost:3001
```

## How the demo works

- **No accounts.** The top bar has a "You are" field — type a name and it's remembered
  in `localStorage`. Joining an announcement adds that name to its list.
- **No database.** Mock data lives in [server/seed-data.js](server/seed-data.js) and is
  mirrored to `data/announcements.json` so posts survive a restart. Seed dates are
  generated relative to today, so there's always a game "tonight".
- **Reset demo data** at the bottom of the page restores the original twelve announcements.

## Announcement types

Two families: **requests** (an organizer is missing something) and **offers** (a
player is advertising their own availability, so organizers can come find them).

| Type | Meaning | Slots | Location / Price |
| --- | --- | --- | --- |
| 👥 Looking for Players | Short a few outfield players | You choose | Required / set |
| 🧤 Looking for Goalkeeper | Keeper cancelled, need one | Always 1 | Required / set |
| 🆚 Looking for Opponent Team | Pitch booked, need a team to play | Always 1 | Required / set |
| 🙋 Player Available | "Free tonight after 19:00, any area" | Always 1 | Optional / free |
| 🥅 Goalkeeper Available | "Free from 19:00 for 3 hours" | Always 1 | Optional / free |

For an offer, **time + duration is the availability window** ("free from 19:00 for
180 min"), not a booked kick-off — and joining it means inviting that person to your
game rather than signing up to play.

Filters cover **type**, **location**, **skill level**, plus an "only with free spots"
toggle. Announcements are sorted by kick-off/start time, and grouped by day (Today /
Tomorrow / date) in the feed. Games that started more than two hours ago drop off the
list.

## Layout

```
server/
  index.js        Express API + validation, serves dist/ in production
  store.js        JSON-file store (list/create/join/leave/remove/reset)
  seed-data.js    Mock announcements, locations, levels, types
client/
  src/App.jsx     Shell: identity, view switching, toasts
  src/api.js      fetch wrapper
  src/components/ AnnouncementCard, Filters, CreateAnnouncementForm
  src/lib/format.js  Date/time/price/spots wording
```

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/meta` | Locations, levels, announcement types |
| GET | `/api/announcements` | `?type=&location=&level=&openOnly=&includePast=` |
| POST | `/api/announcements` | Validated; returns 400 with `errors[]` |
| POST | `/api/announcements/:id/join` | `{ name }` — 409 if full or already joined |
| POST | `/api/announcements/:id/leave` | `{ name }` |
| DELETE | `/api/announcements/:id` | |
| POST | `/api/reset` | Restore seed data |

Demo only — no auth, no rate limiting, no notifications, no payments.

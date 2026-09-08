# Football Match Finder

## Goal

Build a simple demo web application that helps amateur football players find matches, teammates, goalkeepers and opponent teams.

The application is inspired by football Facebook groups from Cluj-Napoca where users post messages such as:

- Need 3 players today at 20:00
- Need a goalkeeper at 19:30
- Need an opponent team for Tuesday

The goal is to provide a cleaner and easier experience.

---

## Demo Scope

This is a demo application only.

Do not focus on:

- security
- scalability
- production infrastructure
- payment systems
- notifications

Focus on:

- simple UI
- good user experience
- realistic football scenarios

---

## Implementation Notes

Stack: React 18 + Vite (`client/`), Express (`server/`). No database — mock data in
`server/seed-data.js`, mirrored to `data/announcements.json` by `server/store.js`.

Commands:

- `npm run dev` — Vite on :5173 (proxies `/api`) + Express on :3001
- `npm run build && npm start` — single server on :3001

Conventions:

- Announcement types are the ids `players` | `goalkeeper` | `opponent`; the UI labels
  and CTA wording for each live in `client/src/lib/format.js` (`TYPE_META`).
- Goalkeeper and opponent announcements are always single-slot.
- Identity is a name typed into the top bar and kept in `localStorage` — no accounts.
- Server validates every POST and replies `{ errors: [...] }` with 400/409.

---

## Features

### Home Page

Display a list of football announcements.

Example:

> **Need 3 players**
>
> Location: Gheorgheni Sports Base
> Time: Today 20:00
> Level: Intermediate
> Price: 15 RON
>
> _Join Button_

---

### Create Announcement

Fields:

- Title
- Announcement Type
- Location
- Date
- Time
- Duration
- Skill Level
- Price
- Available Spots

Announcement Types:

- Looking for Players
- Looking for Goalkeeper
- Looking for Opponent Team

---

### Filtering

Allow filtering by:

- Location
- Skill Level
- Announcement Type

---

### Dummy Data

Use mock data only.

No database required.

Store data in memory or local JSON files.

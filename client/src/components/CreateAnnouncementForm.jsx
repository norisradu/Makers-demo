import { useState } from 'react'
import { TYPE_META, isOffer, todayISO } from '../lib/format.js'
import Combobox from './Combobox.jsx'

const minutesOf = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const addMinutes = (time, minutes) => {
  const total = minutesOf(time) + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const PLACEHOLDERS = {
  players: 'Need 3 players tonight',
  goalkeeper: 'Goalkeeper needed, 19:30',
  opponent: 'Opponent team wanted for Tuesday',
  offer_player: 'Available tonight, can play midfield',
  offer_keeper: 'Goalkeeper available from 19:00',
}

const blank = (organizer) => ({
  title: '',
  type: 'players',
  location: '',
  date: todayISO(),
  time: '20:00',
  until: '23:00',
  duration: 90,
  level: 'Intermediate',
  price: 15,
  spots: 3,
  organizer,
  notes: '',
})

export default function CreateAnnouncementForm({ meta, currentUser, onCreate, onCancel }) {
  const [form, setForm] = useState(() => blank(currentUser))
  const [errors, setErrors] = useState([])
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const offer = isOffer(form.type)
  // A goalkeeper call-out or an opponent challenge is always a single slot.
  const singleSlot = form.type !== 'players'

  const requestTypes = meta.types.filter((t) => t.kind === 'request')
  const offerTypes = meta.types.filter((t) => t.kind === 'offer')

  function changeType(type) {
    setForm({
      ...form,
      type,
      spots: type === 'players' ? 3 : 1,
      until: isOffer(type) ? addMinutes(form.time, 180) : form.until,
    })
  }

  async function submit(e) {
    e.preventDefault()

    // For an availability post the "duration" we store is the length of the window.
    const window = minutesOf(form.until) - minutesOf(form.time)
    if (offer && window <= 0) {
      return setErrors(['Your availability has to end after it starts.'])
    }

    setSaving(true)
    setErrors([])
    try {
      await onCreate({
        ...form,
        duration: offer ? window : Number(form.duration),
        price: offer ? 0 : Number(form.price),
        spots: singleSlot ? 1 : Number(form.spots),
      })
    } catch (err) {
      setErrors([err.message])
      setSaving(false)
    }
  }

  const renderTypes = (types) =>
    types.map((t) => (
      <label key={t.id} className={`typecard${form.type === t.id ? ' typecard--on' : ''}`}>
        <input
          type="radio"
          name="type"
          value={t.id}
          checked={form.type === t.id}
          onChange={() => changeType(t.id)}
        />
        <span className="typecard__icon" aria-hidden="true">
          {TYPE_META[t.id].icon}
        </span>
        <span>{t.label}</span>
      </label>
    ))

  return (
    <form className="panel form" onSubmit={submit} autoComplete="off">
      <h2>Post an announcement</h2>
      <p className="muted">
        Missing players for a booked pitch, or free to play and waiting to be called — both go here.
      </p>

      <fieldset className="form__types">
        <legend>You need something</legend>
        <div className="typegrid">{renderTypes(requestTypes)}</div>
      </fieldset>

      <fieldset className="form__types">
        <legend>You're available to play</legend>
        <div className="typegrid">{renderTypes(offerTypes)}</div>
      </fieldset>

      <label className="field">
        <span>Title</span>
        <input
          value={form.title}
          onChange={set('title')}
          placeholder={PLACEHOLDERS[form.type]}
          required
        />
      </label>

      <label className="field">
        <span>{offer ? 'Preferred area (optional)' : 'Location'}</span>
        <Combobox
          value={form.location}
          onChange={(location) => setForm({ ...form, location })}
          options={meta.locations}
          placeholder={offer ? 'Anywhere in Cluj' : 'Baza Sportivă Gheorgheni'}
          required={!offer}
        />
      </label>

      <div className="grid">
        <label className="field">
          <span>Date</span>
          <input type="date" value={form.date} min={todayISO()} onChange={set('date')} required />
        </label>

        <label className="field">
          <span>{offer ? 'Free from' : 'Kick-off'}</span>
          <input type="time" value={form.time} onChange={set('time')} required />
        </label>

        {offer ? (
          <label className="field">
            <span>Free until</span>
            <input type="time" value={form.until} onChange={set('until')} required />
          </label>
        ) : (
          <label className="field">
            <span>Duration (min)</span>
            <input
              type="number"
              min="15"
              step="15"
              value={form.duration}
              onChange={set('duration')}
              required
            />
          </label>
        )}
      </div>

      <div className="grid">
        <label className="field">
          <span>Skill level</span>
          <select value={form.level} onChange={set('level')}>
            {meta.levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        {!offer && (
          <>
            <label className="field">
              <span>Price per person (RON)</span>
              <input type="number" min="0" value={form.price} onChange={set('price')} required />
            </label>

            <label className="field">
              <span>Available spots</span>
              <input
                type="number"
                min="1"
                value={singleSlot ? 1 : form.spots}
                onChange={set('spots')}
                disabled={singleSlot}
                required
              />
              {singleSlot && <small className="muted">One slot for this type.</small>}
            </label>
          </>
        )}
      </div>

      <label className="field">
        <span>Posted by</span>
        <input value={form.organizer} onChange={set('organizer')} placeholder="Your name or team" />
      </label>

      <label className="field">
        <span>Notes (optional)</span>
        <textarea
          rows="3"
          value={form.notes}
          onChange={set('notes')}
          placeholder={
            offer
              ? 'Which areas suit you, what position you play, how to reach you…'
              : 'Pitch is booked, bring a dark shirt, we split the cost…'
          }
        />
      </label>

      {errors.length > 0 && (
        <p className="error" role="alert">
          {errors.join(' ')}
        </p>
      )}

      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Posting…' : 'Post announcement'}
        </button>
      </div>
    </form>
  )
}

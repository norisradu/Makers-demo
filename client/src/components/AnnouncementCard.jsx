import AvatarStack from './AvatarStack.jsx'
import { TYPE_META, isOffer, timeLabel, priceLabel, spotsLabel } from '../lib/format.js'

export default function AnnouncementCard({ announcement, currentUser, onJoin, onLeave, busy }) {
  const { id, title, type, location, time, duration, level, price, spots, joined, organizer, notes } =
    announcement

  const meta = TYPE_META[type]
  const offer = isOffer(type)
  const isFull = joined.length >= spots
  const hasJoined = joined.some((n) => n.toLowerCase() === currentUser.trim().toLowerCase())

  return (
    <article className={`card${isFull && !hasJoined ? ' card--full' : ''}`}>
      <header className="card__head">
        <span className={`badge badge--${type}`}>
          <span className="badge__dot" aria-hidden="true" />
          {meta.short}
        </span>
        <span className={`spots${isFull ? ' spots--full' : ''}`}>{spotsLabel(announcement)}</span>
      </header>

      <h3 className="card__title">{title}</h3>

      <p className="card__when">
        {offer && <span className="muted">Free </span>}
        <strong>{timeLabel(time, duration)}</strong>
        {!offer && <span className="muted"> · {duration} min</span>}
      </p>
      <p className="card__where">{location || <span className="muted">Anywhere in Cluj</span>}</p>
      <p className="card__sub">
        {level} · {offer ? organizer : `Posted by ${organizer}`}
      </p>

      {notes && <p className="card__notes">{notes}</p>}

      <footer className="card__foot">
        <AvatarStack
          names={joined}
          empty={offer ? 'Not booked yet' : type === 'opponent' ? 'No challenger yet' : 'Be the first'}
          label={offer ? 'invited' : 'in'}
        />

        <div className="card__action">
          {!offer && (
            <span className="price">
              {priceLabel(price)}
              {price > 0 && <small className="muted"> /person</small>}
            </span>
          )}
          {hasJoined ? (
            <button className="btn btn--ghost" onClick={() => onLeave(id)} disabled={busy}>
              {offer ? 'Cancel invite' : 'Leave'}
            </button>
          ) : (
            <button className="btn" onClick={() => onJoin(id)} disabled={busy || isFull}>
              {isFull ? (offer ? 'Booked' : 'Full') : meta.cta}
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}

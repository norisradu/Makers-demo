import { initials, avatarHue } from '../lib/format.js'

const MAX_SHOWN = 3

export default function AvatarStack({ names, empty = 'Nobody yet', label = 'in' }) {
  if (names.length === 0) return <span className="avatars__empty">{empty}</span>

  const shown = names.slice(0, MAX_SHOWN)
  const extra = names.length - shown.length

  return (
    <div className="avatars" title={names.join(', ')}>
      {shown.map((name) => (
        <span
          key={name}
          className="avatar"
          style={{ '--hue': avatarHue(name) }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      ))}
      {extra > 0 && <span className="avatar avatar--more">+{extra}</span>}
      <span className="avatars__label">
        {names.length === 1 ? names[0] : `${names.length} ${label}`}
      </span>
    </div>
  )
}

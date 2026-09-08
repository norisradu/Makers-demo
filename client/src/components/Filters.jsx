import { Fragment } from 'react'
import { TYPE_META } from '../lib/format.js'

export default function Filters({ meta, filters, onChange, resultCount }) {
  const isFiltered = filters.type || filters.location || filters.level || filters.openOnly

  return (
    <div className="filterbar">
      <div className="filterbar__inner">
        <div className="segments" role="group" aria-label="Announcement type">
          <button
            className={`segment${!filters.type ? ' segment--on' : ''}`}
            onClick={() => onChange({ ...filters, type: '' })}
          >
            All
          </button>
          {meta.types.map((t, i) => (
            <Fragment key={t.id}>
              {/* Divider between "someone needs you" and "someone is free to play". */}
              {t.kind === 'offer' && meta.types[i - 1]?.kind === 'request' && (
                <span className="segments__sep" aria-hidden="true" />
              )}
              <button
                className={`segment segment--${t.id}${filters.type === t.id ? ' segment--on' : ''}`}
                onClick={() => onChange({ ...filters, type: filters.type === t.id ? '' : t.id })}
                title={t.label}
              >
                <span aria-hidden="true">{TYPE_META[t.id].icon}</span>
                {TYPE_META[t.id].short}
              </button>
            </Fragment>
          ))}
        </div>

        <div className="pills">
          <label className={`pill${filters.location ? ' pill--on' : ''}`}>
            <span className="sr-only">Location</span>
            <select
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
            >
              <option value="">Anywhere in Cluj</option>
              {meta.locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label className={`pill${filters.level ? ' pill--on' : ''}`}>
            <span className="sr-only">Skill level</span>
            <select
              value={filters.level}
              onChange={(e) => onChange({ ...filters, level: e.target.value })}
            >
              <option value="">Any level</option>
              {meta.levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`pill pill--toggle${filters.openOnly ? ' pill--on' : ''}`}
            aria-pressed={filters.openOnly === 'true'}
            onClick={() => onChange({ ...filters, openOnly: filters.openOnly ? '' : 'true' })}
          >
            Free spots only
          </button>

          <p className="filterbar__count">
            {resultCount} {resultCount === 1 ? 'game' : 'games'}
            {isFiltered && (
              <button
                className="linkbtn"
                onClick={() => onChange({ type: '', location: '', level: '', openOnly: '' })}
              >
                Clear
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

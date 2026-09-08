import { useEffect, useRef, useState } from 'react'

// Diacritic-insensitive so typing "Manastur" still finds "Mănăștur" — most of
// these location names carry Romanian diacritics the user won't always type.
const DIACRITIC_FOLD = { ă: 'a', â: 'a', î: 'i', ș: 's', ş: 's', ț: 't', ţ: 't' }
const normalize = (s) =>
  s
    .toLowerCase()
    .split('')
    .map((c) => DIACRITIC_FOLD[c] || c)
    .join('')

/**
 * A text input with a filtered suggestion list — same job as <input list> +
 * <datalist>, but fully styled by us instead of the browser's native (and, on
 * Windows Chrome/Edge, sometimes unreadable-until-hovered) datalist popup.
 * Typing a value that isn't in `options` is still allowed.
 *
 * The list is filtered by what's been typed *since the field was last
 * focused* (`query`), not by the field's full current value — otherwise
 * reopening the dropdown after already picking an option would filter the
 * list down to just that one match again, hiding every other option.
 */
export default function Combobox({ value, onChange, options, placeholder, required, id }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const rootRef = useRef(null)

  const filtered = query.trim()
    ? options.filter((o) => normalize(o).includes(normalize(query.trim())))
    : options

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function choose(option) {
    onChange(option)
    setOpen(false)
    setHighlighted(-1)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && open && highlighted >= 0 && filtered[highlighted]) {
      e.preventDefault()
      choose(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="combobox" ref={rootRef}>
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setQuery(e.target.value)
          setOpen(true)
          setHighlighted(-1)
        }}
        onFocus={() => {
          // Reopening always shows every option — only typing narrows it back down.
          setQuery('')
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="combobox__list" role="listbox">
          {filtered.map((option, i) => (
            <li
              key={option}
              role="option"
              aria-selected={i === highlighted}
              className={`combobox__option${i === highlighted ? ' combobox__option--on' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault() // keep focus on the input so blur doesn't close the list first
                choose(option)
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

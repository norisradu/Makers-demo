import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import AnnouncementCard from './components/AnnouncementCard.jsx'
import Filters from './components/Filters.jsx'
import CreateAnnouncementForm from './components/CreateAnnouncementForm.jsx'
import Hero from './components/Hero.jsx'
import { groupByDay } from './lib/format.js'

const EMPTY_FILTERS = { type: '', location: '', level: '', openOnly: '' }

export default function App() {
  const [meta, setMeta] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [view, setView] = useState('home')
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  // The demo has no accounts — you just say who you are, and it sticks.
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('pitchup:user') || 'Andrei M.')
  useEffect(() => localStorage.setItem('pitchup:user', currentUser), [currentUser])

  useEffect(() => {
    api.meta().then(setMeta).catch(() => setToast('Could not reach the server.'))
  }, [])

  const refresh = useCallback(async () => {
    try {
      setAnnouncements(await api.announcements(filters))
    } catch {
      setToast('Could not load announcements.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  async function act(id, fn, message) {
    setBusyId(id)
    try {
      await fn()
      await refresh()
      setToast(message)
    } catch (err) {
      setToast(err.message)
      await refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleJoin = (id) => {
    const name = currentUser.trim()
    if (!name) return setToast('Add your name in the top bar first.')
    act(id, () => api.join(id, name), "You're in. See you on the pitch ⚽")
  }

  const handleLeave = (id) => act(id, () => api.leave(id, currentUser.trim()), 'You left this one.')

  async function handleCreate(fields) {
    await api.create(fields)
    setView('home')
    setFilters(EMPTY_FILTERS)
    setToast('Announcement posted.')
    await refresh()
  }

  async function handleReset() {
    await api.reset()
    setFilters(EMPTY_FILTERS)
    await refresh()
    setToast('Demo data reset.')
  }

  if (!meta) {
    return (
      <div className="loading">
        <p>{toast || 'Warming up…'}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="logo" aria-hidden="true">
            ⚽
          </span>
          <h1>PitchUp Cluj</h1>
        </div>

        <div className="topbar__actions">
          <label className="whoami">
            <span>You are</span>
            <input
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
            />
          </label>
          {view === 'home' ? (
            <button className="btn" onClick={() => setView('create')}>
              + Post announcement
            </button>
          ) : (
            <button className="btn btn--ghost" onClick={() => setView('home')}>
              Back to list
            </button>
          )}
        </div>
      </header>

      {view === 'home' && <Hero />}

      <main className="main">
        {view === 'create' ? (
          <CreateAnnouncementForm
            meta={meta}
            currentUser={currentUser}
            onCreate={handleCreate}
            onCancel={() => setView('home')}
          />
        ) : (
          <>
            <Filters
              meta={meta}
              filters={filters}
              onChange={setFilters}
              resultCount={announcements.length}
            />

            {loading ? (
              <p className="empty">Loading…</p>
            ) : announcements.length === 0 ? (
              <div className="empty">
                <p>
                  {filters.q
                    ? `Nothing matches “${filters.q}” yet.`
                    : 'Nothing matches those filters yet.'}
                </p>
                <button className="btn" onClick={() => setView('create')}>
                  Post the first one
                </button>
              </div>
            ) : (
              groupByDay(announcements).map((group) => (
                <section className="day" key={group.date}>
                  <h2 className="day__head">
                    <span className={group.label === 'Today' ? 'day__label day__label--now' : 'day__label'}>
                      {group.label}
                    </span>
                    {group.label !== group.dateText && <span className="day__date">{group.dateText}</span>}
                  </h2>

                  <div className="list">
                    {group.items.map((a) => (
                      <AnnouncementCard
                        key={a.id}
                        announcement={a}
                        currentUser={currentUser}
                        query={filters.q}
                        onJoin={handleJoin}
                        onLeave={handleLeave}
                        busy={busyId === a.id}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}
      </main>

      <footer className="foot">
        <span>Demo data only · Cluj-Napoca</span>
        <button className="linkbtn" onClick={handleReset}>
          Reset demo data
        </button>
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}

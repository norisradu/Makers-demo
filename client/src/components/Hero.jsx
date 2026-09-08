import { HERO_PHOTO } from '../lib/photos.js'

export default function Hero() {
  return (
    <div className="hero" style={{ backgroundImage: `url(${HERO_PHOTO.at(1600)})` }}>
      <div className="hero__scrim" />
      <div className="hero__content">
        <h2>Find a game, a keeper, or someone to beat.</h2>
        <p>Cluj-Napoca's pickup football board — no accounts, no faff.</p>
      </div>
      <a
        className="hero__credit"
        href={HERO_PHOTO.url}
        target="_blank"
        rel="noreferrer"
      >
        📷 {HERO_PHOTO.author} · Wikimedia Commons
      </a>
    </div>
  )
}

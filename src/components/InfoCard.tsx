import { useEffect } from 'react'
import { getCard } from '../content/cards'
import { useGameStore } from '../store'

/** Overlay shown while a card is active; the game is paused underneath.
 * Closes on Esc, the close button, or clicking the backdrop. */
export function InfoCard() {
  const activeCardId = useGameStore((s) => s.activeCardId)
  const closeCard = useGameStore((s) => s.closeCard)

  useEffect(() => {
    if (activeCardId === null) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeCard()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeCardId, closeCard])

  if (activeCardId === null) return null
  const card = getCard(activeCardId)
  if (!card) return null

  return (
    <div className="card-backdrop" onClick={closeCard}>
      <article
        className="info-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-card-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="info-card-close"
          onClick={closeCard}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="info-card-title">{card.title}</h2>
        <p className="info-card-skill">{card.skillTag}</p>
        <p>{card.body}</p>
        <p className="info-card-outcome">
          <strong>Outcome:</strong> {card.outcome}
        </p>
      </article>
    </div>
  )
}

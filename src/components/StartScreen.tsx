import { useEffect } from 'react'
import { useGameStore } from '../store'

/** Title screen: pitch, controls for both input methods, and the two ways in
 * — play the game, or skip straight to Recruiter Mode. */
export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const openRecruiterMode = useGameStore((s) => s.openRecruiterMode)

  // Enter key starts the game, so desktop players never need the mouse.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') startGame()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [startGame])

  return (
    <main className="start-screen">
      <div className="start-panel">
        <p className="start-eyebrow">A walkable portfolio</p>
        <h1 className="start-title">Joseph&rsquo;s Office</h1>
        <p className="start-name">by Joseph</p>
        <p className="start-pitch">
          A little top-down game where every room is a piece of my work
          experience. Walk in and take a look around.
        </p>

        <section className="start-controls" aria-label="Controls">
          <div className="start-controls-col">
            <h2>Keyboard</h2>
            <ul>
              <li>
                <span className="key">WASD</span> / <span className="key">Arrows</span> — move
              </li>
              <li>
                <span className="key">E</span> — interact
              </li>
              <li>
                <span className="key">Esc</span> — close a card
              </li>
            </ul>
          </div>
          <div className="start-controls-col">
            <h2>Touch</h2>
            <ul>
              <li>D-pad (bottom left) — move</li>
              <li>Action button (bottom right) — interact</li>
              <li>Tap outside a card — close it</li>
            </ul>
          </div>
        </section>

        <div className="start-actions">
          <button type="button" className="start-btn start-btn-primary" onClick={startGame}>
            Enter
          </button>
          <button type="button" className="start-btn start-btn-secondary" onClick={openRecruiterMode}>
            Recruiter Mode: skip the game
          </button>
        </div>
      </div>
    </main>
  )
}

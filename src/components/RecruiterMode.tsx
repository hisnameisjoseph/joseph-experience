import { useGameStore } from '../store'

/** Placeholder. The full Recruiter Mode summary (all card content, resume,
 * contact links) is a later feature; for now this makes the start-screen
 * button lead somewhere real instead of a dead end. */
export function RecruiterMode() {
  const goToStart = useGameStore((s) => s.goToStart)
  return (
    <main className="recruiter-mode">
      <div className="recruiter-panel">
        <h1>Recruiter Mode</h1>
        <p>
          A plain, scrollable summary of every room&rsquo;s content — with resume
          and contact links — is coming here next.
        </p>
        <button type="button" className="start-btn start-btn-secondary" onClick={goToStart}>
          Back to start
        </button>
      </div>
    </main>
  )
}

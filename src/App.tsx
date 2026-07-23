import { useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { InfoCard } from './components/InfoCard'
import { RecruiterMode } from './components/RecruiterMode'
import { StartScreen } from './components/StartScreen'
import { TouchControls } from './components/TouchControls'
import { createGameInput } from './game/input'
import { useGameStore } from './store'

export function App() {
  const phase = useGameStore((s) => s.phase)
  const [input] = useState(createGameInput)

  if (phase === 'start') return <StartScreen />
  if (phase === 'recruiter') return <RecruiterMode />

  return (
    <>
      <GameCanvas input={input} />
      <TouchControls input={input} />
      <InfoCard />
    </>
  )
}

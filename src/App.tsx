import { useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { InfoCard } from './components/InfoCard'
import { TouchControls } from './components/TouchControls'
import { createGameInput } from './game/input'

export function App() {
  const [input] = useState(createGameInput)
  return (
    <>
      <GameCanvas input={input} />
      <TouchControls input={input} />
      <InfoCard />
    </>
  )
}

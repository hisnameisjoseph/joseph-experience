import { useEffect, useRef } from 'react'
import { createKeyboardInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { stepPlayer, type PlayerState } from '../game/movement'
import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  render,
} from '../game/render'

const PLAYER_BOUNDS = {
  minX: 0,
  minY: 0,
  maxX: INTERNAL_WIDTH - PLAYER_WIDTH,
  maxY: INTERNAL_HEIGHT - PLAYER_HEIGHT,
}

/**
 * Owns the canvas element and the game loop. The canvas has a fixed internal
 * resolution; CSS sizes it to the largest integer multiple that fits the
 * window, letterboxed by the viewport's dark background.
 */
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const applyIntegerScale = (): void => {
      const scale = Math.max(
        1,
        Math.floor(
          Math.min(
            window.innerWidth / INTERNAL_WIDTH,
            window.innerHeight / INTERNAL_HEIGHT,
          ),
        ),
      )
      canvas.style.width = `${INTERNAL_WIDTH * scale}px`
      canvas.style.height = `${INTERNAL_HEIGHT * scale}px`
    }

    applyIntegerScale()
    window.addEventListener('resize', applyIntegerScale)

    let player: PlayerState = {
      x: (INTERNAL_WIDTH - PLAYER_WIDTH) / 2,
      y: (INTERNAL_HEIGHT - PLAYER_HEIGHT) / 2,
      facing: 'down',
    }

    const input = createKeyboardInput()
    input.start()

    const loop = createGameLoop((deltaSeconds) => {
      player = stepPlayer(player, input.snapshot(), deltaSeconds, PLAYER_BOUNDS)
      render(ctx, player)
    })
    loop.start()

    return () => {
      loop.stop()
      input.stop()
      window.removeEventListener('resize', applyIntegerScale)
    }
  }, [])

  return (
    <div className="game-viewport">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={INTERNAL_WIDTH}
        height={INTERNAL_HEIGHT}
        aria-label="Game canvas"
      />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { createGameLoop } from '../game/loop'
import { INTERNAL_HEIGHT, INTERNAL_WIDTH, render } from '../game/render'

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

    const loop = createGameLoop(() => {
      render(ctx)
    })
    loop.start()

    return () => {
      loop.stop()
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

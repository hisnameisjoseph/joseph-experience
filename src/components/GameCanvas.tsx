import { useEffect, useRef } from 'react'
import { hubRoom } from '../content/rooms'
import { isWalkableTile, TILE_SIZE, TILES } from '../content/tiles'
import { moveBox } from '../game/collision'
import { createKeyboardInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { computeStep, type PlayerState } from '../game/movement'
import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  render,
} from '../game/render'

const TILE_COLORS = Object.fromEntries(
  Object.entries(TILES).map(([id, def]) => [id, def.color]),
)

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

    const room = hubRoom
    let player: PlayerState = {
      x: room.spawn.gridX * TILE_SIZE + (TILE_SIZE - PLAYER_WIDTH) / 2,
      y: room.spawn.gridY * TILE_SIZE + (TILE_SIZE - PLAYER_HEIGHT) / 2,
      facing: 'down',
    }

    const input = createKeyboardInput()
    input.start()

    const loop = createGameLoop((deltaSeconds) => {
      const step = computeStep(input.snapshot(), player.facing, deltaSeconds)
      const position = moveBox(
        room.tiles,
        isWalkableTile,
        TILE_SIZE,
        { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        step.dx,
        step.dy,
      )
      player = { ...position, facing: step.facing }
      render(ctx, {
        tiles: room.tiles,
        tileSize: TILE_SIZE,
        tileColors: TILE_COLORS,
        player,
      })
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

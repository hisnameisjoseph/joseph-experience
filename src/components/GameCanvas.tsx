import { useEffect, useRef } from 'react'
import { getRoom, hubRoom } from '../content/rooms'
import { isWalkableTile, TILE_SIZE, TILES } from '../content/tiles'
import type { RoomData } from '../content/types'
import { moveBox } from '../game/collision'
import type { GameInput } from '../game/input'
import { findInteractable } from '../game/interaction'
import { createGameLoop } from '../game/loop'
import { computeStep, type PlayerState } from '../game/movement'
import {
  advanceTransition,
  IDLE_TRANSITION,
  startTransition,
  type TransitionState,
} from '../game/transition'
import { useGameStore } from '../store'
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
export function GameCanvas({ input }: { input: GameInput }) {
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

    const spawnPlayer = (r: RoomData): PlayerState => ({
      x: r.spawn.gridX * TILE_SIZE + (TILE_SIZE - PLAYER_WIDTH) / 2,
      y: r.spawn.gridY * TILE_SIZE + (TILE_SIZE - PLAYER_HEIGHT) / 2,
      facing: 'down',
    })

    let room = getRoom(useGameStore.getState().currentRoomId) ?? hubRoom
    let player = spawnPlayer(room)
    let transition: TransitionState = IDLE_TRANSITION

    input.start()

    const loop = createGameLoop((deltaSeconds) => {
      const store = useGameStore.getState()
      let hint: { gridX: number; gridY: number; label?: string } | null = null

      if (transition.phase !== 'idle') {
        // The world is frozen during a fade; the room swaps at full black.
        input.consumeInteract()
        const result = advanceTransition(transition, deltaSeconds)
        transition = result.state
        if (result.roomChange !== null) {
          const next = getRoom(result.roomChange)
          if (next) {
            room = next
            player = spawnPlayer(next)
            store.setRoom(result.roomChange)
          }
        }
      } else if (store.paused) {
        // Drain E presses so a press made while the card is open does not
        // fire the moment it closes.
        input.consumeInteract()
      } else {
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

        const target = findInteractable(
          { ...player, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
          room.objects,
          TILE_SIZE,
        )
        if (target?.kind === 'card') {
          hint = { gridX: target.gridX, gridY: target.gridY }
          if (input.consumeInteract()) store.openCard(target.cardId)
        } else if (target?.kind === 'door' && getRoom(target.doorTarget)) {
          hint = { gridX: target.gridX, gridY: target.gridY, label: target.label }
          if (input.consumeInteract()) transition = startTransition(target.doorTarget)
        } else {
          input.consumeInteract()
        }
      }

      render(ctx, {
        tiles: room.tiles,
        tileSize: TILE_SIZE,
        tileColors: TILE_COLORS,
        player,
        hint,
        fadeAlpha: transition.alpha,
      })
    })
    loop.start()

    return () => {
      loop.stop()
      input.stop()
      window.removeEventListener('resize', applyIntegerScale)
    }
  }, [input])

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

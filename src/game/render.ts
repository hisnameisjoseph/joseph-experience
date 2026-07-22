// Render layer entry point (see also sprites.ts). Only this layer touches the
// canvas context; game logic never does.
import { TILE_SERVER_RACK } from '../content/tiles'
import type { ObjectSprite, TileId } from '../content/types'
import type { PlayerState } from './movement'
import { drawObjectSprite, drawServerRack } from './sprites'

export const INTERNAL_WIDTH = 400
export const INTERNAL_HEIGHT = 225

export const PLAYER_WIDTH = 12
export const PLAYER_HEIGHT = 14

const BACKGROUND_COLOR = '#12101a'
const PLAYER_COLOR = '#5ee9f2'
const FACING_COLOR = '#1c5b66'
const FACING_THICKNESS = 3

const HINT_BG = '#12101a'
const HINT_TEXT = '#f2f0f7'

export interface RenderObject {
  gridX: number
  gridY: number
  sprite: ObjectSprite
}

export interface Scene {
  tiles: readonly (readonly TileId[])[]
  tileSize: number
  tileColors: Readonly<Record<number, string>>
  /** Sprite objects to draw on top of the tiles. */
  objects: readonly RenderObject[]
  player: PlayerState
  /** Interactable the player faces, if any; label for door plaques. */
  hint: { gridX: number; gridY: number; label?: string } | null
  /** Black overlay opacity for room transitions, 0..1. */
  fadeAlpha: number
  /** Elapsed seconds, for animated sprites (e.g. the flashing clock). */
  timeSeconds: number
  /** Transient centered message (e.g. "Coming soon"), or null. */
  toast: string | null
}

export function render(ctx: CanvasRenderingContext2D, scene: Scene): void {
  ctx.imageSmoothingEnabled = false

  ctx.fillStyle = BACKGROUND_COLOR
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT)

  const { tiles, tileSize, tileColors } = scene
  for (let row = 0; row < tiles.length; row++) {
    for (let col = 0; col < tiles[row].length; col++) {
      const id = tiles[row][col]
      const color = tileColors[id] ?? BACKGROUND_COLOR
      if (id === TILE_SERVER_RACK) {
        drawServerRack(ctx, col * tileSize, row * tileSize, tileSize, color)
      } else {
        ctx.fillStyle = color
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize)
      }
    }
  }

  for (const obj of scene.objects) {
    drawObjectSprite(
      ctx,
      obj.sprite,
      obj.gridX * tileSize,
      obj.gridY * tileSize,
      tileSize,
      scene.timeSeconds,
    )
  }

  // Floor to the pixel grid so edges stay crisp when upscaled.
  const x = Math.floor(scene.player.x)
  const y = Math.floor(scene.player.y)
  ctx.fillStyle = PLAYER_COLOR
  ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

  // Darker strip on the edge the player faces.
  ctx.fillStyle = FACING_COLOR
  switch (scene.player.facing) {
    case 'up':
      ctx.fillRect(x, y, PLAYER_WIDTH, FACING_THICKNESS)
      break
    case 'down':
      ctx.fillRect(x, y + PLAYER_HEIGHT - FACING_THICKNESS, PLAYER_WIDTH, FACING_THICKNESS)
      break
    case 'left':
      ctx.fillRect(x, y, FACING_THICKNESS, PLAYER_HEIGHT)
      break
    case 'right':
      ctx.fillRect(x + PLAYER_WIDTH - FACING_THICKNESS, y, FACING_THICKNESS, PLAYER_HEIGHT)
      break
  }

  if (scene.hint) {
    drawHint(ctx, scene.hint, scene.tileSize)
  }

  if (scene.toast) {
    drawToast(ctx, scene.toast)
  }

  if (scene.fadeAlpha > 0) {
    ctx.globalAlpha = Math.min(1, scene.fadeAlpha)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT)
    ctx.globalAlpha = 1
  }
}

/** Floating bubble above a grid cell: "E" for plain interactables, the
 * plaque text for doors. Kept inside the canvas near edges. */
function drawHint(
  ctx: CanvasRenderingContext2D,
  hint: { gridX: number; gridY: number; label?: string },
  tileSize: number,
): void {
  const text = hint.label ?? 'E'
  ctx.font = '8px monospace'
  const width = Math.ceil(ctx.measureText(text).width) + 8
  const centerX = hint.gridX * tileSize + tileSize / 2
  const left = Math.min(Math.max(centerX - width / 2, 1), INTERNAL_WIDTH - width - 1)
  const top = Math.max(1, hint.gridY * tileSize - 13)
  ctx.fillStyle = HINT_BG
  ctx.fillRect(left, top, width, 12)
  ctx.strokeStyle = HINT_TEXT
  ctx.strokeRect(left + 0.5, top + 0.5, width - 1, 11)
  ctx.fillStyle = HINT_TEXT
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, left + 4, top + 6)
}

/** Centered transient message near the top of the play area. */
function drawToast(ctx: CanvasRenderingContext2D, text: string): void {
  ctx.font = '8px monospace'
  const width = Math.ceil(ctx.measureText(text).width) + 12
  const left = Math.round((INTERNAL_WIDTH - width) / 2)
  const top = 28
  ctx.fillStyle = HINT_BG
  ctx.fillRect(left, top, width, 14)
  ctx.strokeStyle = HINT_TEXT
  ctx.strokeRect(left + 0.5, top + 0.5, width - 1, 13)
  ctx.fillStyle = HINT_TEXT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, INTERNAL_WIDTH / 2, top + 7)
}

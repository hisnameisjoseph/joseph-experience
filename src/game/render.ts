// The only module that touches the canvas context.
import type { PlayerState } from './movement'

export const INTERNAL_WIDTH = 400
export const INTERNAL_HEIGHT = 225

export const PLAYER_WIDTH = 12
export const PLAYER_HEIGHT = 14

const FLOOR_COLOR = '#1a1c2c'
const PLAYER_COLOR = '#5ee9f2'
const FACING_COLOR = '#1c5b66'
const FACING_THICKNESS = 3

export function render(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  ctx.imageSmoothingEnabled = false

  ctx.fillStyle = FLOOR_COLOR
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT)

  // Floor to the pixel grid so edges stay crisp when upscaled.
  const x = Math.floor(player.x)
  const y = Math.floor(player.y)
  ctx.fillStyle = PLAYER_COLOR
  ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

  // Darker strip on the edge the player faces.
  ctx.fillStyle = FACING_COLOR
  switch (player.facing) {
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
}

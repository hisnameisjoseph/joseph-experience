// The only module that touches the canvas context.

export const INTERNAL_WIDTH = 400
export const INTERNAL_HEIGHT = 225

const FLOOR_COLOR = '#1a1c2c'
const PLAYER_COLOR = '#5ee9f2'
const PLAYER_WIDTH = 12
const PLAYER_HEIGHT = 14

export function render(ctx: CanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = false

  ctx.fillStyle = FLOOR_COLOR
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT)

  // Integer coordinates keep edges on the pixel grid (no seams when upscaled).
  ctx.fillStyle = PLAYER_COLOR
  ctx.fillRect(
    Math.floor((INTERNAL_WIDTH - PLAYER_WIDTH) / 2),
    Math.floor((INTERNAL_HEIGHT - PLAYER_HEIGHT) / 2),
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
  )
}

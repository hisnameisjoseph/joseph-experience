export type Facing = 'up' | 'down' | 'left' | 'right'

export interface MoveInput {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export interface PlayerState {
  /** Top-left corner in internal-resolution pixels. Kept fractional; the
   * renderer floors to the pixel grid. */
  x: number
  y: number
  facing: Facing
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** Walking pace in internal-resolution pixels per second. */
export const PLAYER_SPEED = 70

export function stepPlayer(
  player: PlayerState,
  input: MoveInput,
  deltaSeconds: number,
  bounds: Bounds,
): PlayerState {
  const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0)
  if (dx === 0 && dy === 0) return player

  // Normalize diagonals so speed is direction-independent.
  const scale = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1
  const distance = PLAYER_SPEED * scale * deltaSeconds
  return {
    x: clamp(player.x + dx * distance, bounds.minX, bounds.maxX),
    y: clamp(player.y + dy * distance, bounds.minY, bounds.maxY),
    facing: nextFacing(player.facing, dx, dy),
  }
}

/** Keep the current facing while it is still one of the held directions
 * (moving diagonally does not flicker); otherwise turn toward the new one. */
function nextFacing(current: Facing, dx: number, dy: number): Facing {
  const active: Facing[] = []
  if (dx < 0) active.push('left')
  if (dx > 0) active.push('right')
  if (dy < 0) active.push('up')
  if (dy > 0) active.push('down')
  return active.includes(current) ? current : active[0]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

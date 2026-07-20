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

export interface StepResult {
  dx: number
  dy: number
  facing: Facing
}

/** Walking pace in internal-resolution pixels per second. */
export const PLAYER_SPEED = 70

/** Intended displacement for this frame; collision decides how much of it
 * actually happens. */
export function computeStep(
  input: MoveInput,
  facing: Facing,
  deltaSeconds: number,
): StepResult {
  const dirX = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  const dirY = (input.down ? 1 : 0) - (input.up ? 1 : 0)
  if (dirX === 0 && dirY === 0) return { dx: 0, dy: 0, facing }

  // Normalize diagonals so speed is direction-independent.
  const scale = dirX !== 0 && dirY !== 0 ? Math.SQRT1_2 : 1
  const distance = PLAYER_SPEED * scale * deltaSeconds
  if (distance === 0) return { dx: 0, dy: 0, facing: nextFacing(facing, dirX, dirY) }
  return {
    dx: dirX * distance,
    dy: dirY * distance,
    facing: nextFacing(facing, dirX, dirY),
  }
}

/** Keep the current facing while it is still one of the held directions
 * (moving diagonally does not flicker); otherwise turn toward the new one. */
function nextFacing(current: Facing, dirX: number, dirY: number): Facing {
  const active: Facing[] = []
  if (dirX < 0) active.push('left')
  if (dirX > 0) active.push('right')
  if (dirY < 0) active.push('up')
  if (dirY > 0) active.push('down')
  return active.includes(current) ? current : active[0]
}

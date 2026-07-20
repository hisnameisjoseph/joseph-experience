import type { RoomObject } from '../content/types'
import type { Facing } from './movement'

export interface InteractionBox {
  x: number
  y: number
  width: number
  height: number
  facing: Facing
}

/**
 * The object the player could interact with right now: the one occupying the
 * grid cell one step from the player's center in the facing direction. Being
 * beside an object without facing it, or facing it from farther away, finds
 * nothing.
 */
export function findInteractable(
  player: InteractionBox,
  objects: readonly RoomObject[],
  tileSize: number,
): RoomObject | null {
  let col = Math.floor((player.x + player.width / 2) / tileSize)
  let row = Math.floor((player.y + player.height / 2) / tileSize)
  switch (player.facing) {
    case 'up':
      row -= 1
      break
    case 'down':
      row += 1
      break
    case 'left':
      col -= 1
      break
    case 'right':
      col += 1
      break
  }
  return objects.find((o) => o.gridX === col && o.gridY === row) ?? null
}

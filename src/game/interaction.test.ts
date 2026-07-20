import type { RoomObject } from '../content/types'
import { findInteractable, type InteractionBox } from './interaction'

const TS = 16

const desk: RoomObject = { id: 'desk', kind: 'card', gridX: 5, gridY: 2, cardId: 'c1' }
const door: RoomObject = { id: 'door', kind: 'door', gridX: 3, gridY: 2, doorTarget: 'hub', label: 'Door' }
const objects = [desk, door]

// Player box whose center lies in the given grid cell.
function playerIn(gridX: number, gridY: number, facing: InteractionBox['facing']): InteractionBox {
  return { x: gridX * TS + 2, y: gridY * TS + 1, width: 12, height: 14, facing }
}

describe('findInteractable', () => {
  it('finds an object the player faces from below', () => {
    expect(findInteractable(playerIn(5, 3, 'up'), objects, TS)).toBe(desk)
  })

  it('finds an object the player faces from above', () => {
    expect(findInteractable(playerIn(5, 1, 'down'), objects, TS)).toBe(desk)
  })

  it('finds an object the player faces from the side', () => {
    expect(findInteractable(playerIn(4, 2, 'right'), objects, TS)).toBe(desk)
    expect(findInteractable(playerIn(4, 2, 'left'), objects, TS)).toBe(door)
  })

  it('finds nothing when adjacent but facing away', () => {
    expect(findInteractable(playerIn(5, 3, 'down'), objects, TS)).toBeNull()
    expect(findInteractable(playerIn(5, 3, 'left'), objects, TS)).toBeNull()
  })

  it('finds nothing from a diagonal cell', () => {
    expect(findInteractable(playerIn(4, 3, 'up'), objects, TS)).toBeNull()
  })

  it('finds nothing when one cell too far away', () => {
    expect(findInteractable(playerIn(5, 4, 'up'), objects, TS)).toBeNull()
  })

  it('uses the cell under the player center when straddling tiles', () => {
    // Box straddles columns 4 and 5; center x = x + 6.
    const straddling: InteractionBox = { x: 5 * TS - 5, y: 3 * TS, width: 12, height: 14, facing: 'up' }
    // center = 5*16 + 1 -> column 5 -> faces desk.
    expect(findInteractable(straddling, objects, TS)).toBe(desk)
    const other: InteractionBox = { x: 5 * TS - 8, y: 3 * TS, width: 12, height: 14, facing: 'up' }
    // center = 5*16 - 2 -> column 4 -> faces empty cell.
    expect(findInteractable(other, objects, TS)).toBeNull()
  })

  it('returns null with no objects', () => {
    expect(findInteractable(playerIn(5, 3, 'up'), [], TS)).toBeNull()
  })
})

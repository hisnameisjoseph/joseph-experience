import { getCard } from '../cards'
import { isWalkableTile } from '../tiles'
import type { DoorObject } from '../types'
import { hubRoom } from './hub'
import { getRoom } from './index'

const doors = hubRoom.objects.filter((o): o is DoorObject => o.kind === 'door')

describe('hubRoom', () => {
  it('is 25x14 tiles', () => {
    expect(hubRoom.tiles).toHaveLength(14)
    for (const row of hubRoom.tiles) expect(row).toHaveLength(25)
  })

  it('spawns the player on a walkable tile', () => {
    const { gridX, gridY } = hubRoom.spawn
    expect(isWalkableTile(hubRoom.tiles[gridY][gridX])).toBe(true)
  })

  it('has a laptop desk that opens the about-me card', () => {
    const desk = hubRoom.objects.find((o) => o.id === 'hub-desk')
    expect(desk).toBeDefined()
    expect(desk?.kind).toBe('card')
    if (desk?.kind === 'card') {
      expect(desk.sprite).toBe('laptop')
      expect(desk.cardId).toBe('about-me')
      expect(getCard(desk.cardId)).toBeDefined()
    }
    // The desk sits on a solid tile so the player stands adjacent.
    if (desk) expect(isWalkableTile(hubRoom.tiles[desk.gridY][desk.gridX])).toBe(false)
  })

  it('has the five spec doors, each with a non-empty plaque', () => {
    const targets = new Set(doors.map((d) => d.doorTarget))
    expect(targets).toEqual(
      new Set([
        'focus-bear',
        'honours-project',
        'front-office',
        'bartender',
        'senior-resident',
      ]),
    )
    for (const d of doors) expect(d.label.length).toBeGreaterThan(0)
  })

  it('only the Focus Bear door leads to a built room; the rest are coming soon', () => {
    for (const d of doors) {
      const built = getRoom(d.doorTarget) !== undefined
      expect(built).toBe(d.doorTarget === 'focus-bear')
    }
  })
})

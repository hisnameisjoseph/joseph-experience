import { getCard } from '../cards'
import { isWalkableTile } from '../tiles'
import { focusBearRoom } from './focusBear'

const cardObjects = focusBearRoom.objects.filter((o) => o.kind === 'card')

describe('focusBearRoom', () => {
  it('is 25x14 tiles', () => {
    expect(focusBearRoom.tiles).toHaveLength(14)
    for (const row of focusBearRoom.tiles) expect(row).toHaveLength(25)
  })

  it('spawns the player on a walkable tile', () => {
    const { gridX, gridY } = focusBearRoom.spawn
    expect(isWalkableTile(focusBearRoom.tiles[gridY][gridX])).toBe(true)
  })

  it('places every interactable on a solid tile so the player stands adjacent', () => {
    for (const obj of cardObjects) {
      expect(isWalkableTile(focusBearRoom.tiles[obj.gridY][obj.gridX])).toBe(false)
    }
  })

  it('wires each interactable to an existing card with a sprite', () => {
    for (const obj of cardObjects) {
      expect(obj.sprite).toBeDefined()
      expect(getCard(obj.cardId)).toBeDefined()
    }
  })

  it('covers the four Focus Bear cards', () => {
    const cardIds = cardObjects.map((o) => o.cardId).sort()
    expect(cardIds).toEqual(['fb-compliance', 'fb-debugging', 'fb-openai', 'fb-timezone'])
  })

  it('has a return door to the hub', () => {
    const doors = focusBearRoom.objects.filter((o) => o.kind === 'door')
    expect(doors.length).toBeGreaterThan(0)
    expect(doors.every((d) => d.kind === 'door' && d.doorTarget === 'hub')).toBe(true)
  })
})

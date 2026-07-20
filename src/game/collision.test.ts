import { isBoxWalkable, moveBox, type Box } from './collision'

// 0 = walkable, 1 = solid. 5x5 tiles of 16px with a solid border and one
// solid tile in the middle at grid (2,2) -> pixels [32,48).
const T = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
]
const walkable = (id: number) => id === 0
const TS = 16

function box(x: number, y: number, width = 12, height = 14): Box {
  return { x, y, width, height }
}

const move = (b: Box, dx: number, dy: number) => moveBox(T, walkable, TS, b, dx, dy)

describe('isBoxWalkable', () => {
  it('accepts a box fully inside one walkable tile', () => {
    expect(isBoxWalkable(T, walkable, TS, box(18, 17))).toBe(true)
  })

  it('accepts a box spanning two walkable tiles', () => {
    expect(isBoxWalkable(T, walkable, TS, box(24, 20, 12, 8))).toBe(true)
  })

  it('rejects a box overlapping a solid tile by one pixel', () => {
    expect(isBoxWalkable(T, walkable, TS, box(32 - 12 + 1, 36))).toBe(false)
  })

  it('accepts a box exactly flush against a solid tile (half-open edges)', () => {
    expect(isBoxWalkable(T, walkable, TS, box(32 - 12, 36, 12, 8))).toBe(true)
    expect(isBoxWalkable(T, walkable, TS, box(48, 36, 12, 8))).toBe(true)
  })

  it('rejects a box outside the grid', () => {
    expect(isBoxWalkable(T, walkable, TS, box(-1, 20))).toBe(false)
    expect(isBoxWalkable(T, walkable, TS, box(74, 20))).toBe(false)
  })
})

describe('moveBox', () => {
  it('moves freely in open space', () => {
    expect(move(box(17, 17), 2, 2)).toEqual({ x: 19, y: 19 })
  })

  it('stops flush against a wall on the right', () => {
    // Middle solid tile starts at x=32; right edge must stop there.
    expect(move(box(17, 34, 12, 8), 10, 0)).toEqual({ x: 32 - 12, y: 34 })
  })

  it('stops flush against a wall on the left', () => {
    // Middle solid tile ends at x=48 (exclusive).
    expect(move(box(52, 34, 12, 8), -10, 0)).toEqual({ x: 48, y: 34 })
  })

  it('stops flush against walls above and below', () => {
    expect(move(box(34, 17, 12, 8), 0, 20)).toEqual({ x: 34, y: 32 - 8 })
    expect(move(box(34, 52, 12, 8), 0, -20)).toEqual({ x: 34, y: 48 })
  })

  it('slides along a wall when moving diagonally into it', () => {
    // Blocked on x by the middle tile, still free to move down.
    const result = move(box(17, 34, 12, 8), 10, 4)
    expect(result.x).toBe(32 - 12)
    expect(result.y).toBe(38)
  })

  it('is stopped on both axes in a fully blocked corner', () => {
    // Top-left interior corner: wall above and to the left.
    const start = box(16, 16, 12, 8)
    expect(move(start, -5, -5)).toEqual({ x: 16, y: 16 })
  })

  it('clips the corner of a solid tile without sticking', () => {
    // Box below-left of the middle tile moving up-right. X resolves first
    // while still below the tile, so it passes freely; y then hits the
    // tile's underside and stops flush at 48 — one axis blocked, one free.
    const result = move(box(17, 50, 12, 8), 6, -6)
    expect(result.x).toBe(23)
    expect(result.y).toBe(48)
  })

  it('does not tunnel through a solid tile on a large delta', () => {
    // Delta far larger than a tile: must stop at the middle tile, not
    // teleport past it.
    expect(move(box(17, 34, 12, 8), 100, 0)).toEqual({ x: 32 - 12, y: 34 })
    expect(move(box(52, 34, 12, 8), -100, 0)).toEqual({ x: 48, y: 34 })
  })

  it('keeps a box already flush against a wall in place when pushing into it', () => {
    const start = box(32 - 12, 34, 12, 8)
    expect(move(start, 5, 0)).toEqual({ x: 32 - 12, y: 34 })
  })

  it('handles zero movement', () => {
    expect(move(box(18, 17), 0, 0)).toEqual({ x: 18, y: 17 })
  })
})

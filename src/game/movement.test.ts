import { PLAYER_SPEED, stepPlayer, type Bounds, type MoveInput, type PlayerState } from './movement'

const bounds: Bounds = { minX: 0, minY: 0, maxX: 388, maxY: 211 }

function player(overrides: Partial<PlayerState> = {}): PlayerState {
  return { x: 100, y: 100, facing: 'down', ...overrides }
}

function input(overrides: Partial<MoveInput> = {}): MoveInput {
  return { up: false, down: false, left: false, right: false, ...overrides }
}

describe('stepPlayer', () => {
  it('moves right by speed * delta and faces right', () => {
    const next = stepPlayer(player(), input({ right: true }), 0.5, bounds)
    expect(next.x).toBeCloseTo(100 + PLAYER_SPEED * 0.5)
    expect(next.y).toBe(100)
    expect(next.facing).toBe('right')
  })

  it('moves up by speed * delta and faces up', () => {
    const next = stepPlayer(player(), input({ up: true }), 0.25, bounds)
    expect(next.y).toBeCloseTo(100 - PLAYER_SPEED * 0.25)
    expect(next.x).toBe(100)
    expect(next.facing).toBe('up')
  })

  it('returns the same state when no direction is held', () => {
    const start = player()
    expect(stepPlayer(start, input(), 0.5, bounds)).toBe(start)
  })

  it('cancels opposing directions', () => {
    const start = player()
    const next = stepPlayer(start, input({ left: true, right: true }), 0.5, bounds)
    expect(next).toBe(start)
  })

  it('normalizes diagonal movement to the same speed', () => {
    const next = stepPlayer(player(), input({ right: true, down: true }), 1, bounds)
    const traveled = Math.hypot(next.x - 100, next.y - 100)
    expect(traveled).toBeCloseTo(PLAYER_SPEED)
  })

  it('keeps the current facing during a diagonal that includes it', () => {
    const next = stepPlayer(
      player({ facing: 'up' }),
      input({ up: true, right: true }),
      0.1,
      bounds,
    )
    expect(next.facing).toBe('up')
  })

  it('turns when the held directions no longer include the current facing', () => {
    const next = stepPlayer(
      player({ facing: 'up' }),
      input({ down: true, right: true }),
      0.1,
      bounds,
    )
    expect(next.facing).toBe('right')
  })

  it('clamps to the bounds', () => {
    const next = stepPlayer(player({ x: 386 }), input({ right: true }), 1, bounds)
    expect(next.x).toBe(bounds.maxX)
    const next2 = stepPlayer(player({ y: 2 }), input({ up: true }), 1, bounds)
    expect(next2.y).toBe(bounds.minY)
  })

  it('does not move with zero delta but still updates facing', () => {
    const next = stepPlayer(player(), input({ left: true }), 0, bounds)
    expect(next.x).toBe(100)
    expect(next.facing).toBe('left')
  })
})

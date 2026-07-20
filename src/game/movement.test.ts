import { computeStep, PLAYER_SPEED, type MoveInput } from './movement'

function input(overrides: Partial<MoveInput> = {}): MoveInput {
  return { up: false, down: false, left: false, right: false, ...overrides }
}

describe('computeStep', () => {
  it('moves right by speed * delta and faces right', () => {
    const step = computeStep(input({ right: true }), 'down', 0.5)
    expect(step.dx).toBeCloseTo(PLAYER_SPEED * 0.5)
    expect(step.dy).toBe(0)
    expect(step.facing).toBe('right')
  })

  it('moves up by speed * delta and faces up', () => {
    const step = computeStep(input({ up: true }), 'down', 0.25)
    expect(step.dy).toBeCloseTo(-PLAYER_SPEED * 0.25)
    expect(step.dx).toBe(0)
    expect(step.facing).toBe('up')
  })

  it('returns zero displacement and keeps facing when nothing is held', () => {
    expect(computeStep(input(), 'left', 0.5)).toEqual({ dx: 0, dy: 0, facing: 'left' })
  })

  it('cancels opposing directions', () => {
    const step = computeStep(input({ left: true, right: true }), 'down', 0.5)
    expect(step).toEqual({ dx: 0, dy: 0, facing: 'down' })
  })

  it('normalizes diagonal movement to the same speed', () => {
    const step = computeStep(input({ right: true, down: true }), 'down', 1)
    expect(Math.hypot(step.dx, step.dy)).toBeCloseTo(PLAYER_SPEED)
  })

  it('keeps the current facing during a diagonal that includes it', () => {
    const step = computeStep(input({ up: true, right: true }), 'up', 0.1)
    expect(step.facing).toBe('up')
  })

  it('turns when the held directions no longer include the current facing', () => {
    const step = computeStep(input({ down: true, right: true }), 'up', 0.1)
    expect(step.facing).toBe('right')
  })

  it('produces no displacement with zero delta but still updates facing', () => {
    const step = computeStep(input({ left: true }), 'down', 0)
    expect(step.dx).toBe(0)
    expect(step.facing).toBe('left')
  })
})

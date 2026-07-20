import {
  advanceTransition,
  FADE_SECONDS,
  IDLE_TRANSITION,
  startTransition,
} from './transition'

describe('transition', () => {
  it('stays idle when idle', () => {
    const result = advanceTransition(IDLE_TRANSITION, 1)
    expect(result.state).toBe(IDLE_TRANSITION)
    expect(result.roomChange).toBeNull()
  })

  it('darkens during fade-out without changing rooms yet', () => {
    const result = advanceTransition(startTransition('focus-bear'), FADE_SECONDS / 2)
    expect(result.state.phase).toBe('out')
    expect(result.state.alpha).toBeCloseTo(0.5)
    expect(result.roomChange).toBeNull()
  })

  it('reports the room change exactly once, at full black', () => {
    let state = startTransition('focus-bear')
    let changes = 0
    for (let i = 0; i < 20; i++) {
      const result = advanceTransition(state, FADE_SECONDS / 4)
      state = result.state
      if (result.roomChange !== null) {
        changes += 1
        expect(result.roomChange).toBe('focus-bear')
        expect(state.phase).toBe('in')
        expect(state.alpha).toBe(1)
      }
    }
    expect(changes).toBe(1)
    expect(state).toEqual(IDLE_TRANSITION)
  })

  it('brightens during fade-in and returns to idle', () => {
    const mid = advanceTransition({ phase: 'in', alpha: 1, target: null }, FADE_SECONDS / 2)
    expect(mid.state.phase).toBe('in')
    expect(mid.state.alpha).toBeCloseTo(0.5)
    const done = advanceTransition(mid.state, FADE_SECONDS)
    expect(done.state).toEqual(IDLE_TRANSITION)
    expect(done.roomChange).toBeNull()
  })

  it('finishes fade-out even on a huge delta', () => {
    const result = advanceTransition(startTransition('hub'), 10)
    expect(result.roomChange).toBe('hub')
    expect(result.state.phase).toBe('in')
  })
})

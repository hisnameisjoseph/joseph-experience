import type { RoomId } from '../content/types'

/** Seconds for each half of the fade (out, then in). */
export const FADE_SECONDS = 0.25

export interface TransitionState {
  phase: 'idle' | 'out' | 'in'
  /** Black overlay opacity, 0..1. */
  alpha: number
  /** Room to load when the fade-out completes. */
  target: RoomId | null
}

export const IDLE_TRANSITION: TransitionState = { phase: 'idle', alpha: 0, target: null }

export function startTransition(target: RoomId): TransitionState {
  return { phase: 'out', alpha: 0, target }
}

export interface TransitionResult {
  state: TransitionState
  /** Set exactly once, on the frame the fade-out completes: the room to
   * load while the screen is fully black. */
  roomChange: RoomId | null
}

export function advanceTransition(
  state: TransitionState,
  deltaSeconds: number,
): TransitionResult {
  switch (state.phase) {
    case 'idle':
      return { state, roomChange: null }
    case 'out': {
      const alpha = state.alpha + deltaSeconds / FADE_SECONDS
      if (alpha >= 1) {
        return {
          state: { phase: 'in', alpha: 1, target: null },
          roomChange: state.target,
        }
      }
      return { state: { ...state, alpha }, roomChange: null }
    }
    case 'in': {
      const alpha = state.alpha - deltaSeconds / FADE_SECONDS
      if (alpha <= 0) return { state: IDLE_TRANSITION, roomChange: null }
      return { state: { ...state, alpha }, roomChange: null }
    }
  }
}

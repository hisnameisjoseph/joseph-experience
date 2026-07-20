import type { MoveInput } from './movement'

// Physical key positions (KeyboardEvent.code), so the WASD cluster works on
// any keyboard layout; arrows are layout-independent anyway.
const KEY_TO_DIRECTION: Readonly<Record<string, keyof MoveInput>> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

const INTERACT_CODE = 'KeyE'

export type Direction = keyof MoveInput

/** Single input source for the game: keyboard and touch feed the same
 * state, and the loop polls it identically either way. */
export interface GameInput {
  start(): void
  stop(): void
  /** Current held directions (keyboard OR touch), polled once per frame. */
  snapshot(): MoveInput
  /** True once per press (keyboard E or touch action); consuming clears it.
   * Key-repeat while holding does not re-trigger. */
  consumeInteract(): boolean
  /** Touch D-pad: mark a direction held or released. */
  setTouchHeld(direction: Direction, held: boolean): void
  /** Touch action button press. */
  pressInteract(): void
}

export function createGameInput(target: Window = window): GameInput {
  const pressedCodes = new Set<string>()
  const touchHeld: MoveInput = { up: false, down: false, left: false, right: false }
  let interactQueued = false

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === INTERACT_CODE) {
      if (!event.repeat) interactQueued = true
      return
    }
    if (KEY_TO_DIRECTION[event.code] === undefined) return
    event.preventDefault()
    pressedCodes.add(event.code)
  }
  const onKeyUp = (event: KeyboardEvent): void => {
    pressedCodes.delete(event.code)
  }
  // Losing focus never delivers the keyup; clear so keys don't stick. Touch
  // state is left alone: pointer capture delivers its own up/cancel.
  const onBlur = (): void => {
    pressedCodes.clear()
    interactQueued = false
  }

  return {
    start() {
      target.addEventListener('keydown', onKeyDown)
      target.addEventListener('keyup', onKeyUp)
      target.addEventListener('blur', onBlur)
    },
    stop() {
      target.removeEventListener('keydown', onKeyDown)
      target.removeEventListener('keyup', onKeyUp)
      target.removeEventListener('blur', onBlur)
      pressedCodes.clear()
      touchHeld.up = touchHeld.down = touchHeld.left = touchHeld.right = false
      interactQueued = false
    },
    snapshot() {
      const input: MoveInput = { ...touchHeld }
      for (const code of pressedCodes) {
        input[KEY_TO_DIRECTION[code]] = true
      }
      return input
    },
    consumeInteract() {
      const queued = interactQueued
      interactQueued = false
      return queued
    },
    setTouchHeld(direction, held) {
      touchHeld[direction] = held
    },
    pressInteract() {
      interactQueued = true
    },
  }
}

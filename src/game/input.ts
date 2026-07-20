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

export interface KeyboardInput {
  start(): void
  stop(): void
  /** Current held directions, polled by the game loop once per frame. */
  snapshot(): MoveInput
}

export function createKeyboardInput(target: Window = window): KeyboardInput {
  const pressedCodes = new Set<string>()

  const onKeyDown = (event: KeyboardEvent): void => {
    if (KEY_TO_DIRECTION[event.code] === undefined) return
    event.preventDefault()
    pressedCodes.add(event.code)
  }
  const onKeyUp = (event: KeyboardEvent): void => {
    pressedCodes.delete(event.code)
  }
  // Losing focus never delivers the keyup; clear so keys don't stick.
  const onBlur = (): void => {
    pressedCodes.clear()
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
    },
    snapshot() {
      const input: MoveInput = { up: false, down: false, left: false, right: false }
      for (const code of pressedCodes) {
        input[KEY_TO_DIRECTION[code]] = true
      }
      return input
    },
  }
}

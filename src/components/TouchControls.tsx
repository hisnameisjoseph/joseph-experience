import type { PointerEvent } from 'react'
import type { Direction, GameInput } from '../game/input'

const ARROWS: Readonly<Record<Direction, string>> = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
}

/** On-screen D-pad (bottom left) and action button (bottom right). Hidden on
 * fine-pointer devices via CSS (pointer: coarse). Feeds the shared GameInput,
 * so game logic sees no difference from the keyboard. */
export function TouchControls({ input }: { input: GameInput }) {
  const hold = (direction: Direction) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      capturePointer(event)
      input.setTouchHeld(direction, true)
    },
    onPointerUp: () => input.setTouchHeld(direction, false),
    onPointerCancel: () => input.setTouchHeld(direction, false),
  })

  return (
    <div className="touch-controls" aria-hidden={false}>
      <div className="dpad">
        <button type="button" className="dpad-btn dpad-up" aria-label="Move up" {...hold('up')}>
          {ARROWS.up}
        </button>
        <button type="button" className="dpad-btn dpad-left" aria-label="Move left" {...hold('left')}>
          {ARROWS.left}
        </button>
        <button type="button" className="dpad-btn dpad-right" aria-label="Move right" {...hold('right')}>
          {ARROWS.right}
        </button>
        <button type="button" className="dpad-btn dpad-down" aria-label="Move down" {...hold('down')}>
          {ARROWS.down}
        </button>
      </div>
      <button
        type="button"
        className="action-btn"
        aria-label="Interact"
        onPointerDown={(event) => {
          event.preventDefault()
          input.pressInteract()
        }}
      >
        E
      </button>
    </div>
  )
}

/** Keep receiving pointerup even if the finger slides off the button.
 * jsdom lacks/throws on setPointerCapture, so guard it. */
function capturePointer(event: PointerEvent<HTMLButtonElement>): void {
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch {
    // Unsupported pointer capture (tests); release still comes via pointerup.
  }
}

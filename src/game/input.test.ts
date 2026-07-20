import { createGameInput } from './input'

function press(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code, cancelable: true }))
}

function release(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keyup', { code }))
}

describe('createGameInput', () => {
  it('maps WASD and arrows to directions while held', () => {
    const input = createGameInput()
    input.start()
    press('KeyW')
    press('ArrowRight')
    expect(input.snapshot()).toEqual({ up: true, down: false, left: false, right: true })
    release('KeyW')
    expect(input.snapshot()).toEqual({ up: false, down: false, left: false, right: true })
    input.stop()
  })

  it('keeps a direction held while either of its two keys is down', () => {
    const input = createGameInput()
    input.start()
    press('KeyW')
    press('ArrowUp')
    release('ArrowUp')
    expect(input.snapshot().up).toBe(true)
    release('KeyW')
    expect(input.snapshot().up).toBe(false)
    input.stop()
  })

  it('clears keyboard keys when the window loses focus', () => {
    const input = createGameInput()
    input.start()
    press('KeyA')
    window.dispatchEvent(new Event('blur'))
    expect(input.snapshot()).toEqual({ up: false, down: false, left: false, right: false })
    input.stop()
  })

  it('ignores events after stop', () => {
    const input = createGameInput()
    input.start()
    input.stop()
    press('KeyD')
    expect(input.snapshot().right).toBe(false)
  })

  it('reports an E press exactly once per consume', () => {
    const input = createGameInput()
    input.start()
    press('KeyE')
    expect(input.consumeInteract()).toBe(true)
    expect(input.consumeInteract()).toBe(false)
    input.stop()
  })

  it('does not re-trigger interact on key repeat', () => {
    const input = createGameInput()
    input.start()
    press('KeyE')
    expect(input.consumeInteract()).toBe(true)
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', repeat: true }))
    expect(input.consumeInteract()).toBe(false)
    input.stop()
  })

  it('reflects touch directions in the same snapshot', () => {
    const input = createGameInput()
    input.setTouchHeld('left', true)
    expect(input.snapshot()).toEqual({ up: false, down: false, left: true, right: false })
    input.setTouchHeld('left', false)
    expect(input.snapshot().left).toBe(false)
  })

  it('merges touch and keyboard: releasing one keeps the other', () => {
    const input = createGameInput()
    input.start()
    input.setTouchHeld('up', true)
    press('KeyW')
    expect(input.snapshot().up).toBe(true)
    release('KeyW')
    expect(input.snapshot().up).toBe(true)
    input.setTouchHeld('up', false)
    expect(input.snapshot().up).toBe(false)
    input.stop()
  })

  it('queues a touch interact press like a keyboard E', () => {
    const input = createGameInput()
    input.pressInteract()
    expect(input.consumeInteract()).toBe(true)
    expect(input.consumeInteract()).toBe(false)
  })
})

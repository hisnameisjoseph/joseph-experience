import { fireEvent, render, screen } from '@testing-library/react'
import { createGameInput } from '../game/input'
import { TouchControls } from './TouchControls'

describe('TouchControls', () => {
  it('holds and releases a direction via the D-pad', () => {
    const input = createGameInput()
    render(<TouchControls input={input} />)
    const up = screen.getByRole('button', { name: 'Move up' })
    fireEvent.pointerDown(up)
    expect(input.snapshot().up).toBe(true)
    fireEvent.pointerUp(up)
    expect(input.snapshot().up).toBe(false)
  })

  it('releases on pointer cancel', () => {
    const input = createGameInput()
    render(<TouchControls input={input} />)
    const left = screen.getByRole('button', { name: 'Move left' })
    fireEvent.pointerDown(left)
    expect(input.snapshot().left).toBe(true)
    fireEvent.pointerCancel(left)
    expect(input.snapshot().left).toBe(false)
  })

  it('queues an interact press from the action button', () => {
    const input = createGameInput()
    render(<TouchControls input={input} />)
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Interact' }))
    expect(input.consumeInteract()).toBe(true)
    expect(input.consumeInteract()).toBe(false)
  })
})

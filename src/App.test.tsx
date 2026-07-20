import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('renders the game canvas at the internal resolution', () => {
    render(<App />)
    const canvas = screen.getByLabelText('Game canvas')
    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas).toHaveAttribute('width', '400')
    expect(canvas).toHaveAttribute('height', '225')
  })
})

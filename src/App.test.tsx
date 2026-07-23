import { render, screen } from '@testing-library/react'
import { App } from './App'
import { useGameStore } from './store'

beforeEach(() => {
  useGameStore.setState({ phase: 'start' })
})

describe('App', () => {
  it('shows the start screen first, with no game canvas', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByLabelText('Game canvas')).not.toBeInTheDocument()
  })

  it('renders the game canvas once the game has started', () => {
    useGameStore.setState({ phase: 'playing' })
    render(<App />)
    const canvas = screen.getByLabelText('Game canvas')
    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas).toHaveAttribute('width', '400')
    expect(canvas).toHaveAttribute('height', '225')
  })

  it('shows Recruiter Mode when that phase is active', () => {
    useGameStore.setState({ phase: 'recruiter' })
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Recruiter Mode' })).toBeInTheDocument()
  })
})

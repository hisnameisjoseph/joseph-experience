import { fireEvent, render, screen } from '@testing-library/react'
import { useGameStore } from '../store'
import { StartScreen } from './StartScreen'

beforeEach(() => {
  useGameStore.setState({ phase: 'start' })
})

describe('StartScreen', () => {
  it('shows the title, name, pitch, and both control schemes', () => {
    render(<StartScreen />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/by Joseph/)).toBeInTheDocument()
    expect(screen.getByText(/every room is a piece of my work experience/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Keyboard' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Touch' })).toBeInTheDocument()
    // Both schemes describe how to interact.
    expect(screen.getAllByText(/interact/i)).toHaveLength(2)
    expect(screen.getByText(/D-pad/i)).toBeInTheDocument()
  })

  it('starts the game when Enter is clicked', () => {
    render(<StartScreen />)
    fireEvent.click(screen.getByRole('button', { name: 'Enter' }))
    expect(useGameStore.getState().phase).toBe('playing')
  })

  it('starts the game when the Enter key is pressed', () => {
    render(<StartScreen />)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(useGameStore.getState().phase).toBe('playing')
  })

  it('has a clearly labelled Recruiter Mode button that skips the game', () => {
    render(<StartScreen />)
    const button = screen.getByRole('button', { name: /Recruiter Mode: skip the game/i })
    fireEvent.click(button)
    expect(useGameStore.getState().phase).toBe('recruiter')
  })
})

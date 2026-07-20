import { fireEvent, render, screen } from '@testing-library/react'
import { useGameStore } from '../store'
import { InfoCard } from './InfoCard'

beforeEach(() => {
  useGameStore.setState({ activeCardId: null, paused: false })
})

describe('InfoCard', () => {
  it('renders nothing when no card is active', () => {
    render(<InfoCard />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows title, skill tag, body, and outcome of the active card', () => {
    useGameStore.getState().openCard('about-me')
    render(<InfoCard />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About Joseph' })).toBeInTheDocument()
    expect(screen.getByText('About Me')).toBeInTheDocument()
    expect(screen.getByText(/walkable/)).toBeInTheDocument()
    expect(screen.getByText(/you learned who lives/)).toBeInTheDocument()
  })

  it('pauses the game while open', () => {
    useGameStore.getState().openCard('about-me')
    expect(useGameStore.getState().paused).toBe(true)
  })

  it('closes via the close button and unpauses', () => {
    useGameStore.getState().openCard('about-me')
    render(<InfoCard />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(useGameStore.getState().activeCardId).toBeNull()
    expect(useGameStore.getState().paused).toBe(false)
  })

  it('closes on Escape', () => {
    useGameStore.getState().openCard('about-me')
    render(<InfoCard />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(useGameStore.getState().activeCardId).toBeNull()
  })

  it('closes when clicking the backdrop but not the card itself', () => {
    useGameStore.getState().openCard('about-me')
    const { container } = render(<InfoCard />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(useGameStore.getState().activeCardId).toBe('about-me')
    const backdrop = container.querySelector('.card-backdrop')
    expect(backdrop).not.toBeNull()
    if (backdrop) fireEvent.click(backdrop)
    expect(useGameStore.getState().activeCardId).toBeNull()
  })
})

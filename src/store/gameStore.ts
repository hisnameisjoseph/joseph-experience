import { create } from 'zustand'

interface GameStore {
  /** Card currently shown in the InfoCard overlay, or null. */
  activeCardId: string | null
  /** The game loop skips simulation while paused. */
  paused: boolean
  openCard: (cardId: string) => void
  closeCard: () => void
}

export const useGameStore = create<GameStore>()((set) => ({
  activeCardId: null,
  paused: false,
  openCard: (cardId) => set({ activeCardId: cardId, paused: true }),
  closeCard: () => set({ activeCardId: null, paused: false }),
}))

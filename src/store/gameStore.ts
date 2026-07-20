import { create } from 'zustand'
import type { RoomId } from '../content/types'

interface GameStore {
  /** Room the player is currently in. */
  currentRoomId: RoomId
  /** Card currently shown in the InfoCard overlay, or null. */
  activeCardId: string | null
  /** The game loop skips simulation while paused. */
  paused: boolean
  setRoom: (roomId: RoomId) => void
  openCard: (cardId: string) => void
  closeCard: () => void
}

export const useGameStore = create<GameStore>()((set) => ({
  currentRoomId: 'hub',
  activeCardId: null,
  paused: false,
  setRoom: (roomId) => set({ currentRoomId: roomId }),
  openCard: (cardId) => set({ activeCardId: cardId, paused: true }),
  closeCard: () => set({ activeCardId: null, paused: false }),
}))

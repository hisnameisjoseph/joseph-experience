import { create } from 'zustand'
import type { RoomId } from '../content/types'

/** Which top-level screen is showing. */
export type GamePhase = 'start' | 'playing' | 'recruiter'

interface GameStore {
  /** Current top-level screen. */
  phase: GamePhase
  /** Room the player is currently in. */
  currentRoomId: RoomId
  /** Card currently shown in the InfoCard overlay, or null. */
  activeCardId: string | null
  /** The game loop skips simulation while paused. */
  paused: boolean
  startGame: () => void
  openRecruiterMode: () => void
  goToStart: () => void
  setRoom: (roomId: RoomId) => void
  openCard: (cardId: string) => void
  closeCard: () => void
}

export const useGameStore = create<GameStore>()((set) => ({
  phase: 'start',
  currentRoomId: 'hub',
  activeCardId: null,
  paused: false,
  startGame: () => set({ phase: 'playing' }),
  openRecruiterMode: () => set({ phase: 'recruiter' }),
  goToStart: () => set({ phase: 'start' }),
  setRoom: (roomId) => set({ currentRoomId: roomId }),
  openCard: (cardId) => set({ activeCardId: cardId, paused: true }),
  closeCard: () => set({ activeCardId: null, paused: false }),
}))

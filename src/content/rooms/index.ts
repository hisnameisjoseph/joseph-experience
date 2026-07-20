import type { RoomData, RoomId } from '../types'
import { focusBearRoom } from './focusBear'
import { hubRoom } from './hub'

/** Rooms that exist so far; doors to unbuilt rooms stay inert. */
export const ROOMS: Readonly<Partial<Record<RoomId, RoomData>>> = {
  hub: hubRoom,
  'focus-bear': focusBearRoom,
}

export function getRoom(id: RoomId): RoomData | undefined {
  return ROOMS[id]
}

export { focusBearRoom, hubRoom }

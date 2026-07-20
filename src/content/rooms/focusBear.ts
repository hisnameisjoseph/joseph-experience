import type { RoomData } from '../types'
import { parseLayout } from './parseLayout'

// Placeholder: an empty room with a return door at the bottom. Server-room
// props (clocks, terminal, robot, filing cabinet) come with a later feature.
const LAYOUT = [
  '#########################',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '###########DD############',
] as const

export const focusBearRoom: RoomData = {
  id: 'focus-bear',
  name: 'Focus Bear — Backend Intern',
  tiles: parseLayout(LAYOUT),
  spawn: { gridX: 12, gridY: 11 },
  objects: [
    { id: 'fb-door-hub-0', kind: 'door', gridX: 11, gridY: 13, doorTarget: 'hub', label: 'Back to Home Office' },
    { id: 'fb-door-hub-1', kind: 'door', gridX: 12, gridY: 13, doorTarget: 'hub', label: 'Back to Home Office' },
  ],
}

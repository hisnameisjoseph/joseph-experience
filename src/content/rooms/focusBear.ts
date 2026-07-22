import {
  TILE_FLOOR,
  TILE_PROP,
  TILE_SERVER_RACK,
  TILE_WALL,
} from '../tiles'
import type { RoomData } from '../types'
import { parseLayout } from './parseLayout'

// 25x14 tiles = 400x224 px. Server room: rows of racks (R) with floor lanes,
// four interactable props (o / wall-mounted), and the return door (D).
//   clocks   -> top wall, col 12
//   terminal -> col 4,  row 5
//   robot    -> col 20, row 5
//   cabinet  -> col 4,  row 10
const LAYOUT = [
  '#########################',
  '#.......................#',
  '#..RRRRR.........RRRRR..#',
  '#..RRRRR.........RRRRR..#',
  '#.......................#',
  '#...o...............o...#',
  '#.......................#',
  '#..RRRRR.........RRRRR..#',
  '#..RRRRR.........RRRRR..#',
  '#.......................#',
  '#...o...................#',
  '#.......................#',
  '#.......................#',
  '###########DD############',
] as const

// Server room palette: dark blues with the door kept as a gold accent.
const PALETTE: Record<number, string> = {
  [TILE_FLOOR]: '#132033',
  [TILE_WALL]: '#0b1626',
  [TILE_SERVER_RACK]: '#1c2f4a',
  [TILE_PROP]: '#0e1a2b',
}

export const focusBearRoom: RoomData = {
  id: 'focus-bear',
  name: 'Focus Bear — Backend Intern',
  tiles: parseLayout(LAYOUT),
  spawn: { gridX: 12, gridY: 11 },
  palette: PALETTE,
  objects: [
    { id: 'fb-clocks', kind: 'card', gridX: 12, gridY: 0, cardId: 'fb-timezone', sprite: 'clocks' },
    { id: 'fb-terminal', kind: 'card', gridX: 4, gridY: 5, cardId: 'fb-debugging', sprite: 'terminal' },
    { id: 'fb-robot', kind: 'card', gridX: 20, gridY: 5, cardId: 'fb-openai', sprite: 'robot' },
    { id: 'fb-cabinet', kind: 'card', gridX: 4, gridY: 10, cardId: 'fb-compliance', sprite: 'cabinet' },
    { id: 'fb-door-hub-0', kind: 'door', gridX: 11, gridY: 13, doorTarget: 'hub', label: 'Back to Home Office' },
    { id: 'fb-door-hub-1', kind: 'door', gridX: 12, gridY: 13, doorTarget: 'hub', label: 'Back to Home Office' },
  ],
}

import type { RoomData } from '../types'
import { parseLayout } from './parseLayout'

// 25x14 tiles = 400x224 px. Five doors: two on the top wall, one on each
// side wall, one on the bottom wall.
const LAYOUT = [
  '####DD#############DD####',
  '#...........=...........#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  'D.......................D',
  'D.......................D',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '###########DD############',
] as const

export const hubRoom: RoomData = {
  id: 'hub',
  name: 'Home Office',
  tiles: parseLayout(LAYOUT),
  spawn: { gridX: 12, gridY: 7 },
  objects: [
    { id: 'hub-desk', kind: 'card', gridX: 12, gridY: 1, cardId: 'about-me' },
    { id: 'hub-door-focus-bear', kind: 'door', gridX: 4, gridY: 0, doorTarget: 'focus-bear' },
    { id: 'hub-door-honours', kind: 'door', gridX: 19, gridY: 0, doorTarget: 'honours-project' },
    { id: 'hub-door-front-office', kind: 'door', gridX: 0, gridY: 6, doorTarget: 'front-office' },
    { id: 'hub-door-bartender', kind: 'door', gridX: 24, gridY: 6, doorTarget: 'bartender' },
    { id: 'hub-door-senior-resident', kind: 'door', gridX: 11, gridY: 13, doorTarget: 'senior-resident' },
  ],
}

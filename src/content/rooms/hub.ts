import {
  TILE_DESK,
  TILE_DOOR,
  TILE_FLOOR,
  TILE_RUG,
  TILE_WALL,
} from '../tiles'
import type { DoorObject, RoomData, RoomId } from '../types'
import { parseLayout } from './parseLayout'

// 25x14 tiles = 400x224 px. Home office: a wooden desk (===) along the top
// wall with a laptop, a warm rug (r) in the middle, and five doors — two on
// the top wall, one on each side wall, one on the bottom wall.
const LAYOUT = [
  '####DD#############DD####',
  '#..........===..........#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.........rrrrr.........#',
  'D.........rrrrr.........D',
  'D.........rrrrr.........D',
  '#.........rrrrr.........#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '#.......................#',
  '###########DD############',
] as const

// Warm home-office palette (wood tones, gold doors).
const PALETTE: Record<number, string> = {
  [TILE_FLOOR]: '#5c4a34',
  [TILE_WALL]: '#3b2f23',
  [TILE_DESK]: '#8a6a43',
  [TILE_DOOR]: '#d0a24a',
  [TILE_RUG]: '#9c4038',
}

/** One object per door tile so facing either half of a 2-tile door works. */
function door(
  id: string,
  doorTarget: RoomId,
  label: string,
  tiles: readonly [number, number][],
): DoorObject[] {
  return tiles.map(([gridX, gridY], i) => ({
    id: `${id}-${i}`,
    kind: 'door',
    gridX,
    gridY,
    doorTarget,
    label,
  }))
}

export const hubRoom: RoomData = {
  id: 'hub',
  name: 'Home Office',
  tiles: parseLayout(LAYOUT),
  spawn: { gridX: 12, gridY: 10 },
  palette: PALETTE,
  objects: [
    { id: 'hub-desk', kind: 'card', gridX: 12, gridY: 1, cardId: 'about-me', sprite: 'laptop' },
    ...door('hub-door-focus-bear', 'focus-bear', 'Backend Intern — Focus Bear', [[4, 0], [5, 0]]),
    ...door('hub-door-honours', 'honours-project', 'Honours Project — ANU x Canberra Health Services', [[19, 0], [20, 0]]),
    ...door('hub-door-front-office', 'front-office', 'Front Office Associate', [[0, 6], [0, 7]]),
    ...door('hub-door-bartender', 'bartender', 'Bartender', [[24, 6], [24, 7]]),
    ...door('hub-door-senior-resident', 'senior-resident', 'Senior Resident', [[11, 13], [12, 13]]),
  ],
}

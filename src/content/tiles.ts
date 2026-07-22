import type { TileId } from './types'

/** Tile edge length in internal-resolution pixels. */
export const TILE_SIZE = 16

export const TILE_FLOOR: TileId = 0
export const TILE_WALL: TileId = 1
export const TILE_DOOR: TileId = 2
export const TILE_DESK: TileId = 3
export const TILE_SERVER_RACK: TileId = 4
/** Solid base an interactable prop stands on; usually hidden by its sprite. */
export const TILE_PROP: TileId = 5
/** Decorative floor accent (e.g. a rug); walkable. */
export const TILE_RUG: TileId = 6

export interface TileDef {
  color: string
  walkable: boolean
}

// Default (hub) palette; rooms may override any color via RoomData.palette.
export const TILES: Readonly<Record<number, TileDef>> = {
  [TILE_FLOOR]: { color: '#584c3a', walkable: true },
  [TILE_WALL]: { color: '#2b2436', walkable: false },
  // Doors are solid; the transition system reads the door object, not the tile.
  [TILE_DOOR]: { color: '#c9973f', walkable: false },
  [TILE_DESK]: { color: '#9b7e4e', walkable: false },
  [TILE_SERVER_RACK]: { color: '#1c2f4a', walkable: false },
  [TILE_PROP]: { color: '#0e1a2b', walkable: false },
  [TILE_RUG]: { color: '#9c4038', walkable: true },
}

export function isWalkableTile(id: TileId): boolean {
  return TILES[id]?.walkable ?? false
}

import type { TileId } from './types'

/** Tile edge length in internal-resolution pixels. */
export const TILE_SIZE = 16

export const TILE_FLOOR: TileId = 0
export const TILE_WALL: TileId = 1
export const TILE_DOOR: TileId = 2

export interface TileDef {
  color: string
  walkable: boolean
}

// Placeholder home-office palette; per-room palettes can override later.
export const TILES: Readonly<Record<number, TileDef>> = {
  [TILE_FLOOR]: { color: '#584c3a', walkable: true },
  [TILE_WALL]: { color: '#2b2436', walkable: false },
  // Doors stay solid until room transitions exist.
  [TILE_DOOR]: { color: '#c9973f', walkable: false },
}

export function isWalkableTile(id: TileId): boolean {
  return TILES[id]?.walkable ?? false
}

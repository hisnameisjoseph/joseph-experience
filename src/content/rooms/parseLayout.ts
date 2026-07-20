import { TILE_DESK, TILE_DOOR, TILE_FLOOR, TILE_WALL } from '../tiles'
import type { TileId } from '../types'

const CHAR_TO_TILE: Readonly<Record<string, TileId>> = {
  '.': TILE_FLOOR,
  '#': TILE_WALL,
  D: TILE_DOOR,
  '=': TILE_DESK,
}

/** Turn ASCII rows ('.' floor, '#' wall, 'D' door, '=' desk) into a tile grid.
 * Throws on unknown characters or ragged rows so layout typos fail loudly. */
export function parseLayout(rows: readonly string[]): TileId[][] {
  const width = rows[0]?.length ?? 0
  return rows.map((row, y) => {
    if (row.length !== width) {
      throw new Error(`Layout row ${y} has length ${row.length}, expected ${width}`)
    }
    return [...row].map((char, x) => {
      const tile = CHAR_TO_TILE[char]
      if (tile === undefined) {
        throw new Error(`Unknown layout character '${char}' at ${x},${y}`)
      }
      return tile
    })
  })
}

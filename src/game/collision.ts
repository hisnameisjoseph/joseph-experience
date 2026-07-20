import type { TileId } from '../content/types'

export type WalkablePredicate = (tile: TileId) => boolean

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

// Box edges are half-open ([x, x+width)): a box standing flush against a
// solid tile does not overlap it. The epsilon keeps flush positions from
// registering in the next tile through float noise.
const EPS = 1e-7

/** True when every tile overlapped by the box is walkable. Anything outside
 * the grid counts as solid, so the grid boundary is always a wall. */
export function isBoxWalkable(
  tiles: readonly (readonly TileId[])[],
  walkable: WalkablePredicate,
  tileSize: number,
  box: Box,
): boolean {
  const rows = tiles.length
  const cols = tiles[0]?.length ?? 0
  const minCol = Math.floor(box.x / tileSize)
  const maxCol = Math.floor((box.x + box.width - EPS) / tileSize)
  const minRow = Math.floor(box.y / tileSize)
  const maxRow = Math.floor((box.y + box.height - EPS) / tileSize)
  if (minCol < 0 || minRow < 0 || maxCol >= cols || maxRow >= rows) return false

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (!walkable(tiles[row][col])) return false
    }
  }
  return true
}

/**
 * Move a box by (dx, dy), stopping flush against solid tiles. Axes resolve
 * independently (x first), so hitting a wall on one axis still slides along
 * it on the other, and corners block only the axes actually obstructed.
 */
export function moveBox(
  tiles: readonly (readonly TileId[])[],
  walkable: WalkablePredicate,
  tileSize: number,
  box: Box,
  dx: number,
  dy: number,
): { x: number; y: number } {
  const x = resolveAxis(tiles, walkable, tileSize, box, dx, 'x')
  const y = resolveAxis(tiles, walkable, tileSize, { ...box, x }, dy, 'y')
  return { x, y }
}

function resolveAxis(
  tiles: readonly (readonly TileId[])[],
  walkable: WalkablePredicate,
  tileSize: number,
  box: Box,
  delta: number,
  axis: 'x' | 'y',
): number {
  const start = box[axis]
  if (delta === 0) return start
  const size = axis === 'x' ? box.width : box.height
  const direction = Math.sign(delta)
  let position = start
  let remaining = Math.abs(delta)

  // Advance in substeps of at most one tile, so each substep can enter at
  // most one new tile row/column and a large delta cannot tunnel.
  while (remaining > 0) {
    const step = Math.min(tileSize, remaining)
    const candidate = position + direction * step
    if (!isBoxWalkable(tiles, walkable, tileSize, { ...box, [axis]: candidate })) {
      // The blocker is the tile the leading edge just entered: snap flush
      // against it (never behind the start).
      const flush =
        direction > 0
          ? Math.floor((candidate + size - EPS) / tileSize) * tileSize - size
          : (Math.floor(candidate / tileSize) + 1) * tileSize
      return direction > 0 ? Math.max(start, flush) : Math.min(start, flush)
    }
    position = candidate
    remaining -= step
  }
  return position
}

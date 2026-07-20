/** Numeric tile identifier used in room tile grids (e.g. floor, wall). */
export type TileId = number

export type RoomId =
  | 'hub'
  | 'focus-bear'
  | 'honours-project'
  | 'front-office'
  | 'bartender'
  | 'senior-resident'

export interface GridPosition {
  gridX: number
  gridY: number
}

export interface InfoCard {
  id: string
  title: string
  body: string
  skillTag: string
  outcome: string
}

interface RoomObjectBase extends GridPosition {
  id: string
}

/** An object the player interacts with to open an info card. */
export interface CardObject extends RoomObjectBase {
  kind: 'card'
  cardId: InfoCard['id']
}

/** A door that transitions the player to another room. */
export interface DoorObject extends RoomObjectBase {
  kind: 'door'
  doorTarget: RoomId
  /** Plaque text shown when the player faces the door. */
  label: string
}

export type RoomObject = CardObject | DoorObject

export interface RoomData {
  id: RoomId
  name: string
  /** Row-major grid of TileIds; collision derives from walkable vs solid ids. */
  tiles: TileId[][]
  spawn: GridPosition
  /** Interactable objects and doors, all placed on the tile grid. */
  objects: RoomObject[]
}

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

/** Visual for an interactable, drawn by the render layer as simple shapes. */
export type ObjectSprite = 'clocks' | 'terminal' | 'robot' | 'cabinet' | 'laptop'

/** An object the player interacts with to open an info card. */
export interface CardObject extends RoomObjectBase {
  kind: 'card'
  cardId: InfoCard['id']
  /** Which sprite to draw; when absent the underlying tile shows through. */
  sprite?: ObjectSprite
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
  /** Per-room tile colors, overriding the defaults so each room has its own
   * palette. Keyed by TileId. */
  palette?: Readonly<Record<number, string>>
}

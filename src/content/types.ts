export type RoomId =
  | 'hub'
  | 'focus-bear'
  | 'honours-project'
  | 'front-office'
  | 'bartender'
  | 'senior-resident'

export interface InfoCard {
  id: string
  title: string
  body: string
  skillTag: string
  outcome: string
}

export interface InteractableObjectData {
  id: string
  cardId: InfoCard['id']
  label: string
}

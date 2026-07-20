import type { InfoCard } from './types'

export const CARDS: Readonly<Record<string, InfoCard>> = {
  'about-me': {
    id: 'about-me',
    title: 'About Joseph',
    body:
      'Placeholder copy: Joseph is a software engineer who built this walkable ' +
      'portfolio by hand — TypeScript, React, and a hand-written canvas game ' +
      'loop. Real About Me copy replaces this before launch.',
    skillTag: 'About Me',
    outcome: 'Placeholder outcome: you learned who lives in this office.',
  },
}

export function getCard(id: string): InfoCard | undefined {
  return CARDS[id]
}

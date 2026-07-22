import type { InfoCard } from './types'

export const CARDS: Readonly<Record<string, InfoCard>> = {
  'about-me': {
    id: 'about-me',
    title: 'About Me',
    body:
      "I am Joseph, an early-career software engineer based in Melbourne. I studied Advanced Computing (Honours) and Commerce at ANU, specialising in machine learning. I am looking for a junior backend or full-stack role, ideally with cloud and global users. I am drawn to products with genuine human impact.",
    skillTag: 'Backend / full-stack, AWS, TypeScript & React',
    outcome: '',
  },
  'fb-timezone': {
    id: 'fb-timezone',
    title: 'The Bug That Only Existed at Midnight',
    body:
      "User habit streaks were calculated by a scheduled AWS Lambda job running in GMT+0. For users in Australia, Europe, and Asia, the day rolled over at the wrong local time, so streaks broke or miscounted. I diagnosed the timezone-dependent logic and fixed the calculation to respect each user's local day boundary.",
    skillTag: 'Debugging, AWS Lambda, edge-case thinking',
    outcome: 'Streaks counted correctly for users worldwide, not just those near GMT.',
  },
  'fb-debugging': {
    id: 'fb-debugging',
    title: 'Making the Data Tell the Truth',
    body:
      'I investigated and fixed incorrect values in the database and mismatches between what the backend stored and what the front-end expected. Working through AWS CloudWatch, logs, and the AWS-hosted database, I traced problems to their source rather than patching symptoms.',
    skillTag: 'Backend debugging, AWS CloudWatch, databases',
    outcome: 'Backend and front-end agreed on the data users actually saw.',
  },
  'fb-openai': {
    id: 'fb-openai',
    title: 'Teaching an App to Cheer You On',
    body:
      "I built the feature that generates personalised encouraging messages for users, integrating the OpenAI API with custom tone, context, and personalisation tied to each user's own routines. The goal was messages that felt genuinely supportive to people with ADHD and autism, not generic.",
    skillTag: 'LLM integration, OpenAI API, feature development',
    outcome: 'Users received cheer-up messages tailored to their routines.',
  },
  'fb-compliance': {
    id: 'fb-compliance',
    title: 'Handling Data That Matters',
    body:
      'Focus Bear works with health-related personal data across multiple countries, each with different privacy regulations. I worked within PII and health-data privacy constraints and saw first-hand how compliance differs across jurisdictions when a company runs user research internationally.',
    skillTag: 'PII / health-data privacy, compliance awareness',
    outcome: 'Gained practical exposure to real-world privacy compliance.',
  },
}

export function getCard(id: string): InfoCard | undefined {
  return CARDS[id]
}

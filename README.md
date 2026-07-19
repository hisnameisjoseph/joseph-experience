# joseph-experience
### Project Spec: Walkable 3D Portfolio

## Project Vision

A first-person 3D portfolio website built as a walkable game. The player starts in a hub room (a home office) with five labeled doors. Each door leads to a themed room representing one of Joseph's work experiences. Inside each room, the player walks up to interactable objects and presses E to open an info card describing what Joseph did, the skill demonstrated, and the outcome.

This project itself is a portfolio piece: it demonstrates TypeScript, React, 3D web development, AWS deployment, and AI-accelerated engineering workflow. Code quality matters as much as the visual result, because recruiters and interviewers may read the source.

## Target Audience

1. Recruiters (under 60 seconds of attention): must be able to skip the game via a "Recruiter Mode" button on the start screen that jumps to a summary wall with resume link and contact details.
2. Engineers and hiring managers: will explore the game and possibly the source code.

## Tech Stack (do not deviate without asking)

- Vite + TypeScript (strict mode) + React 18
- React Three Fiber (@react-three/fiber) for 3D rendering
- @react-three/drei for controls, helpers, and common abstractions
- Zustand for global state (current room, active card, settings)
- Vitest + React Testing Library for unit tests on game logic
- Plain CSS modules or a single global stylesheet for UI overlays (no Tailwind, no UI libraries)
- Deployment target: AWS S3 + CloudFront, deployed via GitHub Actions

## Rooms and Content

### Hub: Home Office
- Five doors, each with a plaque: "Backend Intern — Focus Bear", "Honours Project — ANU x Canberra Health Services", "Front Office Associate", "Bartender", "Senior Resident"
- A desk with a laptop: interacting opens the About Me card
- A door or exit sign for Recruiter Mode summary wall

### Room 1: Focus Bear (server room aesthetic)
- Wall of clocks showing different timezones, one glitching red: opens card about the AWS Lambda timezone streak bug fix
- Terminal on a desk: opens card about CloudWatch debugging and backend data fixes
- Friendly robot: opens card about the OpenAI API personalised encouragement feature
- Locked filing cabinet: opens card about PII and health data compliance across jurisdictions

### Room 2: Honours Project (clinic office aesthetic)
- Whiteboard with sprint plan: opens card about project coordination and stakeholder reporting
- Desk phone: opens card about handling team crises, contingency plans, empathetic root cause investigation
- Monitor showing a React app: opens card about leading front-end development, learning TypeScript and React under pressure

### Room 3: Front Office Associate (hotel lobby aesthetic)
- Ringing phone, reception desk, booking screen
- Cards about: communication under pressure, handling difficult people calmly, multitasking, attention to detail

### Room 4: Bartender (bar aesthetic)
- Bar counter, drink shelf, order docket
- Cards about: reading people quickly, composure during rush, memory and precision, teamwork in chaos

### Room 5: Senior Resident (dorm common room aesthetic)
- Couch, notice board, door with a knock sound
- Cards about: leadership, pastoral care, conflict resolution, being the trusted person at 2am

Card copy will be provided in `content/cards.ts` as typed data. Rooms read from this data file; never hardcode card text inside components.

## Architecture Rules

- Folder structure:
  - `src/components/` reusable 3D and UI components (Door, InteractableObject, InfoCard, Player)
  - `src/rooms/` one file per room, each exporting a Room component
  - `src/content/` typed data files for card copy and room metadata
  - `src/store/` Zustand stores
  - `src/hooks/` custom hooks (useInteraction, useRoomTransition)
- Every component small and single-purpose. If a file exceeds roughly 150 lines, propose a split.
- All card and room content typed with shared interfaces in `src/content/types.ts`.
- No `any`. Strict TypeScript throughout.
- Game logic (interaction distance checks, room state transitions) must be in pure functions or hooks that can be unit tested without rendering 3D.

## Code Style

- Functional components with hooks only
- Named exports, no default exports except route level
- Descriptive variable names, no abbreviations like `pos` or `btn`
- Comments only where the why is not obvious; no comment noise
- Commit style: conventional commits (feat:, fix:, chore:, docs:)

## Performance Constraints

- Must run at 60fps on a mid-range laptop with integrated graphics
- Use simple geometry (boxes, planes, cylinders) and baked colors or simple materials; no heavy textures or imported models in v1
- Lazy load rooms: only the hub loads initially; rooms load on door interaction
- Keep total bundle reasonable; check with `npx vite build` output

## Accessibility and Fallbacks

- Start screen explains controls: WASD to move, mouse to look, E to interact, Esc to close cards
- Recruiter Mode: a plain scrollable HTML page with all card content, resume link, GitHub, LinkedIn, email
- Mobile: detect touch devices and show Recruiter Mode by default with a note that the full experience is desktop only (v1 scope; touch controls may come later)
- Info cards must be readable: minimum 16px text, high contrast

## Workflow Rules for Claude

1. Build exactly one feature per session or prompt. Do not scaffold ahead of what is asked.
2. After implementing, briefly explain what was added and how to test it manually in the browser.
3. If a requirement is ambiguous, ask one clarifying question instead of guessing.
4. If you change any file not directly related to the current feature, call it out explicitly.
5. Update `DECISIONS.md` with a one-line entry whenever a meaningful technical choice is made (library, pattern, tradeoff).
6. Never delete or rewrite card content without being asked.
7. Keep all work compatible with the deployment target (static site on S3; no server side code).

## Definition of Done (v1 MVP)

- Hub room plus Focus Bear room fully working
- First-person movement with wall collision
- Door transition between hub and Focus Bear room
- At least two interactable objects with info cards in Focus Bear room
- Start screen with controls explanation and Recruiter Mode link
- Recruiter Mode page with all content readable
- Deployed live on S3 + CloudFront via GitHub Actions
- README covering architecture, how to run locally, and the AI-assisted workflow

Rooms 3, 4, 5 and polish (sound, lighting mood, animations) come only after the MVP is deployed.

# CLAUDE.md — Project Spec: Walkable 2D Pixel Portfolio

## Project Vision

A top-down 2D pixel-art portfolio website built as a walkable game. The player starts in a hub room (a home office) with five labeled doors. Each door leads to a themed room representing one of Joseph's work experiences. Inside each room, the player walks up to interactable objects and presses E (or taps an action button on mobile) to open an info card describing what Joseph did, the skill demonstrated, and the outcome.

Design priority: fast loading and broad device support. This must run smoothly on cheap laptops and mid-range phones over slow connections. Lightweight beats flashy in every tradeoff. This decision itself is part of the portfolio story: user-centric engineering over visual showing off.

This project is a portfolio piece: it demonstrates TypeScript, React, hand-written game logic, AWS deployment, and an AI-accelerated engineering workflow. Code quality matters as much as the visual result, because recruiters and interviewers may read the source.

## Target Audience

1. Recruiters (under 60 seconds of attention): must be able to skip the game via a "Recruiter Mode" button on the start screen that jumps to a summary wall with resume link and contact details.
2. Engineers and hiring managers: will explore the game and possibly the source code.

## Tech Stack (do not deviate without asking)

- Vite + TypeScript (strict mode) + React 18
- Game rendering: plain HTML5 Canvas 2D API, hand-written game loop. NO game engine or rendering library (no Phaser, no PixiJS, no Kaplay). This is deliberate: minimal bundle size and demonstrable fundamentals.
- React is used ONLY for the UI layer: start screen, info card overlays, HUD hints, Recruiter Mode, touch controls. The game canvas is a single React component that owns the loop.
- Zustand for shared state between the game loop and React UI (current room, active card, game paused)
- Vitest + React Testing Library for unit tests on game logic
- Plain CSS (modules or one global stylesheet). No Tailwind, no UI libraries.
- Deployment target: AWS S3 + CloudFront, deployed via GitHub Actions

If @react-three/fiber, @react-three/drei, or three are present in package.json from earlier scaffolding, remove them.

## Visual Style

- Top-down view, classic 16-bit RPG feel (rooms viewed from above, character walks in four directions)
- Pixel art rendered crisply: imageSmoothingEnabled = false, integer scaling, low internal resolution (roughly 320x180 or 400x225) scaled up to fit the screen
- v1 uses NO image assets: draw tiles, character, and objects as colored rectangles and simple shapes directly on canvas. Sprite images may replace them later without changing game logic.
- Each room has a distinct color palette matching its theme

## Controls

- Desktop: WASD or arrow keys to move, E to interact, Esc to close cards
- Mobile/touch: on-screen D-pad (bottom left) and action button (bottom right), rendered as React components; same game runs on phones, not a cut-down fallback
- Interaction: when the player is adjacent to and facing an interactable object or door, show a floating hint; pressing E/action triggers it

## Rooms and Content

### Hub: Home Office
- Five doors, each with a plaque: "Backend Intern — Focus Bear", "Honours Project — ANU x Canberra Health Services", "Front Office Associate", "Bartender", "Senior Resident"
- A desk with a laptop: interacting opens the About Me card
- A marked exit or sign for Recruiter Mode summary wall

### Room 1: Focus Bear (server room palette: dark blues, glowing cyan)
- Wall of clocks, one flashing red: card about the AWS Lambda timezone streak bug fix
- Terminal desk: card about CloudWatch debugging and backend data fixes
- Small friendly robot: card about the OpenAI API personalised encouragement feature
- Filing cabinet: card about PII and health data compliance across jurisdictions

### Room 2: Honours Project (clinic palette: whites, soft greens)
- Whiteboard: card about project coordination and stakeholder reporting
- Desk phone: card about handling team crises, contingency plans, empathetic root cause investigation
- Computer monitor: card about leading front-end development, learning TypeScript and React under pressure

### Room 3: Front Office Associate (hotel lobby palette: warm golds, reds)
- Reception desk, ringing phone, booking screen
- Cards about: communication under pressure, handling difficult people calmly, multitasking, attention to detail

### Room 4: Bartender (bar palette: dark wood browns, amber)
- Bar counter, drink shelf, order docket
- Cards about: reading people quickly, composure during rush, memory and precision, teamwork in chaos

### Room 5: Senior Resident (dorm palette: cozy purples, warm lamp light)
- Couch, notice board, door
- Cards about: leadership, pastoral care, conflict resolution, being the trusted person at 2am

Card copy lives in `src/content/cards.ts` as typed data. Room layouts (tile maps, object positions, door positions) live in `src/content/rooms/` as typed data. Components and the game loop read from data; never hardcode content in logic.

## Architecture Rules

- Folder structure:
  - `src/game/` the engine: game loop, renderer, input handling, collision, interaction checks. Pure TypeScript, no React imports.
  - `src/components/` React UI: GameCanvas, InfoCard, StartScreen, TouchControls, RecruiterMode
  - `src/content/` typed data: cards.ts, rooms/, types.ts
  - `src/store/` Zustand stores
- The game world is a tile grid. Each room is a 2D array of tile ids plus a list of objects (position, cardId or doorTarget). Collision is tile-based: walkable vs solid tiles.
- Game logic (movement, collision, adjacency/facing checks, room transitions) must be pure functions in `src/game/`, unit tested without a canvas.
- The render function is the only place that touches the canvas context.
- Every file small and single-purpose. If a file exceeds roughly 150 lines, propose a split.
- No `any`. Strict TypeScript throughout.

## Performance Constraints

- Total JS bundle under 200KB gzipped for the game experience (React included)
- No image, audio, or font assets over the network in v1 beyond system fonts and one small pixel font if needed
- Steady 60fps on low-end devices; the loop uses requestAnimationFrame with delta time
- First meaningful load under 2 seconds on a slow 3G connection

## Accessibility

- Start screen explains controls for both desktop and touch
- Recruiter Mode: a plain scrollable HTML page with all card content, resume link, GitHub, LinkedIn, email; linked from the start screen and reachable in-game
- Info cards are HTML overlays (not canvas text): minimum 16px, high contrast, closable by Esc, close button, or tapping outside
- Game pauses while a card is open

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
- Top-down movement with tile collision, on desktop and touch
- Door transition between hub and Focus Bear room
- At least two interactable objects with info cards in Focus Bear room
- Start screen with controls explanation and Recruiter Mode link
- Recruiter Mode page with all content readable
- Bundle and load-time budgets met
- Deployed live on S3 + CloudFront via GitHub Actions
- README covering architecture, how to run locally, and the AI-assisted workflow

Rooms 3, 4, 5 and polish (sprite art, sound, animations) come only after the MVP is deployed.

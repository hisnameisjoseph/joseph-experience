# Decisions

- 2026-07-19: Pinned @react-three/fiber v8 and @react-three/drei v9 (not latest v9/v10) because the newer majors require React 19 and the spec mandates React 18.
- 2026-07-20: Pivoted to a 2D canvas game per revised spec: removed three/@react-three/fiber/@react-three/drei entirely; game engine will be hand-written Canvas 2D in src/game/ with no rendering library.
- 2026-07-20: Modeled RoomObject as a discriminated union (kind: 'card' | 'door') so cardId/doorTarget are required exactly when applicable, instead of optional fields on one interface.
- 2026-07-20: Canvas scaling done in CSS (fixed 400x225 backing store, CSS size = largest integer multiple, image-rendering: pixelated) rather than resizing the backing store — game code always draws in one coordinate space.
- 2026-07-20: Keyboard input keys matched by physical position (KeyboardEvent.code) so WASD works on non-QWERTY layouts; on diagonal movement the current facing is kept while still held, so facing never flickers.

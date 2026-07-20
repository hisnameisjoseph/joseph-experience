export type FrameCallback = (deltaSeconds: number) => void

export interface GameLoop {
  start(): void
  stop(): void
}

/**
 * requestAnimationFrame loop reporting delta time in seconds. Delta is capped
 * so a background tab or long pause cannot produce a huge simulation step.
 */
const MAX_DELTA_SECONDS = 0.1

export function createGameLoop(onFrame: FrameCallback): GameLoop {
  let rafId: number | null = null
  let lastTime: number | null = null

  const tick = (now: number): void => {
    const deltaSeconds =
      lastTime === null ? 0 : Math.min((now - lastTime) / 1000, MAX_DELTA_SECONDS)
    lastTime = now
    onFrame(deltaSeconds)
    rafId = requestAnimationFrame(tick)
  }

  return {
    start() {
      if (rafId !== null) return
      lastTime = null
      rafId = requestAnimationFrame(tick)
    },
    stop() {
      if (rafId === null) return
      cancelAnimationFrame(rafId)
      rafId = null
      lastTime = null
    },
  }
}

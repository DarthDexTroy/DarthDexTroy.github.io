// Shared seconds keep the WebGL box and DOM technologies on one timeline.
export const REVEAL_DURATION = 2.8
export const EMERGE_AT = 0.95
export const progress = (time, start, duration) => Math.min(1, Math.max(0, (time - start) / duration))
export const easeOut = (value) => 1 - (1 - value) ** 3
export const revealTime = (reveal) => reveal.current.startedAt === null
  ? 0 : (performance.now() - reveal.current.startedAt) / 1000

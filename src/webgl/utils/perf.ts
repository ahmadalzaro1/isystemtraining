export const isMobileUA = () => /iphone|ipad|ipod|android/i.test(navigator.userAgent)

export const detectLowEnd = () => {
  const cores = (navigator as any).hardwareConcurrency ?? 4
  const mem = (navigator as any).deviceMemory ?? 4
  return cores <= 4 || mem <= 4
}

export const capDpr = (cap: number) => Math.min(window.devicePixelRatio || 1, cap)

export function onVisibilityChange(pause: () => void, resume: () => void) {
  const handler = () => (document.hidden ? pause() : resume())
  document.addEventListener('visibilitychange', handler, { passive: true })
  return () => document.removeEventListener('visibilitychange', handler)
}

export function watchFrameBudget(sample = 30) {
  let frames = 0
  let acc = 0
  let last = performance.now()
  let cb: ((avgMs: number) => void) | null = null

  function onFrame() {
    const now = performance.now()
    const dt = now - last
    last = now
    acc += dt
    frames++
    if (frames >= sample) {
      const avg = acc / frames
      cb?.(avg)
      frames = 0
      acc = 0
    }
    requestAnimationFrame(onFrame)
  }
  requestAnimationFrame(onFrame)

  return {
    onAverage: (fn: (avgMs: number) => void) => { cb = fn },
  }
}

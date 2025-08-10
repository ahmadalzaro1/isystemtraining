import { create } from 'zustand'

interface PointerNDC { x: number; y: number }

interface WebGLState {
  isMobile: boolean
  lowEnd: boolean
  respectsReducedMotion: boolean
  dprCap: number
  particleSide: number
  enableEffects: boolean
  timeScale: number
  pointer: PointerNDC
  setPointer: (p: PointerNDC) => void
  setTimeScale: (t: number) => void
  setEnableEffects: (v: boolean) => void
}

const isMobileUA = () => /iphone|ipad|ipod|android/i.test(navigator.userAgent)

const detectLowEnd = () => {
  const cores = (navigator as any).hardwareConcurrency ?? 4
  const mem = (navigator as any).deviceMemory ?? 4
  return cores <= 4 || mem <= 4
}

const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const computeDprCap = (mobile: boolean, lowEnd: boolean) => {
  const cap = mobile ? 1.5 : 2
  return lowEnd ? Math.min(cap, 1.25) : cap
}

export const useWebGLStore = create<WebGLState>((set, get) => {
  const mobile = isMobileUA()
  const lowEnd = detectLowEnd()
  const reduced = prefersReduced()
  const dprCap = computeDprCap(mobile, lowEnd)
  return {
    isMobile: mobile,
    lowEnd,
    respectsReducedMotion: reduced,
    dprCap,
    particleSide: lowEnd || mobile ? 128 : 256,
    enableEffects: !(lowEnd || mobile || reduced),
    timeScale: reduced ? 0.8 : 1,
    pointer: { x: 0, y: 0 },
    setPointer: (p) => {
      if (document.hidden) return
      set({ pointer: p })
    },
    setTimeScale: (t) => set({ timeScale: Math.max(0.5, Math.min(2, t)) }),
    setEnableEffects: (v) => set({ enableEffects: v })
  }
})

import { useEffect } from 'react'
import { useWebGLStore } from './store'

export function Interaction() {
  const setPointer = useWebGLStore(s => s.setPointer)
  const setTimeScale = useWebGLStore(s => s.setTimeScale)
  const reduced = useWebGLStore(s => s.respectsReducedMotion)

  useEffect(() => {
    let raf = 0
    let px = 0, py = 0

    const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let clientX = 0, clientY = 0
      if ('touches' in e && e.touches[0]) {
        clientX = e.touches[0].clientX; clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX; clientY = (e as MouseEvent).clientY
      }
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -((clientY / window.innerHeight) * 2 - 1)
      px = x; py = y
      if (!raf) raf = requestAnimationFrame(() => {
        setPointer({ x: px, y: py })
        raf = 0
      })
    }

    const onWheel = (e: WheelEvent) => {
      const delta = Math.sign(e.deltaY) * -0.05
      const current = useWebGLStore.getState().timeScale
      const next = Math.max(0.5, Math.min(2, current + delta))
      setTimeScale(next)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('wheel', onWheel)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [setPointer, setTimeScale])

  useEffect(() => {
    if (reduced) setTimeScale(0.8)
  }, [reduced, setTimeScale])

  return null
}

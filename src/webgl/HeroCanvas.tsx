import * as THREE from 'three'
import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useWebGLStore } from './store'
import { Interaction } from './Interaction'
import { PostFX } from './PostFX'
import { Particles } from './Particles'
import { onVisibilityChange, watchFrameBudget, capDpr } from './utils/perf'

export default function HeroCanvas() {
  const dprCap = useWebGLStore(s => s.dprCap)
  const enableEffects = useWebGLStore(s => s.enableEffects)
  const setEnableEffects = useWebGLStore(s => s.setEnableEffects)

  useEffect(() => {
    const budget = watchFrameBudget(45)
    budget.onAverage((avg) => {
      // If avg frame exceeds ~22ms (~45 FPS), disable heavy effects
      if (avg > 22 && enableEffects) setEnableEffects(false)
    })
  }, [enableEffects, setEnableEffects])

  const glProps = useMemo(() => ({
    antialias: false,
    powerPreference: 'high-performance' as const,
    preserveDrawingBuffer: false,
  }), [])

  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, dprCap]}
      gl={glProps}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1
        gl.setClearColor(0x000000, 1)
        const cleanup = onVisibilityChange(() => {}, () => {})
        // Ensure DPR is capped at runtime too
        const set = () => gl.setPixelRatio(capDpr(dprCap))
        set(); window.addEventListener('resize', set)
        return () => { window.removeEventListener('resize', set); cleanup() }
      }}
      frameloop="always"
    >
      <Interaction />
      <Particles />
      <PostFX />
    </Canvas>
  )
}

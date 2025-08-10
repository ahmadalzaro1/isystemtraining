import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { Vector2 } from 'three'
import { useWebGLStore } from './store'

const DISABLE_POSTFX = import.meta.env.VITE_DISABLE_POSTFX === '1'

export function PostFX() {
  const enable = useWebGLStore(s => s.enableEffects)
  const lowEnd = useWebGLStore(s => s.lowEnd)
  if (DISABLE_POSTFX || !enable || lowEnd) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.8} luminanceSmoothing={0.2} />
      <ChromaticAberration {...({ offset: new Vector2(0.0015, 0.001) } as any)} />
      {!lowEnd && <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={1.3} />}
    </EffectComposer>
  )
}

import * as THREE from 'three'
import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import vert from './shaders/particle.vert'
import frag from './shaders/particle.frag'
import { useWebGLStore } from './store'
import { createGPGPU } from './sim/gpgpu'

export function Particles() {
  const side = useWebGLStore(s => s.particleSide)
  const timeScale = useWebGLStore(s => s.timeScale)
  const { gl } = useThree()

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const count = side * side
    const uvs = new Float32Array(count * 2)
    const positions = new Float32Array(count * 3)
    let ptr = 0
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        uvs[ptr++] = x / (side - 1)
        uvs[ptr++] = y / (side - 1)
      }
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // Points don't require an index buffer

    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      }
    })
    return { geometry: geo, material: mat }
  }, [side])

  useMemo(() => {
    // Initialize placeholder GPGPU so materials can later sample textures
    createGPGPU(side, gl)
  }, [gl, side])

  return (
    <points geometry={geometry} material={material} />
  )
}

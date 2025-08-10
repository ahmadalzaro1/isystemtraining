// Minimal GPGPU placeholders to keep types compiling; expand with full sim later
import * as THREE from 'three'

export interface GPGPUHandles {
  size: number
  pos: THREE.Texture
  vel: THREE.Texture
}

export function createGPGPU(size: number, renderer: THREE.WebGLRenderer): GPGPUHandles {
  // Placeholder: create small 1x1 data textures to satisfy material inputs
  const texOpts = { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType as THREE.TextureDataType }
  const pos = new THREE.DataTexture(new Float32Array([0,0,0,1]), 1, 1, THREE.RGBAFormat, THREE.FloatType)
  const vel = new THREE.DataTexture(new Float32Array([0,0,0,1]), 1, 1, THREE.RGBAFormat, THREE.FloatType)
  pos.needsUpdate = vel.needsUpdate = true
  Object.assign(pos, texOpts); Object.assign(vel, texOpts)
  return { size, pos, vel }
}

export function stepGPGPU(_handles: GPGPUHandles, _dt: number) {
  // Placeholder: no-op for now
}

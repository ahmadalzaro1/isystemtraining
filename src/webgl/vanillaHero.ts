export async function mountVanillaHero(canvas: HTMLCanvasElement) {
  // Detect reduced-motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Init Three.js
  const THREE = await import('three');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: false, 
    powerPreference: 'high-performance', 
    alpha: true 
  });
  
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0); // transparent
  
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(2, 2);
  
  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uIntensity: { value: 0.6 },
    uTint: { value: new THREE.Color('#5aa8ff') }
  };
  
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime, uScroll, uIntensity;
      uniform vec3 uTint;
      
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        float a = hash(i), b = hash(i + vec2(1., 0.)), c = hash(i + vec2(0., 1.)), d = hash(i + vec2(1., 1.));
        vec2 u = f * f * (3. - 2. * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1. - u.x) + (d - b) * u.x * u.y;
      }
      
      float fbm(vec2 p) {
        float v = 0.;
        float a = 0.5;
        for(int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }
      
      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.06;
        float s = fbm(uv * 3.0 + vec2(0., t));
        float flow = fbm(uv * 3.0 + vec2(t * 0.7, 0.));
        float m = mix(s, flow, 0.5 + 0.5 * sin(t * 0.4));
        m = pow(m, 1.4);
        
        float alpha = smoothstep(0.15, 0.95, m) * (0.35 + 0.35 * uIntensity);
        vec3 col = mix(vec3(1.0), uTint, 0.25 + 0.55 * m);
        col += 0.04 * vec3(sin(uv.y * 20.0 + t), 0.0, sin(uv.x * 22.0 - t)) * uIntensity * 0.25;
        col = clamp(col, 0.0, 1.0);
        
        alpha *= 0.8 + 0.2 * uScroll; // more presence as you scroll
        
        if(alpha < 0.01) discard;
        gl_FragColor = vec4(col, alpha);
      }
    `
  });
  
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  
  let raf = 0;
  const t0 = performance.now();
  
  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize, { passive: true });
  
  let scrollN = 0;
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollN = h > 0 ? window.scrollY / h : 0;
    uniforms.uScroll.value = scrollN;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  
  function loop() {
    const t = performance.now();
    uniforms.uTime.value = (t - t0) * (reduce ? 0.4 : 1.0);
    uniforms.uIntensity.value = reduce ? 0.3 : 0.6;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    renderer.dispose();
    geo.dispose();
    mat.dispose();
  };
}
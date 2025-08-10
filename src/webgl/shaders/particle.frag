// particle.frag (placeholder)
#ifdef GL_ES
precision mediump float;
#endif

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = clamp(1.0 - dot(p,p), 0.0, 1.0);
  vec3 col = mix(vec3(0.0), vec3(0.6,0.75,1.0), d);
  gl_FragColor = vec4(col, d);
}

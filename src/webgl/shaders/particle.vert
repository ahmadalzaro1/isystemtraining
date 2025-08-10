// particle.vert (placeholder)
#ifdef GL_ES
precision highp float;
#endif

attribute vec2 uv;
uniform float uTime;

void main() {
  vec3 pos = vec3(uv * 2.0 - 1.0, 0.0);
  gl_Position = vec4(pos, 1.0);
  gl_PointSize = 1.5;
}

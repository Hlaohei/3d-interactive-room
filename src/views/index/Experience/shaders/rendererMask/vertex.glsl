varying vec2 vUv;

void main() {
  // 将顶点位置传递给片段着色器
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
  vUv = uv;
}
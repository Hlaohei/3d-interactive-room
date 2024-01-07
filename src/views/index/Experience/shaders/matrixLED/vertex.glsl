varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  
  vUv = uv;
  vPosition = position;
  vColor = instanceColor;
}
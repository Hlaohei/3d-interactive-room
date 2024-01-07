uniform vec3 uBaseColor;
uniform float uColorStrength;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

void main()
{
  // 计算片元到中心点的距离
  float distance = length(vUv - vec2(0.5));
  
  // 计算颜色的混合强度
  float blendStrength = 1.5 - distance;
  
  // 调整颜色的亮度
  vec3 blendedColor = vColor * blendStrength * uColorStrength;
  
  // 叠加一层不变的基础色
  blendedColor += uBaseColor;
  
  // 输出最终的颜色
  gl_FragColor = vec4(blendedColor, 1.0);
}
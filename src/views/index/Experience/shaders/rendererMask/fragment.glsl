uniform sampler2D tDiffuse; // 输入纹理
uniform float blurRadius; // 模糊半径
uniform float darkRadius; // 变暗半径
uniform float darkIntensity; // 变暗强度

varying vec2 vUv;

void main() {
  // 获取当前像素坐标
  vec2 uv = vUv;
  // 计算当前像素距离屏幕中心的距离
  float dist = distance(uv, vec2(0.5, 0.5));
  // 计算模糊系数，距离越远，模糊越大
  float blur = smoothstep(blurRadius, 1.0, dist);
  // 计算变暗系数，距离越远，变暗越大
  float dark = smoothstep(darkRadius, 1.0, dist) * darkIntensity;
  // 获取输入纹理中当前像素的颜色
  vec4 color = texture2D(tDiffuse, uv);
  // 根据模糊系数对颜色进行混合
  color = mix(color, vec4(0.0), blur);
  // 根据变暗系数对颜色进行混合
  color = mix(color, vec4(0.0), dark);
  // 输出最终颜色
  gl_FragColor = color;
}
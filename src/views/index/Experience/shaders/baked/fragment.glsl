uniform sampler2D uBakedLightOffTexture;
uniform sampler2D uBakedLightOnTexture;
uniform sampler2D uBakedLightsTexture;

uniform float uLightMix;

uniform vec3 uLightColor;
uniform float uLightStrength;

varying vec2 vUv;

// NOTE: 加载方式有问题，先不管了
// #pragma glslify: blend = require(glsl-blend/add)
// #pragma glslify:blend = require(glsl-blend/lighten)
// #pragma glslify: blend = require(glsl-blend/normal)
// #pragma glslify: blend = require(glsl-blend/screen)

/**
* 手动复制上面的方法
*/
float blendLighten(float base, float blend) {
  return max(blend, base);
}
vec3 blendLighten(vec3 base, vec3 blend) {
  return vec3(blendLighten(base.r, blend.r), blendLighten(base.g, blend.g), blendLighten(base.b, blend.b));
}
vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
  return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
  
  vec3 bakedLightOffColor = texture2D(uBakedLightOffTexture, vUv).rgb;
  vec3 bakedLightOnColor = texture2D(uBakedLightOnTexture, vUv).rgb;
  
  vec3 bakedColor = mix(bakedLightOffColor, bakedLightOnColor, uLightMix);
  
  vec3 bakedLightsColor = texture2D(uBakedLightsTexture, vUv).rgb;
  
  float lightStrength = bakedLightsColor.r * uLightStrength;
  
  vec3 finalColor = blendLighten(bakedColor, uLightColor, lightStrength);
  
  gl_FragColor = vec4(finalColor, 1.0);
}

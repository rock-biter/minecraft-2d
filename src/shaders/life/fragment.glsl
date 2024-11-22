precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D uDiffuse;
uniform float uLife;
uniform float uMaxLife;

varying vec2 vUv;


void main() {
  vec2 uv = vUv;
  uv.x = mod(vUv.x * uMaxLife, 1.);
  vec4 color = texture( uDiffuse, uv );
  // vec4 color = vec4(vUv,uDepth * 0.25,1.);

  float tpc = 1. - step(vUv.x,uLife / uMaxLife);

  color.rgb = mix(color.rgb,vec3(0.),tpc);

  // lighten a bit
  gl_FragColor = color;

}
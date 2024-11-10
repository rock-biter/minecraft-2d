precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray uDiffuse;
uniform float uDepth;

varying vec3 vUv;
varying float vBrigth;
varying float vOpacity;


void main() {

  vec4 color = texture( uDiffuse, vUv );
  // vec4 color = vec4(vUv,uDepth * 0.25,1.);

  if(vBrigth > 0.) {
    color.rgb = mix(color.rgb,vec3(0.541,0.878,1.),vBrigth);
  }

  if(vBrigth < 0.) {
    color.rgb = mix(color.rgb,vec3(0.,0.,0.),-vBrigth);
  }

  // lighten a bit
  gl_FragColor = vec4( color.rgb, vOpacity);

}
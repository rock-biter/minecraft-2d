precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray uDiffuse;
varying vec3 vUv;
uniform float uDepth;


void main() {

  vec4 color = texture( uDiffuse, vUv );
  // vec4 color = vec4(vUv,uDepth * 0.25,1.);

  // lighten a bit
  gl_FragColor = vec4( color.rgb, 1.0 );

}
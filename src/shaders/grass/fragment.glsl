precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray uDiffuse;
uniform float uDepth;
uniform vec3 uColor;

varying vec3 vUv;
varying float vBrigth;
varying float vOpacity;


void main() {

  vec4 color = texture( uDiffuse, vUv );
  // vec4 color = vec4(vUv,uDepth * 0.25,1.);

  if(vUv.z == 8.) {
    // top grass
    vec4 g_color = texture( uDiffuse, vec3(0.,0.,1.) );
    color.rgb -= vec3(0.678);
    color.rgb += g_color.rgb;
  }

  // lighten a bit
  gl_FragColor = vec4( color.rgb, vOpacity);


}
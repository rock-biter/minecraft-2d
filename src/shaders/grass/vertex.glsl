uniform vec2 size;

attribute vec3 aUv;
attribute float aBright;
attribute float aOpacity;

varying vec3 vUv;
varying float vBrigth;
varying float vOpacity;

void main() {

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  vUv.xyz = aUv.xyz;
  vUv.y = 1. - vUv.y;

  vBrigth = aBright;
  vOpacity = aOpacity;

}
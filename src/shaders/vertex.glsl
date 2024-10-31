uniform vec2 size;
varying vec3 vUv;
attribute vec3 aUv;

void main() {

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  vUv.xyz = aUv.xyz;
  vUv.y = 1. - vUv.y;

}
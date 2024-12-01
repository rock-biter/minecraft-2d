uniform float uLife;
uniform float uMaxLife;

varying vec2 vUv;

void main() {

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  vUv.xy = uv.xy;

}
import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, ShaderMaterial, Texture } from "three";
import Game from "../Game";
import Events from "./Events";
import fragment from '../shaders/life/fragment.glsl'
import vertex from '../shaders/life/vertex.glsl'

export default class Life extends Events {

  _points: number
  game: Game
  geometry!: PlaneGeometry
  mesh!: Mesh
  material!: MeshBasicMaterial | ShaderMaterial
  MAX_LIFE = 10
  uniforms = {
    uLife: { value: 0},
    uMaxLife: { value: 0},
    uDiffuse: { value: new Texture() }
  }

  constructor(points = 10) {
    super()

    this.MAX_LIFE = points
    this.uniforms.uMaxLife.value = this.MAX_LIFE
    this.uniforms.uLife.value = this.MAX_LIFE
    this._points = points
    this.game = new Game()

    this.createMesh()

  }

  get scene() {
    return this.game.world.scene
  }

  get resources() {
    return this.game.resources
  }

  set points(pts: number) {

    this._points = Math.min(pts,this.MAX_LIFE)
    this.uniforms.uLife.value = this._points
    this.onPointsChange()

  }

  get points() {
    return this._points
  }

  onPointsChange() {
    // this.geometry = this.getGeometry()
    // this.mesh.geometry = this.geometry
    // if (this.material.map)
    //   this.material.map.repeat.x = this.points
  }

  getGeometry() {
    const geometry = new PlaneGeometry(this.points,1)
  //  geometry.translate(-this._points/2 + 0.5,0,0)

   return geometry
  }

  createMesh() {

    const texture = this.resources.items['heart'] as Texture
    this.uniforms.uDiffuse.value = texture
    this.geometry = this.getGeometry()
    // this.material = new MeshBasicMaterial({
    //   map: texture,
    //   transparent: true
    // })
    // TODO add debug material
    this.material = this.getMaterial()

    this.mesh = new Mesh(this.geometry,this.material)
    this.mesh.scale.setScalar(0.5)
    this.mesh.position.set(0,-7,-420)
    this.game.view.camera.add(this.mesh)

  }

  getMaterial() {
    return new ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: fragment,
      vertexShader: vertex,
      transparent: true,
    })
  }

}
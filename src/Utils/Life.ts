import { Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, Texture } from "three";
import Game from "../Game";
import Events from "./Events";

export default class Life extends Events {

  _points: number
  game: Game
  geometry!: PlaneGeometry
  mesh!: Mesh
  material!: MeshBasicMaterial
  MAX_LIFE = 10

  constructor(points = 10) {
    super()

    this.MAX_LIFE = points
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
    this.onPointsChange()

  }

  get points() {
    return this._points
  }

  onPointsChange() {
    this.geometry = this.getGeometry()
    this.mesh.geometry = this.geometry
    if (this.material.map)
      this.material.map.repeat.x = this.points
  }

  getGeometry() {
    const geometry = new PlaneGeometry(this.points,1)
  //  geometry.translate(-this._points/2 + 0.5,0,0)

   return geometry
  }

  createMesh() {
    const texture = this.resources.items['heart'] as Texture
    texture.wrapS = RepeatWrapping
    texture.repeat.x = this.points
    this.geometry = this.getGeometry()
    this.material = new MeshBasicMaterial({
      map: texture,
      transparent: true
    })

    this.mesh = new Mesh(this.geometry,this.material)
    this.mesh.scale.setScalar(0.5)
    this.mesh.position.set(0,-5.5,-20)
    this.game.view.camera.add(this.mesh)

  }

}
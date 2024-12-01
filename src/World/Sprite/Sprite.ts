import { Mesh, MeshBasicMaterial, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from "three";
import Game from "../../Game";
import { Entity } from "../../Types/entity.types";
import Debug from "../../Utils/Debug";

export default class Sprite {

  game: Game
  entity!: Entity
  position: Vector3
  width: number
  height: number

  constructor({ position = new Vector3(), height = 1, width = 1}) {

    this.game = new Game()
    this.position = position
    this.width = width
    this.height = height

    this.create()

  }

  get debug(): Debug {
    return this.game.debug
  }

  get scene(): Scene {
    return this.game.world.scene
  }

  get material(): MeshBasicMaterial | ShaderMaterial {
    return new MeshBasicMaterial({ color: 0xffffff })
  }

  create() {
    this.entity = {}

    this.entity.mesh = this.getMesh()
  }

  getMesh() {
    const mesh = new Mesh(this.getGeometry(),this.material)
    mesh.position.copy(this.position)
    this.scene.add(mesh)
    mesh.renderOrder = 5
    return mesh
  }

  getGeometry() {
    
    const plane = new PlaneGeometry(this.width,this.height)

    return plane
  }

}
import { BoxGeometry, Mesh, MeshStandardMaterial, Plane, PlaneGeometry, Scene, Vector3 } from "three";
import Game from "../Game";
import Physics from "../Physics";
import Resources from "../Utils/Resources";
import { Entity } from "../Types/entity.types";
import RAPIER from "@dimforge/rapier3d";
import { CollideArg } from "../Types/callbacks.types";

export default class Ladder {

  game: Game
  scene: Scene
  physics: Physics
  resources: Resources
  position: Vector3 
  length: number
  textureName = 'LADDER'
  entity!: Entity

  constructor(position = new Vector3(), length: number) {
    this.game = new Game()
    this.scene = this.game.world.scene
    this.resources = this.game.resources
    this.physics = this.game.physics

    this.position = position
    this.length = length

    this.create(position,length)
  }

  create(position: Vector3, length: number) {

    this.entity = {}

    const mesh = this.getMesh(position,length)
    this.entity.mesh = mesh
    this.entity.collider = this.getCollider(position,length)
    this.scene.add(mesh)

  }

  getMesh(position: Vector3, length: number) {

    const material = new MeshStandardMaterial({ color: 'black'})
    const geometry = new PlaneGeometry(1,length)
    geometry.translate(0,-length/2 + 0.5,0)
    const mesh = new Mesh(
			geometry,
			material
		)

    mesh.position.copy(position)
    return mesh
  }

  getCollider(position: Vector3, height = 1) {

    const {x,y,z} = position
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.25,height/2,0.5)
    .setTranslation(x, y - height/2 + 0.5, z)
    .setSensor(true)

    const {collider} = this.physics.addSensor(colliderDesc)

    this.physics.on('collide',(arg) => {
      const {handle1, handle2, started} = arg as CollideArg
			if(!this.entity || !this.entity?.collider || !this.game.world.player) return

      if ([handle1, handle2].includes(this.entity?.collider?.handle)) {
        console.log('collision with ladder')

        this.game.world.player.isOnLadder = started

      }
    })

    return collider


  }



}
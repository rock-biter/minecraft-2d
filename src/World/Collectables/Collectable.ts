import { Color, DoubleSide, Mesh, MeshBasicMaterial,  PlaneGeometry, Texture, Vector3 } from "three";
import Game from "../../Game";
import Events from "../../Utils/Events";
import { Entity } from "../../Types/entity.types";
import gsap from "gsap";
import { CollideArg } from "../../Types/callbacks.types";
import RAPIER from "@dimforge/rapier3d";
import { bodyType, getRigidBodyDesc } from "../../Utils/BodyTypes";

export default class Collectable extends Events {

  game: Game
  position: Vector3
  entity!: Entity
  texture?: Texture
  size = 0.8

  constructor(position = new Vector3() ) {
    super()

    this.game = new Game()
    this.position = position

  }

  get physics() {
    return this.game.physics
  }

  get scene() {
    return this.game.world.scene
  }

  get resources() {
    return this.game.resources
  }

  onCollide({handle1, handle2, started}: CollideArg) {
			if(!this.entity || !this.entity?.collider || !started) return

      let collider = this.entity?.collider
      if(this.entity?.sensor) {
        collider = this.entity?.sensor
      }

			if ([handle1, handle2].includes(collider.handle)) {
        this.trigger('collect',true)
				this.destroy()
			}
  }

  getColliderDesc(isSensor = true,colliderDescType = RAPIER.ColliderDesc.cuboid) {

    const size = isSensor ? this.size/3 : this.size/5
    const height = isSensor ? size : this.size / 2

    const colliderDesc = colliderDescType(size,height,size)
      .setSensor(isSensor)

    if(!isSensor) {
      colliderDesc.setTranslation(0,-0.3,0)
    }

    return colliderDesc

  }

  getGeometry() {
    const geometry = new PlaneGeometry(this.size, this.size)
    return geometry
  }

  getMaterial() {
    const material = new MeshBasicMaterial({ transparent: true, side: DoubleSide })

    if(this.game.debug.active) {
      material.color.set('gold')
    } else if(this.texture) {
      material.map = this.texture
    }

    return material
  }

  getMesh() {
    return new Mesh(
      this.getGeometry(),
      this.getMaterial()
    )
  }

  build(type = bodyType.NONE) {

    const colliderDesc = this.getColliderDesc()
    const bodyDesc = getRigidBodyDesc(type)
    const mesh = this.getMesh()
    mesh.renderOrder = 2

    const { x,y,z } = this.position

    if(bodyDesc) {
      bodyDesc.setTranslation(x,y,z).lockRotations()
      this.entity = this.physics.addEntity(bodyDesc,this.getColliderDesc(false))
      this.entity.sensor = this.physics.instance.createCollider(colliderDesc,this.entity.body)
    } else {
      colliderDesc.setTranslation(x,y,z)
      mesh.position.copy(this.position)
      this.entity = this.physics.addSensor(colliderDesc)
    }

    this.entity.mesh = mesh
    this.scene.add(mesh)

    this.physics.on('collide',(arg) => {
      this.onCollide(arg as CollideArg)
    })

  }

  destroy() {

    this.physics.removeEntity(this.entity)

    if(!this.entity.mesh) return 
				
      gsap.to(this.entity.mesh.position, { y: '+=3' })
      gsap.to(this.entity.mesh.rotation, { y: Math.PI * 3 })
      gsap.to(this.entity.mesh.material, {
        opacity: 0,
        onComplete: () => {
          this.scene.remove(this.entity.mesh as Mesh)
          this.trigger('destroyed',true)
        },
      })
  }

}
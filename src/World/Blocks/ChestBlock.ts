import RAPIER, { ActiveCollisionTypes, ActiveEvents, Collider } from "@dimforge/rapier3d"
import { Entity } from "../../Types/entity.types"
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, ShaderMaterial, Vector3 } from "three"
import { CallbackArg, CollideArg } from "../../Types/callbacks.types"
import gsap from "gsap"
import Block, { BlockProps } from "./Block"
import Collectable from "../Collectables/Collectable"
import { collectableType } from "../../Utils/CollectablesType"
import GoldenApple from "../Collectables/GoldenApple"
import GoldenCarrot from "../Collectables/GoldenCarrot"
import Diamond from "../Collectables/Diamond"
import Emerald from "../Collectables/Emerald"

const _V = new Vector3()

export type ChestBlockProps = BlockProps & {
  content: number
}

export default class ChestBlock extends Block {

  sensor!: Collider
  contentNumber = 1
  contentType: number
  elevation = {
    initial: 0,
    value: 0
  }

  constructor({ position = new Vector3(), r, textureIndex, b = 0, content}: ChestBlockProps) {

    super({ position, r, textureIndex, b: 0})

    this.contentType = content
    this.contentNumber = b

    this.entity.mesh!.geometry.translate(0,-0.1,0)

    this.onCollide()

  }

  getPhysics(): Entity {

    let entity: Entity = {}

    const {x,y,z} = this.position

    const bodyDesc = RAPIER.RigidBodyDesc.fixed()
			.setTranslation(x, y + 0.1, z)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.4, 0.5).setActiveEvents(ActiveEvents['COLLISION_EVENTS'])
    .setActiveCollisionTypes(ActiveCollisionTypes['ALL'])
		entity = this.physics.addEntity(bodyDesc, colliderDesc)

    const sensor = RAPIER.ColliderDesc.cuboid(0.5, 0.05, 0.5).
    setSensor(true).setTranslation(x, y - 0.45, z)
    this.sensor = this.physics.instance.createCollider(sensor)

    return entity
  }

  spawnContent() {

    const { x,y,z} = this.position
    this.contentNumber--

    switch(this.contentType) {
        case collectableType.GOLDEN_APPLE:
          // console.log('apple')
          new GoldenApple(new Vector3(x,y + 1,z),1)
          break;
        case collectableType.GOLDEN_CARROT:
          // console.log('apple')
          new GoldenCarrot(new Vector3(x,y + 1,z),1)
          break;
        case collectableType.DIAMOND:
          // console.log('apple')
          new Diamond(new Vector3(x,y + 1,z),1)
          break;
        case collectableType.EMERALD:
          // console.log('apple')
          new Emerald(new Vector3(x,y + 1,z),1)
          break;
      }
    
      if(this.contentNumber === 0) {
        this.deactivate()
      }
  }

  deactivate() {
    const aUv = this.entity.mesh!.geometry.getAttribute('aUv')

    for (let i = 0; i < aUv.count; i++) {
      aUv.setZ(i,0)
      
    }

    aUv.needsUpdate = true
    console.log(aUv)
  }

  onCollide() {

    this.elevation.initial = this.position.y + 0.1

    const callback = (arg: CallbackArg) => {
      const {handle1, handle2, started } = arg as CollideArg
      if(!this.entity || !this.entity?.collider || !started) {
        return
      }


      if ([handle1, handle2].includes(this.sensor.handle)) { 
        // console.log('check colpita')

        if(this.contentNumber) {
          this.spawnContent()
        }

        if(this.contentNumber === 0) {
          this.physics.off('collide',callback)
        }

        if(!this.entity.body) return

        const p = this.entity.body.translation()
        const h = this.elevation.initial

        gsap.timeline({ onUpdate: () => {

          p.y = h + this.elevation.value
          this.entity.body?.setTranslation(p,true)
          console.log('update')

        } }).to(this.elevation,{ value: 0.4, duration: 0.1  }).to(this.elevation,{ value: 0, duration: 0.1  })
      }
    }

    this.physics.on('collide',callback)
  }

  // createBlock(x: number, y: number, z: number ) {

  //   this.elevation.initial = y + 0.1

	// 	const bodyDesc = RAPIER.RigidBodyDesc.fixed()
	// 		.setTranslation(x, y + 0.1, z)
	// 	const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.4, 0.5).setActiveEvents(ActiveEvents['COLLISION_EVENTS'])
  //   .setActiveCollisionTypes(ActiveCollisionTypes['ALL'])
	// 	this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
  //   const sensor = RAPIER.ColliderDesc.cuboid(0.5, 0.05, 0.5).
  //   setSensor(true).setTranslation(x, y - 0.45, z)
  //   this.sensor = this.physics.instance.createCollider(sensor)

  //   const geometry = new BoxGeometry(1, 1, 1)
  //   geometry.translate(0,-0.1,0)
	// 	this.entity.mesh = new Mesh(
	// 		geometry,
	// 		this.material
	// 	)

	// 	this.scene.add(this.entity.mesh)
    
  // }

}
import RAPIER, { ActiveCollisionTypes, ActiveEvents, Collider } from "@dimforge/rapier3d"
import Game from "../Game"
import { Entity } from "../Types/entity.types"
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from "three"
import Physics from "../Physics"
import { CallbackArg, CollideArg } from "../Types/callbacks.types"
import gsap from "gsap"

const _V = new Vector3()

export default class ChestBlock {

  game: Game
  entity!: Entity
  scene: Scene
  physics: Physics
  sensor!: Collider
  elevation = {
    initial: 0,
    value: 0
  }


  constructor(x: number, y: number,z: number = 0) {

    this.game = new Game()
    this.scene = this.game.world.scene
    this.physics = this.game.physics

    this.createBlock(x,y,z)

  }

  createBlock(x: number, y: number, z: number ) {

    this.elevation.initial = y + 0.1

		const bodyDesc = RAPIER.RigidBodyDesc.fixed()
			// .lockRotations()
			// .lockTranslations()
			// .enabledTranslations(false, true, false)
			.setTranslation(x, y + 0.1, z)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.4, 0.5).setActiveEvents(ActiveEvents['COLLISION_EVENTS'])
    .setActiveCollisionTypes(ActiveCollisionTypes['ALL'])
		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
    const sensor = RAPIER.ColliderDesc.cuboid(0.5, 0.05, 0.5).
    setSensor(true).setTranslation(x, y - 0.45, z)
    this.sensor = this.physics.instance.createCollider(sensor)

    const geometry = new BoxGeometry(1, 1, 1)
    geometry.translate(0,-0.1,0)
		this.entity.mesh = new Mesh(
			geometry,
			new MeshStandardMaterial({ color: 'red' })
		)

		this.scene.add(this.entity.mesh)
    const onCollide = (arg: CallbackArg) => {
      const {handle1, handle2, started } = arg as CollideArg
      if(!this.entity || !this.entity?.collider || !started) {
        return
      }

      // this.physics.off('collide',onCollide)


      if ([handle1, handle2].includes(this.sensor.handle)) { 
        console.log('check colpita')
        if(!this.entity.body) return

        const p = this.entity.body.translation()
        const h = this.elevation.initial

        gsap.timeline({ onUpdate: () => {

          p.y = h + this.elevation.value
          this.entity.body?.setTranslation(p,true)

        } }).to(this.elevation,{ value: 0.25, duration: 0.1  }).to(this.elevation,{ value: 0, duration: 0.1  })
      }
    }

    this.physics.on('collide',onCollide)

  }

}
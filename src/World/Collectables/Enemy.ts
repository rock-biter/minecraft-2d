import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import Game from "../../Game";
import Events from "../../Utils/Events";
import { Entity } from "../../Types/entity.types";
import RAPIER from "@dimforge/rapier3d";
import Controller from "../../Utils/Controller";
import { CollideArg } from "../../Types/callbacks.types";
import gsap from "gsap";
import GoldenApple from "./GoldenApple";
import Diamond from "./Diamond";
import { bodyType } from "../../Utils/BodyTypes";

const _V = new Vector3()

export default class Enemy extends Events {

  game: Game
  entity!: Entity
  position: Vector3
  static controller: RAPIER.KinematicCharacterController
  velocity = new Vector3(-1,-3,0)
  bounds = 5

  constructor(position: Vector3) {
    super()

    this.game = new Game()
    this.position = position

    if(!Enemy.controller) {
      Enemy.controller = this.game.physics.instance.createCharacterController(0.02)

      Enemy.controller.enableSnapToGround(1)
      Enemy.controller.enableAutostep(1.1, 0.15, true)
    }

    this.create()

  }

  get physics() {
    return this.game.physics
  }

  get scene() {
    return this.game.world.scene
  }

  get time() {
    return this.game.time
  }

  create() {

    const {x, y, z} = this.position

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
    bodyDesc.setTranslation(x,y,z).lockRotations()
    const w = this.physics.instance

    const mainCollDesc = RAPIER.ColliderDesc.cuboid(0.5,0.6,0.5).setTranslation(0,-0.25,0).setSensor(true)

    this.entity = this.physics.addEntity(bodyDesc,mainCollDesc)

    const sensorCollDesc = RAPIER.ColliderDesc.cuboid(0.35,0.3,0.35)
    .setTranslation(0,0.6, 0).setSensor(true)
    this.entity.sensor = w.createCollider(sensorCollDesc,this.entity.body)
    this.entity.mesh = this.getMesh()
    this.entity.mesh.geometry.translate(0,0.1,0)


    this.time.on('tick',() => {
      this.update()
    },4)

    this.physics.on('collide',(arg) => {
      this.onCollide(arg as CollideArg)
    })

  }

  static spawn(position: Vector3) {
    return new Enemy(position)
  }

  getMesh() {

    const material = new MeshStandardMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.5
    })

    const mesh = new Mesh(
      new BoxGeometry(1,2,1),
      material
    )

    this.scene.add(mesh)

    return mesh
  }

  update() {
    // return
    // console.log('move enemy')
    

    if(!this.entity.collider || !this.entity.body) return 

    const body = this.physics.instance.getRigidBody(this.entity.body.handle)
    if(!body) return
    // move the enemy

    const currentPosition = this.entity.body.translation()
    
    if(currentPosition.x < this.position.x - this.bounds ||
      currentPosition.x > this.position.x + this.bounds
    ) {
      this.velocity.x *= -1
    }

    const desMove = _V.copy(this.velocity).multiplyScalar(this.time.delta * 0.001)
    Enemy.controller.computeColliderMovement(
      this.entity.collider,
      desMove, 
      undefined,
			undefined,
			(coll) => {
				return !coll.isSensor() && coll.handle !== this.game.world.player?.entity?.collider?.handle
			})

    

    const newPos = _V.copy(Enemy.controller.computedMovement()).add(currentPosition)
    newPos.z = 0

    this.entity.body.setNextKinematicTranslation(newPos)

  }

  onCollide({handle1, handle2, started}: CollideArg) {
			if(!this.entity || !this.entity?.collider || !started || !this.entity.sensor) return

			if ([handle1, handle2].includes(this.entity?.collider?.handle)) {
				//hit the body
        console.log('damage to player!!')
        const v = this.game.world.player?.velocity
        if(!v) return
        
        v.x = -15 * Math.sign(v.x)
			}

      if ([handle1, handle2].includes(this.entity?.sensor?.handle)) {
				//hit the body
        const v = this.game.world.player?.velocity
        if(!v || v.y >= 0) return
        console.log('damage to enemy!!')
          this.destroy()
        

        // console.log(v)
        
        v.y = 18
			}
  }

  drop() {
    // TODO random items from a collection of droppables 
    if(Math.random() < 0.3) return  
    const drop = new Diamond(this.entity.body?.translation() as Vector3,bodyType.DYNAMIC)

    drop.entity.body?.applyImpulse({x: 3 * Math.sign(Math.random() - 0.5), y: 2, z: 0},true)
  }

  destroy() {

    this.drop()

    

    this.physics.removeEntity(this.entity)

    if(!this.entity.mesh) return 
				
      gsap.to(this.entity.mesh.scale, { y: 0.5, duration: 0.1, })
      gsap.to(this.entity.mesh.position, { y: '-=0.5', duration: 0.1, onComplete: () => {
          setTimeout(() => {
            this.scene.remove(this.entity.mesh as Mesh)
          },300)
          this.trigger('destroyed',true)
        }, })
  }
}
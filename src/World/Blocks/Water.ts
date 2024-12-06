import { Box3, BoxGeometry, Frustum, Mesh, MeshStandardMaterial, ShaderMaterial, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { Entity } from "../../Types/entity.types";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";
import RAPIER, { ColliderDesc } from "@dimforge/rapier3d";
import { CollideArg } from "../../Types/callbacks.types";

export interface WaterBlockProps {
  position: Vector3
  width?: number
  height?: number
}

export default class Water extends Block {

  static blocks: Water[] = []

  constructor({ position = new Vector3(), width = 1, height = 1 }: WaterBlockProps) {
    super({position, r: 0,textureIndex: -1,b: 0, width, height})

    Water.blocks.push(this)
    if(position.z === 0) {
      this.createSensor()
    }

    const cam = this.game.view.camera

    this.game.time.on('tick',() => {

      const blocks = []

      Water.blocks.filter((water) => {
        const boundingBox = new Box3().setFromObject(water.entity.mesh!)
        const frustum = new Frustum()
        frustum.setFromProjectionMatrix(cam.projectionMatrix)
        frustum.planes.forEach(function(plane) { plane.applyMatrix4(cam.matrixWorld) })
        if(frustum.intersectsBox(boundingBox)) { 
          return true
        } else {
          return false
        }
      }).map(block => block.entity.mesh).sort((a,b) => {
        const dA = cam.position.distanceTo(a!.position)
        const dB = cam.position.distanceTo(b!.position)

        return  dB - dA
      }).forEach((block,i) => {
        block!.renderOrder = Water.blocks.length + 10 - i
      })

    },)
  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.waterMaterial
  }

  createSensor() {

    const {x,y,z} = this.position

    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5,0.5,0.5).setTranslation(x,y,z).setSensor(true)

    this.entity.sensor = this.physics.instance.createCollider(colliderDesc)

    this.physics.on('collide',(arg) => {

      const {handle1, handle2, started} = arg as CollideArg
			if(!this.entity || !this.entity!.sensor || !this.game.world.player) return

       if ([handle1, handle2].includes(this.entity!.sensor!.handle)) {
        console.log('collision with water',started) 

        if(started) {
          this.game.world.player.removeEffect('burn')
          this.game.world.player.waterIntersections.push(this.entity!.sensor!.handle)
        } else {
          const i = this.game.world.player.waterIntersections.indexOf(this.entity!.sensor!.handle)
          if(i !== -1) {
            this.game.world.player.waterIntersections.splice(i,1)
          }
        }

       }

    })

  }

  // getPhysics(): Entity {
  //   let entity: Entity = {}

  //   const {x,y,z} = this.position
  //   const w = this.width || 1
  //   const h = this.height || 1
  // }
}
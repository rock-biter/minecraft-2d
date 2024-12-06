import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { Entity } from "../../Types/entity.types";
import RAPIER from "@dimforge/rapier3d";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";
import { CollideArg, PaneArgs } from "../../Types/callbacks.types";
import ENUMS, { TEXTURES } from "../../Utils/Enums";

export interface LavaBlockProps {
  position: Vector3
  width?: number
  height?: number
  depth: number
}

export default class Lava extends Block {

  constructor({ position = new Vector3(), width = 1, height = 1, depth }: LavaBlockProps) {
    super({position, r: 0,textureIndex: 9,b: 0,depth, width, height})
    
    // this.height = height
    // this.width = width

    // console.log('lava',width,height)

    const geom = this.getGeometry()
    this.setGeometryAttributes(geom)
    this.entity.mesh!.geometry = geom

    if(this.debug.active) {
      this.debug.on('texturePackChange',(e) => {
        const event = e as PaneArgs
        this.entity.mesh!.material = event.value === ENUMS.TEXTURE_MINECRAFT_TRAILER ? this.material : new MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.3})
      })
    }

  }

  get material(): ShaderMaterial | MeshStandardMaterial | MeshBasicMaterial {
    return this.game.world.materials.lavaStillMaterial
  }

  getPhysics(): Entity {
    // console.log('lava phisics')
    let entity: Entity = {}

    const {x,y,z} = this.position

    const w = this.width || 1
    const h = this.height || 1

    const colliderDesc = RAPIER.ColliderDesc.cuboid(w/2,h/2 - 0.1,0.5)
    .setTranslation(x + w /2 - 0.5 , y - h/2 + 0.5 , z)
    .setSensor(true)

    entity = this.physics.addSensor(colliderDesc)

    this.physics.on('collide',(arg) => {
      const {handle1, handle2, started} = arg as CollideArg
			if(!this.entity || !this.entity?.collider || !this.game.world.player) return

      if ([handle1, handle2].includes(this.entity?.collider?.handle)) {
        console.log('collision with lava',started)

        if(started) {
          this.game.world.player.addEffect({ name: 'burn', value: -1 })
          this.game.world.player.addEffect({ name: 'slowness', value: 0 })
        } else {
          this.game.world.player.addEffect({ name: 'burn', value: 4 })
          this.game.world.player.removeEffect('slowness')

        }

        // this.game.world.player.isOnLadder = started
        // if(!started) {
        //   this.game.world.player.grabLadder = false
        // }

      }
    })
  
    return entity
  }
  
  getGeometry() {
    // console.log('alpha:',opacity,textureDepth)
    console.log('lava geometry')

    // const bright = MathUtils.mapLinear(this.b,0,200,-1,1)
    // const box = new BoxGeometry(this.width, this.height,1)
    // box.translate(this.width/2 - 0.5, -this.height/2 + 0.5,0)
    const geometries = []

    for (let i = 0; i < (this.width || 1); i++) {
      for (let j = 0; j < (this.height || 1); j++) {
        const box = new BoxGeometry(1,1,1);
        box.translate(i,-j,0)

        geometries.push(box)
      }
    }

    const geometry = BufferGeometryUtils.mergeGeometries(geometries)

    return geometry
  }
}
import { BoxGeometry, MeshStandardMaterial, ShaderMaterial, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { Entity } from "../../Types/entity.types";
import RAPIER from "@dimforge/rapier3d";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";

export interface LavaBlockProps {
  position: Vector3
  width: number
  height: number
  depth: number
}

export default class Lava extends Block {

  width: number
  height: number

  constructor({ position = new Vector3(), width = 1, height = 1, depth }: LavaBlockProps) {
    super({position, r: 0,textureIndex: 9,b: 0,depth})
    
    this.height = height
    this.width = width

    console.log('lava',width,height)

    const geom = this.getGeometry()
    this.setGeometryAttributes(geom)
    this.entity.mesh!.geometry = geom

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.lavaStillMaterial
  }

  getPhysics(): Entity {
    let entity: Entity = {}

    const {x,y,z} = this.position

    const colliderDesc = RAPIER.ColliderDesc.cuboid(this.width/2,this.height/2,0.5)
    .setTranslation(x - this.width/2 + 0.5, y - this.height/2 + 0.5, z)
    .setSensor(true)

    entity = this.physics.addSensor(colliderDesc)
  
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
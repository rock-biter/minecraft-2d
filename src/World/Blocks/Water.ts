import { MeshStandardMaterial, ShaderMaterial, Vector3 } from "three";
import Block, { BlockProps } from "./Block";

export default class Water extends Block {

  static blocks: Water[] = []

  constructor({ position = new Vector3(), width = 1, height = 1, depth }: BlockProps) {
    super({position, r: 0,textureIndex: 100,b: 0,depth, width, height})

    Water.blocks.push(this)

    const cam = this.game.view.camera

    this.game.time.on('tick',() => {

      Water.blocks.map(block => block.entity.mesh).sort((a,b) => {
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
}
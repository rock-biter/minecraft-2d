import { BufferAttribute, MeshStandardMaterial, ShaderMaterial, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { getTextureIndex } from "../../Utils/BlocksTexture";
import { TEXTURES } from "../../Utils/Enums";

export default class Grass extends Block {
  constructor({ position = new Vector3(), r, textureIndex, b, depth }: BlockProps) {

    super({position, r,textureIndex,b,depth})

    // edit top and bottom face texture
    this.setTopBottomFace()
    if (this.entity.mesh) {
      this.entity.mesh.material = this.game.world.materials.grassMaterial
      const mat = this.entity.mesh.material as ShaderMaterial
      // mat.uniforms.uColor.value.set(0x78AC30)
    }

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.grassMaterial
  }

  setTopBottomFace() {
    const normal = this.geometry?.getAttribute('normal') as BufferAttribute
    const uv = this.geometry?.getAttribute('aUv') as BufferAttribute

    for (let i = 0; i < normal.count; i++) {
      const y = normal.getY(i);

      if(y === 1) {
        uv.setZ(i,getTextureIndex(TEXTURES.GRASS_TOP))
      }

      if(y === -1) {
        uv.setZ(i,getTextureIndex(TEXTURES.DIRT))
      }

    }

    uv.needsUpdate = true
  }
}
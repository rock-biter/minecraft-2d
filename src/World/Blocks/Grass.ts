import { BufferAttribute, MeshStandardMaterial, ShaderMaterial, Texture, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { getTextureIndex } from "../../Utils/BlocksTexture";
import { TEXTURES } from "../../Utils/Enums";
import Sprite from "../Sprite/Sprite";
import { plants as plantsResources } from "../../Utils/sources";

export interface GrassBlockProps {
  position: Vector3
}

export default class Grass extends Block {
  constructor({ position = new Vector3() }: GrassBlockProps) {

    super({position, r: position.z === 0 ? 1 : 0,textureIndex: [getTextureIndex(TEXTURES.GRASS_TOP),getTextureIndex(TEXTURES.GRASS),getTextureIndex(TEXTURES.DIRT)],b: 0})

    // edit top and bottom face texture
    // this.setTopBottomFace()
    // if (this.entity.mesh) {
      // this.entity.mesh.material = this.game.world.materials.grassMaterial
      // const mat = this.entity.mesh.material as MeshStandardMaterial
      // mat.uniforms.uColor.value.set(0x78AC30)


      if(Math.random() > 0.1) return 

      const x = (Math.random() - 0.5) * 0.5
      const z = (Math.random() - 0.5) * 0.5
      const plants = new Sprite({ position: this.position.clone().add(new Vector3(x,1,z)) })
      const spriteMat = plants.entity.mesh!.material as MeshStandardMaterial

      const mapName = plantsResources.map(el => el.name)[Math.floor(Math.random() * plantsResources.length)]
      spriteMat.map = this.resources.items[mapName] as Texture
    // }

  }

  // get material(): ShaderMaterial | MeshStandardMaterial {
  //   return this.game.world.materials.grassMaterial
  // }

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
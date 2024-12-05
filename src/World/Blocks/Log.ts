import { BufferAttribute, Euler, MeshStandardMaterial, ShaderMaterial, Texture, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { getTextureIndex } from "../../Utils/BlocksTexture";
import { TEXTURES } from "../../Utils/Enums";
import Sprite from "../Sprite/Sprite";
import { plants as plantsResources } from "../../Utils/sources";

export interface LogBlockProps {
  position?: Vector3
  rotation?: Euler
  r: number
  textureTopIndex: number
  textureSideIndex: number
  b: number
  depth: number
}

export default class Log extends Block {

  rotation: Euler

  constructor({ position = new Vector3(), rotation = new Euler(0), r, textureTopIndex, textureSideIndex, b, depth }: LogBlockProps) {

    super({position, r,textureIndex: textureSideIndex,b,depth})

    this.rotation = rotation
    this.entity.mesh!.rotation.copy(this.rotation)

    // edit top and bottom face texture
    this.setTopBottomFace(textureTopIndex)

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.grassMaterial
  }

  setTopBottomFace(textureIndex: number) {
    const normal = this.geometry?.getAttribute('normal') as BufferAttribute
    const uv = this.geometry?.getAttribute('aUv') as BufferAttribute

    for (let i = 0; i < normal.count; i++) {
      const y = normal.getY(i);

      if(y === 1) {
        uv.setZ(i,textureIndex)
      }

      if(y === -1) {
        uv.setZ(i,textureIndex)
      }

    }

    uv.needsUpdate = true
  }
}
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
  depth?: number
}

export default class Log extends Block {

  rotation: Euler

  constructor({ position = new Vector3(), rotation = new Euler(0), r, textureTopIndex, textureSideIndex, b, depth }: LogBlockProps) {

    super({position, r,textureIndex: [textureTopIndex,textureSideIndex,textureTopIndex],b,depth})

    this.rotation = rotation
    this.geometry?.rotateX(rotation.x)
    this.geometry?.rotateY(rotation.y)
    this.geometry?.rotateZ(rotation.z)

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.blocksMaterial
  }

}
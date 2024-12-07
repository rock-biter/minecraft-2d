import { BufferAttribute, Euler, MeshStandardMaterial, ShaderMaterial, Texture, Vector3 } from "three";
import Block, { BlockProps } from "./Block";
import { getTextureIndex } from "../../Utils/BlocksTexture";
import { TEXTURES } from "../../Utils/Enums";
import Sprite from "../Sprite/Sprite";
import { plants as plantsResources } from "../../Utils/sources";

export interface QuartzBlockProps {
  position?: Vector3
  rotation?: Euler
}

export default class Quartz extends Block {

  constructor({ position = new Vector3()}: QuartzBlockProps) {

    super({position, r: position.z === 0 ? 1 : 0,textureIndex: [getTextureIndex('QUARTZ_TOP'),getTextureIndex('QUARTZ_SIDE'),getTextureIndex('QUARTZ_BOTTOM')]})

  }
}
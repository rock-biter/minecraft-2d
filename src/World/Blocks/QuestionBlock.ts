import RAPIER, { ActiveCollisionTypes, ActiveEvents, Collider } from "@dimforge/rapier3d"
import Game from "../../Game"
import { Entity } from "../../Types/entity.types"
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, ShaderMaterial, Vector3 } from "three"
import Physics from "../../Physics"
import { CallbackArg, CollideArg } from "../../Types/callbacks.types"
import gsap from "gsap"
import ChestBlock, { ChestBlockProps } from "./ChestBlock"
import { getTextureIndex } from "../../Utils/BlocksTexture"

const _V = new Vector3()

export interface QuestionBlockProps {
  position: Vector3
  content: number
  r?: number
  b?: number
}

export default class QuestionBlock extends ChestBlock {

  spawnedDirection = new Vector3(0,1,0)
  spawnedSpeed = 0
  spawnedBody = 1 // fixed

  merge = false

  constructor({ position = new Vector3(), content, r = 1, b = 1}: QuestionBlockProps) {

    super({ position, r, textureIndex: getTextureIndex('QUESTION_MARK'), content, b })

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.blocksMaterial
  }

}
import RAPIER, { ActiveCollisionTypes, ActiveEvents, Collider } from "@dimforge/rapier3d"
import Game from "../../Game"
import { Entity } from "../../Types/entity.types"
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, ShaderMaterial, Vector3 } from "three"
import Physics from "../../Physics"
import { CallbackArg, CollideArg } from "../../Types/callbacks.types"
import gsap from "gsap"
import ChestBlock, { ChestBlockProps } from "./ChestBlock"

const _V = new Vector3()

export default class QuestionBlock extends ChestBlock {

  spawnedDirection = new Vector3(0,1,0)
  spawnedSpeed = 0
  spawnedBody = 1 // fixed

  constructor({ position = new Vector3(), r = 1, textureIndex, b, content}: ChestBlockProps) {

    super({ position, r, textureIndex, b, content })

  }

  get material(): ShaderMaterial | MeshStandardMaterial {
    return this.game.world.materials.blocksMaterial
  }

}
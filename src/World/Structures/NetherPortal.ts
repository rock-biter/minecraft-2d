import { Scene, Vector3 } from "three";
import Game from "../../Game";
import Block from "../Blocks/Block";
import { getTextureIndex } from "../../Utils/BlocksTexture";

export default class NetherPortal {

  game: Game
  position: Vector3

  constructor(position = new Vector3()) {

    this.game = new Game()
    this.position = position

    this.build()
  }

  get scene(): Scene {
    return this.game.world.scene
  }

  build() {

    new Block({ position: this.getBlockPosition(0,0,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(1,0,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(2,0,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(2,1,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(2,2,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(2,3,0), textureIndex: getTextureIndex('OBSIDIAN') })
    // new Block({ position: this.getBlockPosition(2,4,0), textureIndex: getTextureIndex('OBSIDIAN') })
    // new Block({ position: this.getBlockPosition(2,5,0), textureIndex: getTextureIndex('OBSIDIAN') })
    // new Block({ position: this.getBlockPosition(1,5,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(0,5,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-1,5,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,5,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,4,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,3,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,2,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,1,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-2,0,0), textureIndex: getTextureIndex('OBSIDIAN') })
    new Block({ position: this.getBlockPosition(-1,0,0), textureIndex: getTextureIndex('OBSIDIAN') })

  }

  getBlockPosition(x = 0, y = 0, z= 0) {
    const p = this.position.clone()
    p.x += x
    p.y += y
    p.z += z
    return p
  }
}
import { Euler, Vector3 } from "three";
import Tree from "./Tree";
import Log from "../Blocks/Log";
import { getTextureIndex } from "../../Utils/BlocksTexture";
import { TEXTURES } from "../../Utils/Enums";
import Block from "../Blocks/Block";

export default class Oak extends Tree {
  constructor({ position = new Vector3()}) {
    super({position})

    this.buildLog()
    this.buildLeaves()
  }

  buildLog() {

    // frustum
    new Log({ position: this.getBlockPosition(0,0,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP), b: 0})
    new Log({ position: this.getBlockPosition(0,1,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP), b: 0})
    new Log({ position: this.getBlockPosition(0,2,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP), b: 0})
    // new Log({ position: this.getBlockPosition(0,3,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP), b: 0})



    // branch 1
    // new Log({ position: this.getBlockPosition(-1,3,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0, rotation: new Euler(Math.PI * 0.5,0,0)})
    // new Log({ position: this.getBlockPosition(-1,3,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -1, b: 0, rotation: new Euler(Math.PI * 0.5,0,0)})
    
    // branch 2
    // new Log({ position: this.getBlockPosition(1,2,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0, rotation: new Euler(0,0,Math.PI * 0.5)})

    
  }

  buildLeaves() {
    // leaves base
    for (let z = 0; z < 4; z++) {
      let b = 2
      z > 1 && (b = 1)
      for (let i = -b; i <= b; i++) {
        for (let j = -b; j <= b; j++) { 
          if(i === j && i === 3) continue
          if(
            Math.abs(i) === Math.abs(j) && 
            Math.abs(i) === 2 && Math.random() > (0.4 - z * 0.15) 
          ) continue
          if(Math.abs(i) === Math.abs(j) && z === 3) continue
          const p = this.getBlockPosition(i,2 + z,j)
          new Block({ position: p, textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: p.z === 0 ? 1 : 0 })
        }
      }
    }
    
    // new Block({ position: this.getBlockPosition(-11.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 0, depth:-1 })
    // new Block({ position: this.getBlockPosition(-10.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 0, depth:-1 })
    // new Block({ position: this.getBlockPosition(-12.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    // new Block({ position: this.getBlockPosition(-12.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    // new Block({ position: this.getBlockPosition(-11.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    // new Block({ position: this.getBlockPosition(-11.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    // new Block({ position: this.getBlockPosition(-13.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    // new Block({ position: this.getBlockPosition(-14.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-13.5,2,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    // new Block({ position: this.getBlockPosition(-13.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    // new Block({ position: this.getBlockPosition(-13.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    // new Block({ position: this.getBlockPosition(-13.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-12.5,5,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-11.5,5,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-10.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-10.5,3,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    // new Block({ position: this.getBlockPosition(-12.5,2,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    // new Block({ position: this.getBlockPosition(-12.5,5,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    // new Block({ position: this.getBlockPosition(-11.5,5,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    // new Block({ position: this.getBlockPosition(-11.5,4,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
  }
}
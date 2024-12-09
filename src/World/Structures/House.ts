import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from "three"
import Game from "../../Game"
import { BufferGeometryUtils } from "three/examples/jsm/Addons"
import Quartz from "../Blocks/Quartz"
import Block from "../Blocks/Block"
import { getTextureIndex } from "../../Utils/BlocksTexture"
import Water from "../Blocks/Water"
import Ladder from "../Ladder"

export default class House {

  game: Game

  constructor() {

    this.game = new Game()


    this.build()
  }

  get scene(): Scene {
    return this.game.world.scene
  }

  build() {

    // new Quartz({ position: new Vector3(0,0,0)})

    // pavimento
    for (let i = 0; i < 8; i++) {
      for (let k = 0; k < 5; k++) {
        const z = -3 + k
        
        new Block({ position: new Vector3(-1 -i + 4,0,z), textureIndex: getTextureIndex('JUNGLE_PLANKS')})
        
        new Block({ position: new Vector3(-1 -i + 4,4,z), textureIndex: getTextureIndex('JUNGLE_PLANKS')})
      }
    }

    // new Quartz({ position: new Vector3(0,0,-2)})
    // new Quartz({ position: new Vector3(0,0,-1)})

    // layer 0
    

    // muretto giardino
    // for (let i = 0; i < 4; i++) {
    //   new Quartz({ position: new Vector3(-9,i,0)})
    // }

    // // lato piscina
    // for (let i = 0; i < 3; i++) {
    //   for (let k = 0; k < 13; k++) {
    //     const z = -4 + k
    //     new Quartz({ position: new Vector3(0,-i,z)})
    //   }
    // }

    // for (let i = 0; i < 4; i++) {
    //   for (let k = 0; k < 13; k++) {
    //     const z = -4 + k
    //     if(z === 0) continue
    //     new Quartz({ position: new Vector3(5,-i,z)})
    //   }
    // }

    // //front piscina
    // for (let i = 0; i < 5; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     new Quartz({ position: new Vector3(i+1,-j,8)})
    //   }
    // }
    
    // // fondo piscina
    // for (let i = 0; i < 6; i++) {
    //   for (let k = 0; k < 13; k++) {
    //     const z = -4 + k
    //     new Quartz({ position: new Vector3(i,-3,z)})
    //   }
    // }

    // //muretto frontale
    // for (let i = 0; i < 70; i++) {
    //   new Quartz({ position: new Vector3(i-20,3,-5)})
    // }
    // for (let i = 0; i < 60; i++) {
    //   new Quartz({ position: new Vector3(i-12,2,-5)})
    // }

    // for (let i = 0; i < 50; i++) {
    //   new Quartz({ position: new Vector3(i-10,1,-5)})
    // }

    // for (let i = 0; i < 7; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     new Quartz({ position: new Vector3(i+1,0-j,-5)})
    //   }
    // }

    // // piattaforma piscina
    // for (let i = 0; i < 5; i++) {
    //   new Quartz({ position: new Vector3(i+8,0,0)})
    // }

    // for (let i = 0; i < 8; i++) {
    //   new Block({ position: new Vector3(-1 -i,0,0), textureIndex: getTextureIndex('JUNGLE_PLANKS')})
    // }

    // // acqua piscina
    // for (let i = 0; i < 4; i++) {
    //   for (let k = 0; k < 12; k++) {
    //     const z = -4 + k
    //     if(z === 0) continue
    //     new Water({ position: new Vector3(i+1,0,z)})
    //   }
    // }

    // for (let i = 0; i < 5; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     new Water({ position: new Vector3(i+1,-j,0)})
    //   }
    // }

    // //cascata
    // for (let i = 0; i < 2; i++) {
    //   for (let j = 0; j < 22; j++) {
    //     new Water({ position: new Vector3(i+6,-j,0)})
    //   }
    // }

    // new Ladder( new Vector3(13,9,0),12 )
    // for (let i = 0; i < 12; i++) {
    //   new Block({ position: new Vector3(13,9-i,-1), textureIndex: getTextureIndex('BIRCH_PLANKS')})
    // }

    // // camera cornice
    // for (let j = 0; j < 10; j++) {
    //   const w = 5
    //   const h = 10
    //   const z = j - 7
    //   for (let i = 0; i < 5; i++) {
    //     (z != 0 || i > 0) && new Quartz({ position: new Vector3(13+i,7,z)})
    //     new Quartz({ position: new Vector3(13+i,7+h - 1,z)})
    //   }

    //   for (let i = 0; i < h; i++) {
    //     new Quartz({ position: new Vector3(12,7+i,z)})
    //     new Quartz({ position: new Vector3(18,7+i,z)})
    //   }
    // }
    // for (let i = 0; i < 7; i++) {
    //   i > 0 && new Quartz({ position: new Vector3(13+i,7,0)})
    //   new Quartz({ position: new Vector3(13+i,20,0)})
    // }

    
    

    
    // new Quartz({ position: new Vector3(-5,26,0), r: 0})
    // new Quartz({ position: new Vector3(-5,26,0), r: 0})
    // new Quartz({ position: new Vector3(-5,26,0), r: 0})
    // new Quartz({ position: new Vector3(-5,26,0), r: 0})
    // new Quartz({ position: new Vector3(-5,26,0), r: 0})

  }




}
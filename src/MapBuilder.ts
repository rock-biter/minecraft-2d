import {  BoxGeometry, BufferAttribute, BufferGeometry, Euler, IUniform, MathUtils, Mesh, MeshStandardMaterial,   PlaneGeometry, Scene, ShaderMaterial, Texture, Uniform, Vector3 } from "three";
import Game from "./Game";
import Physics from "./Physics";
import Resources from "./Utils/Resources";
import RAPIER from "@dimforge/rapier3d";

import { Source } from "./Types/resources.types";
import { Entity } from "./Types/entity.types";
// import ChestBlock from "./World/ChestBlock";
import Ladder from "./World/Ladder";
import GoldenApple from "./World/Collectables/GoldenApple";
import { collectableType } from "./Utils/CollectablesType";
import { getRigidBodyDesc } from "./Utils/BodyTypes";
import GoldenCarrot from "./World/Collectables/GoldenCarrot";
import Diamond from "./World/Collectables/Diamond";
import Emerald from "./World/Collectables/Emerald";
import Debug from "./Utils/Debug";
import { PaneArgs } from "./Types/callbacks.types";
import ENUMS, { TEXTURES } from "./Utils/Enums";
import Block from "./World/Blocks/Block";
import { getTextureIndex, getTextureName } from "./Utils/BlocksTexture";
import Grass from "./World/Blocks/Grass";
import QuestionBlock from "./World/Blocks/QuestionBlock";
import Lava from "./World/Blocks/Lava";
import { mapLayersName, mapSize } from "./Utils/sources";
import Enemy from "./World/Mobs/Enemy";
import Zombie from "./World/Mobs/Zombie";
import Water from "./World/Blocks/Water";
import Log from "./World/Blocks/Log";
import Oak from "./World/Trees/Oak";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";
import Birch from "./World/Trees/Birch";
import House from "./World/Structures/House";

interface blockUniform {
  [uniform: string]: IUniform<any>
  uDepth: IUniform< number >
  uDiffuse: IUniform< Texture | null>
}

export default class MapBuilder {
  
  game: Game
  debug: Debug
  resources: Resources
  context: CanvasRenderingContext2D | null
  canvas: HTMLCanvasElement
  physics: Physics
	scene: Scene
  uniforms: blockUniform = {
		uDepth: {
			value: 0,
		},
		uDiffuse: {
			value: null,
		},
	}
  blocksMaterial: ShaderMaterial | MeshStandardMaterial

  constructor() {

    this.game = new Game()
    this.debug = this.game.debug
    this.resources = this.game.resources  
    this.physics = this.game.physics
		this.scene = this.game.world.scene

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d', { willReadFrequently: true })

    if(!this.context) {
      throw new Error('CanvasRenderingContext2D not supported')
    }

    this.blocksMaterial = this.game.world.materials.blocksMaterial

  }

  createMapMesh() {

    const { blocksMaterial, lavaStillMaterial, waterMaterial } = this.game.world.materials

    const materials = [
      blocksMaterial,
      lavaStillMaterial,
      waterMaterial
    ]

    materials.forEach(mat => {

      const geometries = Block.BLOCKS.reduce((acc,block) => {

        if(block.merge && block.material.name === mat.name) {
          const {x,y,z} = block.position
          block.geometry!.translate(x,y,z)
          acc.push(block.geometry!)
        }

        return acc
      },[] as BufferGeometry[])

      if(geometries.length) {
        const mesh = new Mesh(BufferGeometryUtils.mergeGeometries(geometries),mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        this.scene.add(mesh)
      }



    })

    
  }

  build() {
    // const layer_0: ImageData | undefined = this.getTextureData('layer-0')
    // const layer_s: ImageData | undefined = this.getTextureData('layer-s')
    // const backgroundData: ImageData | undefined = this.getTextureData('background')
    // const background2Data: ImageData | undefined = this.getTextureData('background-2')
    // const frontgroundData: ImageData | undefined = this.getTextureData('frontground')
    // const frontground2Data: ImageData | undefined = this.getTextureData('frontground-2')
    this.buildSpecialBlocks()

    for (const key in mapLayersName) {
      const data: ImageData | undefined = this.getTextureData(key)
      const depth = mapLayersName[key]
      this.buildFixedBlocks(data,depth)
    }

    // for (let i = 0; i < 7; i++) {
    //   new Block({ position: new Vector3(5,-4 - i,0), textureIndex: getTextureIndex('STONE')})
      
    // }

    // for (let i = 0; i < 100; i++) {
    //   for (let k = 0; k < 20; k++) {
    //     new Grass({ position: new Vector3(i,0,k - 10) })
    //     new Grass({ position: new Vector3(-1-i,0,k - 10) })
    //   }
    // }

    // new Block({ position: new Vector3(2,4,0), textureIndex: getTextureIndex('STONE')})
    // new Block({ position: new Vector3(4,4,0), textureIndex: getTextureIndex('STONE')})
    // new Block({ position: new Vector3(6,4,0), textureIndex: getTextureIndex('STONE')})

    // new QuestionBlock({ position: new Vector3(-2,4,0), content: 1 })
    // new QuestionBlock({ position: new Vector3(3,4,0), content: 1 })
    // new QuestionBlock({ position: new Vector3(5,4,0), content: 1 })
    // new QuestionBlock({ position: new Vector3(4,8,0), content: 1 })

    // new Oak({ position: new Vector3(-7.3,1,-8)})
    new Oak({ position: new Vector3(15,7,-6)})
    new Oak({ position: new Vector3(10,8,-12)})
    new Oak({ position: new Vector3(20,8,-14)})
    new Oak({ position: new Vector3(16,6,-18)})
    new Oak({ position: new Vector3(30,6,-20)})
    new Oak({ position: new Vector3(35,11,-15)})
    new Oak({ position: new Vector3(35,8,-8)})
    new Oak({ position: new Vector3(42,9,-6)})
    new Oak({ position: new Vector3(37,4,0)})
    
    new Birch({ position: new Vector3(5,7,-8)})
    new Birch({ position: new Vector3(-5,6,-12)})
    new Birch({ position: new Vector3(-10,5,-18)})
    new Birch({ position: new Vector3(-16,4,-15)})
    new Birch({ position: new Vector3(0,6,-18)})
    new Birch({ position: new Vector3(-10,4,-8)})
    new Birch({ position: new Vector3(20,4,-3)})
    new Birch({ position: new Vector3(12,6,-2)})
    new Birch({ position: new Vector3(-10,6,2)})
    // new Birch({ position: new Vector3(0,1,-6)})
    // new Birch({ position: new Vector3(5,0,-12)})


    // this.buildFixedBlocks(backgroundData, -1)
    // for (let i = 0; i < 2; i++) {
    //   this.buildFixedBlocks(background2Data, -2 - i)
    // }
    // this.buildFixedBlocks(frontgroundData, 1)
    // for (let i = 0; i < 2; i++) {
    //   this.buildFixedBlocks(frontground2Data, 2 + i)
    // }

    // console.log(Block.BLOCKS)

    // this.buildSpecialBlocks()
    // this.createCollectables()
    this.createEnemies()

    // new House()

    // new Lava({ position: new Vector3(-17.5,22,0) })
    // new Water({ position: new Vector3(-20.5,21,-2)})
    // new Water({ position: new Vector3(-20.5,21,-1)})

    // new Water({ position: new Vector3(-20.5,21,1)})
    // new Water({ position: new Vector3(-21.5,21,1)})
    // new Water({ position: new Vector3(-20.5,21,0)})
    // new Water({ position: new Vector3(-20.5,22,0)})
    // new Water({ position: new Vector3(-20.5,23,0)})
    // new Water({ position: new Vector3(-20.5,24,0)})
    // new Water({ position: new Vector3(-20.5,25,0)})
    // new Water({ position: new Vector3(-20.5,26,0)})
    // new Water({ position: new Vector3(-20.5,27,0)})
    // new Water({ position: new Vector3(-21.5,21,0)})
    // new Water({ position: new Vector3(-19.5,21,0)})
    // new Water({ position: new Vector3(-18.5,21,0)})
    // new Water({ position: new Vector3(-21.5,19,0)})
    // new Water({ position: new Vector3(-18.5,21,1)})
    // new Water({ position: new Vector3(-19.5,21,1)})
    // new Water({ position: new Vector3(-17.5,21,1)})
    // new Water({ position: new Vector3(-18.5,20,1)})
    // new Water({ position: new Vector3(-19.5,20,1)})
    // new Water({ position: new Vector3(-20.5,20,1)})
    // new Water({ position: new Vector3(-21.5,20,1)})

    // new Oak({ position: new Vector3(-12.3,23,-3)})
    // new Oak({ position: new Vector3(-7.3,24,-8)})
    // new Oak({ position: new Vector3(7,23,-6)})

    // new Birch({ position: new Vector3(-12.3,23,-3)})

    // const shadowPlane = new PlaneGeometry(200,200)
    // const shadowMesh = new Mesh(shadowPlane, new MeshStandardMaterial({ color: 0xffffff}))
    // shadowMesh.position.z = 3
    // shadowMesh.position.y = 19
    // shadowMesh.castShadow = true
    // shadowMesh.material.colorWrite = false
    // shadowMesh.rotation.x = -Math.PI * 0.5
    // this.scene.add(shadowMesh)
    // shadowMesh.onBeforeShadow = () => {
    //   // this.scene.add(shadowMesh)
    //   shadowMesh.visible = true
    //   // shadowMesh.position.x += 0.01
    //   console.log('before shadow')
    //   // shadowMesh.rotation.y = 0
    // }
    // shadowMesh.onAfterShadow = () => {
    //   // this.scene.remove(shadowMesh)
    //   shadowMesh.visible = true
    // }
    // shadowMesh.onBeforeRender = () => {
    //   this.scene.add(shadowMesh)
    // }

    this.createMapMesh()

  }

  createEnemies() {
    const enemiesData: ImageData | undefined = this.getTextureData('layer-e')

    if(!enemiesData) return
    const data = enemiesData.data

    for (let i = 0; i < data.length / 4; i++) {
      const enemyType = data[i * 4 + 0]
      const dropItem = data[i * 4 + 1]
      const bounds = data[i * 4 + 2]
      const a = data[i * 4 + 3]

      if(a === 0) continue 

      const { x,y,z } = this.getCoordinatesBy(i,mapSize.width,mapSize.height)

      // console.log('enemy',enemyType,dropItem)

      new Zombie({ position: new Vector3(x,y+1,z), bounds: Math.max(bounds - 0.05,0) } )
    }
  }

  createCollectables() {
    // console.log('build collectables')
    const collectablesData: ImageData | undefined = this.getTextureData('collectables')

    if(!collectablesData) return
    const data = collectablesData.data

    for (let i = 0; i < data.length / 4; i++) {
      const bodyType = data[i * 4 + 0]
      const collectable = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]

      if(a === 0) continue

      const { x,y,z } = this.getCoordinatesBy(i,mapSize.width,mapSize.height)
      // console.log('collectables',collectable)
      switch(collectable) {
        case collectableType.GOLDEN_APPLE:
          // console.log('apple')
          new GoldenApple(new Vector3(x,y,z),bodyType)
          break;
        case collectableType.GOLDEN_CARROT:
          // console.log('apple')
          new GoldenCarrot(new Vector3(x,y,z),bodyType)
          break;
        case collectableType.DIAMOND:
          // console.log('apple')
          new Diamond(new Vector3(x,y,z),bodyType)
          break;
        case collectableType.EMERALD:
          // console.log('apple')
          new Emerald(new Vector3(x,y,z),bodyType)
          break;
      }
      // new GoldApple(new Vector3(x,y,z),g)
      
    }

  }

  buildSpecialBlocks() {
    // console.log('build special blocks')
    const specialBlocksData: ImageData | undefined = this.getTextureData('layer-s')

    if(!specialBlocksData) return
    const data = specialBlocksData.data

    for (let i = 0; i < data.length / 4; i++) {
      const r = data[i * 4 + 0]
      const g = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]

      if(a === 0) continue
      
      this.createSpecialBlock(i,r,g,b,a)
      
    }
  }

  buildFixedBlocks(bodiesData: ImageData | undefined, level = 0) {

    const z = level
    
    if(!bodiesData) return
    const data = bodiesData.data

    for (let i = 0; i < data.length / 4; i++) {
      const r = data[i * 4 + 0]
      const g = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]

      if(a === 0) continue
      
      this.createBlock(i,r,g,b,a,z)
      
    }
  }

  getCoordinatesBy(index: number, width: number, height: number) {

    const x = index % width - width / 2 + 28
    const y = height - Math.floor(index / width) - mapSize.height + 38
    const z = 0

    return {x,y,z}
  }

  createSpecialBlock(i: number,blockType: number,g: number,b: number,a: number) {

    const { x,y,z } = this.getCoordinatesBy(i,mapSize.width,mapSize.height)

    const position = new Vector3(x,y,z)

    switch(blockType) {
      case 1:
        // build a ladder
        const length = g
        new Ladder(position,length)
        return
      case 2:
        // build a ladder
        const content = g
        const quantity = b
        console.log('question block')
        // new Ladder(new Vector3(x,y,z),length)
        new QuestionBlock({ position, r: 1, b: quantity, content })
        return
      case 3:
        const height = g
        const width = b
        new Lava({ position, height, width })
      default:
        return null
    }

  }

  createBlock(i: number,r: number,textureIndex: number,b: number,a: number, depth :number) {

    const { x,y } = this.getCoordinatesBy(i,mapSize.width,mapSize.height)
    const z = depth

    // WATER
    if(textureIndex === 20) {
      new Water({ position: new Vector3(x,y,z)})
      return
    }

    if(textureIndex === 19) {
      new Lava({ position: new Vector3(x,y,z)})
      return
    }

    const textureName = getTextureName(textureIndex)

    switch(textureName) {
      case TEXTURES.GRASS:
        new Grass({ position: new Vector3(x,y,z),r,textureIndex,b})
        break
      default:
        new Block({ position: new Vector3(x,y,z),r,textureIndex,b})
    }

	}

  getTextureData(name: string) {

    if(!this.context) return

    const item = this.resources.items[name] as HTMLImageElement
    if(!item) {
      throw new Error(`Texture Map not found with name: ${name}`)
    }

    const width = item.width
    const height = item.height

    // console.log(width,height)

    // clear the canvas from previous drawn image
    this.context.clearRect(0, 0, width, height)

    this.context.drawImage(item , 0, 0, width, height)
		return this.context.getImageData(0, 0, width, height)
    
  }
}
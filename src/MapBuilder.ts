import {  BoxGeometry, BufferAttribute, Euler, IUniform, MathUtils, Mesh, MeshStandardMaterial,  PlaneGeometry, Scene, ShaderMaterial, Texture, Uniform, Vector3 } from "three";
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
import { mapSize } from "./Utils/sources";
import Enemy from "./World/Mobs/Enemy";
import Zombie from "./World/Mobs/Zombie";
import Water from "./World/Blocks/Water";
import Log from "./World/Blocks/Log";

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

  build() {
    const bodiesData: ImageData | undefined = this.getTextureData('bodies')
    const backgroundData: ImageData | undefined = this.getTextureData('background')
    const background2Data: ImageData | undefined = this.getTextureData('background-2')
    const frontgroundData: ImageData | undefined = this.getTextureData('frontground')
    const frontground2Data: ImageData | undefined = this.getTextureData('frontground-2')
    this.buildFixedBlocks(bodiesData)
    this.buildFixedBlocks(backgroundData, 'BACKGROUND')
    this.buildFixedBlocks(background2Data, 'BACKGROUND-2')
    this.buildFixedBlocks(frontgroundData, 'FRONTGROUND')
    this.buildFixedBlocks(frontground2Data, 'FRONTGROUND-2')
    this.buildSpecialBlocks()
    this.createCollectables()
    this.createEnemies()

    new Water({ position: new Vector3(-20.5,20,0), textureIndex: 9, depth: 0, r: 0, b: 0})
    new Water({ position: new Vector3(-20.5,20,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,20,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,20,0), textureIndex: 9, depth: 0, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,20,0), textureIndex: 9, depth: -1, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,20,0), textureIndex: 9, depth: -2, r: 0, b: 0})
    new Water({ position: new Vector3(-19.5,20,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-19.5,19,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-20.5,19,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,19,0), textureIndex: 9, depth: 1, r: 0, b: 0})
    new Water({ position: new Vector3(-21.5,19,0), textureIndex: 9, depth: 0, r: 0, b: 0})
    new Water({ position: new Vector3(-18.5,20,0), textureIndex: 9, depth: 1, r: 0, b: 0})

    new Log({ position: new Vector3(-12.5,23,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0})
    new Log({ position: new Vector3(-12.5,24,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0})
    new Log({ position: new Vector3(-12.5,25,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0})
    new Log({ position: new Vector3(-12.5,26,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0})
    new Log({ position: new Vector3(-13.5,26,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0, rotation: new Euler(Math.PI * 0.5,0,0)})
    new Log({ position: new Vector3(-13.5,26,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -1, b: 0, rotation: new Euler(Math.PI * 0.5,0,0)})
    new Log({ position: new Vector3(-11.5,25,0), r: 0, textureSideIndex: getTextureIndex(TEXTURES.OAK_LOG), textureTopIndex: getTextureIndex(TEXTURES.OAK_LOG_TOP),depth: -2, b: 0, rotation: new Euler(0,0,Math.PI * 0.5)})
    // leaves
    new Block({ position: new Vector3(-12.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 0, depth:-1 })
    new Block({ position: new Vector3(-11.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 0, depth:-1 })
    new Block({ position: new Vector3(-10.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 0, depth:-1 })
    new Block({ position: new Vector3(-12.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    new Block({ position: new Vector3(-12.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    new Block({ position: new Vector3(-11.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    new Block({ position: new Vector3(-11.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: 0})
    new Block({ position: new Vector3(-13.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    new Block({ position: new Vector3(-14.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-13.5,25,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    new Block({ position: new Vector3(-13.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    new Block({ position: new Vector3(-13.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -3})
    new Block({ position: new Vector3(-13.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-12.5,28,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-11.5,28,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-10.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-10.5,26,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -2})
    new Block({ position: new Vector3(-12.5,25,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    new Block({ position: new Vector3(-12.5,28,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    new Block({ position: new Vector3(-11.5,28,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})
    new Block({ position: new Vector3(-11.5,27,0), textureIndex: getTextureIndex(TEXTURES.OAK_LEAVES),r: 1, depth: -1})

  }

  createEnemies() {
    const enemiesData: ImageData | undefined = this.getTextureData('enemies')

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

      new Zombie({ position: new Vector3(x,y+1,z), buonds: Math.max(bounds - 0.05,0) } )
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
    const specialBlocksData: ImageData | undefined = this.getTextureData('special-bodies')

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

  buildFixedBlocks(bodiesData: ImageData | undefined, level = 'PLAYER') {

    let z = 0

    switch(level) {
      case 'BACKGROUND':
        z = -1
      break
      case 'BACKGROUND-2':
        z = -2
      break
      case 'FRONTGROUND':
        z = 1
      break
      case 'FRONTGROUND-2':
        z = 2
      break
    }
    
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

    const x = index % width - width / 2
    const y = height - Math.floor(index / width)
    const z = 0

    return {x,y,z}
  }

  getMesh(textureDepth: number,brightness: number,opacity: number, depth: number) {

    // const material = this.game.debug.active ? new MeshStandardMaterial() : this.blocksMaterial
    const material = this.getMaterial(this.debug.params.texturePack)

    return new Mesh(
			this.getGeometry(textureDepth, brightness,opacity,depth),
			material
		)
  }

  getMaterial(type: string) {
    return type === ENUMS.TEXTURE_PLACEHOLDER ? new MeshStandardMaterial() : this.blocksMaterial
  }

  getGeometry(textureDepth: number, brightness: number,opacity: number,depth: number) {

    // console.log('alpha:',opacity,textureDepth)

    const bright = MathUtils.mapLinear(brightness,0,200,-1,1)

    const box = new BoxGeometry(1, 1)


    const uvAttribute = box.getAttribute('uv')
    // console.log(uvAttribute)
    const uvCount = uvAttribute.count
    const uvSize = 3
    // console.log(uvAttribute)
    const uvArray = new Float32Array(uvCount * uvSize)
    const newUvAttribute = new BufferAttribute(uvArray, 3)
    // console.log(newUvAttribute)

    const brightArray = new Float32Array(uvCount * 1)
    const brightAttribute = new BufferAttribute(brightArray, 1)

    const opacityArray = new Float32Array(uvCount * 1)
    const opacityAttribute = new BufferAttribute(opacityArray, 1)

    for (let i = 0; i < uvCount; i++) {
      const u = uvAttribute.getX(i)
      const v = uvAttribute.getY(i)

      newUvAttribute.setXYZ(i, u, v, textureDepth)
      // brightAttribute.setX(i,bright)
      brightAttribute.setX(i,0)
      opacityAttribute.setX(i,opacity / 255)
    }

    newUvAttribute.needsUpdate = true
    brightAttribute.needsUpdate = true
    opacityAttribute.needsUpdate = true

    // plane.deleteAttribute('uv')
    box.setAttribute('aUv', newUvAttribute)
    box.setAttribute('aBright', brightAttribute)
    box.setAttribute('aOpacity', opacityAttribute)

    box.translate(0,0,depth)

    return box
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
        new QuestionBlock({ position, r: 1, textureIndex: 9, b: quantity, depth: 0, content })
        return
      case 3:
        const height = g
        const width = b
        new Lava({ position, height, width, depth: 0 })
      default:
        return null
    }

  }

  createBlock(i: number,r: number,textureIndex: number,b: number,a: number, depth :number) {

    const { x,y,z } = this.getCoordinatesBy(i,mapSize.width,mapSize.height)

    const textureName = getTextureName(textureIndex)

    switch(textureName) {
      case TEXTURES.GRASS:
        new Grass({ position: new Vector3(x,y,z),r,textureIndex,b,depth})
        break
      default:
        new Block({ position: new Vector3(x,y,z),r,textureIndex,b,depth})
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
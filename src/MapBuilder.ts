import {  BoxGeometry, BufferAttribute, IUniform, MathUtils, Mesh, MeshStandardMaterial,  PlaneGeometry, Scene, ShaderMaterial, Texture, Uniform, Vector3 } from "three";
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
import ENUMS from "./Utils/Enums";

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
  blocksMaterial: ShaderMaterial

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
    const frontgroundData: ImageData | undefined = this.getTextureData('frontground')
    this.buildFixedBlocks(bodiesData)
    this.buildFixedBlocks(backgroundData, 'BACKGROUND')
    this.buildFixedBlocks(frontgroundData, 'FRONTGROUND')
    this.buildSpecialBlocks()
    this.createCollectables()

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

      const collectableSrc = this.resources.getSourceByName('collectables') as Required<Source>
      const { x,y,z } = this.getCoordinatesBy(i,collectableSrc.sizes.width,collectableSrc.sizes.height)
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
      case 'FRONTGROUND':
        z = 1
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

  createSpecialBlock(i: number,r: number,g: number,b: number,a: number) {

    // console.log('special block',i,r,g,b,a)
    const specialBodiesSrc = this.resources.getSourceByName('special-bodies') as Required<Source>

    const { x,y,z } = this.getCoordinatesBy(i,specialBodiesSrc.sizes.width,specialBodiesSrc.sizes.height)

    switch(r) {
      case 1:
        // build a ladder
        const length = g
        new Ladder(new Vector3(x,y,z),length)
        return
      default:
        return null
    }

  }

  createBlock(i: number,r: number,g: number,b: number,a: number, depth :number) {

    let entity: Entity = {}
    const bodiesSrc = this.resources.getSourceByName('bodies') as Required<Source>
    const { x,y,z } = this.getCoordinatesBy(i,bodiesSrc.sizes.width,bodiesSrc.sizes.height)

    // Red channel for body type
    const bodyDesc = getRigidBodyDesc(r)

    if(bodyDesc) {
      bodyDesc.setTranslation(x, y, z)
      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      entity = this.physics.addEntity(bodyDesc, colliderDesc)
    }

    const mesh = this.getMesh(g,b,a,depth)

    this.debug.on('texturePackChange',(e) => {
      const event = e as PaneArgs
      mesh.material = this.getMaterial(event.value)
    })

    if(mesh) {
      mesh.position.set(x,y,z)
      entity.mesh = mesh

		  this.scene.add(entity.mesh)
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
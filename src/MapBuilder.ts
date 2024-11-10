import { BoxGeometry, BufferAttribute, IUniform, MathUtils, Mesh, MeshStandardMaterial, MeshStandardMaterialParameters, PlaneGeometry, Scene, ShaderMaterial, Texture, Uniform } from "three";
import Game from "./Game";
import Physics from "./Physics";
import Resources from "./Utils/Resources";
import RAPIER from "@dimforge/rapier3d";
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

import { Source } from "./Types/resources.types";
import { Entity } from "./Types/entity.types";
import ChestBlock from "./World/ChestBlock";

interface blockUniform {
  [uniform: string]: IUniform<any>
  uDepth: IUniform< number >
  uDiffuse: IUniform< Texture | null>
}

export default class MapBuilder {
  
  game: Game
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
    this.resources = this.game.resources  
    this.physics = this.game.physics
		this.scene = this.game.world.scene

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d', { willReadFrequently: true })

    if(!this.context) {
      throw new Error('CanvasRenderingContext2D not supported')
    }

    this.blocksMaterial = new ShaderMaterial({
			uniforms: this.uniforms,
			fragmentShader: fragment,
			vertexShader: vertex,
      transparent: true,
		})

    this.uniforms.uDiffuse.value = this.resources.items['blocks'] as Texture

  }

  build() {

    const bodiesData: ImageData | undefined = this.getTextureData('bodies')
    if(!bodiesData) return
    const data = bodiesData.data

    for (let i = 0; i < data.length / 4; i++) {
      const r = data[i * 4 + 0]
      const g = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]

      if(a === 0) continue
      
      this.createBlock(i,r,g,b,a)
      
    }

  }

  getCoordinatesBy(index: number, width: number, height: number) {

    const x = index % width - width / 2
    const y = height - Math.floor(index / width)
    const z = 0

    return {x,y,z}
  }

  getMesh(textureDepth: number,brightness: number,opacity: number) {

    return new Mesh(
			this.getGeometry(textureDepth, brightness,opacity),
			this.blocksMaterial
		)
  }

  getGeometry(textureDepth: number, brightness: number,opacity: number) {

    console.log('alpha:',opacity,textureDepth)

    const bright = MathUtils.mapLinear(brightness,0,200,-1,1)

    const plane = new PlaneGeometry(1, 1)

    const uvCount = 4
    const uvSize = 3
    const uvAttribute = plane.getAttribute('uv')
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
      brightAttribute.setX(i,bright)
      opacityAttribute.setX(i,opacity / 255)
    }

    newUvAttribute.needsUpdate = true
    brightAttribute.needsUpdate = true
    opacityAttribute.needsUpdate = true

    // plane.deleteAttribute('uv')
    plane.setAttribute('aUv', newUvAttribute)
    plane.setAttribute('aBright', brightAttribute)
    plane.setAttribute('aOpacity', opacityAttribute)

    return plane
  }

  createBlock(i: number,r: number,g: number,b: number,a: number) {

    let entity: Entity = {}
    const bodiesSrc = this.resources.getSourceByName('bodies') as Required<Source>
    const { x,y,z } = this.getCoordinatesBy(i,bodiesSrc.sizes.width,bodiesSrc.sizes.height)

    // Red channel for body type
    const bodyDesc = this.getRigidBodyDesc(r)

    if(bodyDesc) {
      bodyDesc.setTranslation(x, y, z)
      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      entity = this.physics.addEntity(bodyDesc, colliderDesc)
    }

    const mesh = this.getMesh(g,b,a)

    if(mesh) {
      mesh.position.set(x,y,z)
      entity.mesh = mesh

		  this.scene.add(entity.mesh)
    }

    // if(r === 255 && b === 0) {
    //   new ChestBlock(x,y,z)
    //   return
    // } else if(r === 0) {
    //   const bodyDesc = RAPIER.RigidBodyDesc.fixed()
		// 	.setTranslation(x, y, z)
    //   const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    //   entity = this.physics.addEntity(bodyDesc, colliderDesc)
    // }

		// entity.mesh = this.getMesh(r,g,b)
    // entity.mesh.position.set(x,y,z)

		// this.scene.add(entity.mesh)
	}

  getRigidBodyDesc(bodyType = 0 ) {

    switch(bodyType) {
      case 0:
        return null
      case 1: 
        return RAPIER.RigidBodyDesc.fixed()
      case 2:
        RAPIER.RigidBodyDesc.dynamic()
      default:
        return null
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

    console.log(width,height)

    this.context.drawImage(item , 0, 0, width, height)
		return this.context.getImageData(0, 0, width, height)
    
  }
}
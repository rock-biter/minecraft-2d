import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import Game from "./Game";
import Physics from "./Physics";
import Resources from "./Utils/Resources";
import RAPIER from "@dimforge/rapier3d";

import { Source } from "./Types/resources.types";
import { Entity } from "./Types/entity.types";
import ChestBlock from "./World/ChestBlock";

export default class MapBuilder {
  
  game: Game
  resources: Resources
  context: CanvasRenderingContext2D | null
  canvas: HTMLCanvasElement
  physics: Physics
	scene: Scene

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
      
      this.createBlock(i,r,g,b)
      
    }

  }

  getCoordinatesBy(index: number, width: number, height: number) {

    const x = index % width - width / 2
    const y = height - Math.floor(index / width)
    const z = 0

    return {x,y,z}
  }

  getMesh(r: number,g: number,b: number) {

    let color = 0xffffff
    switch(r) {
      case 0:
        color = 0x555555
      case 255:
        color = 0xffffff
      case 100:
        color = 0x0000ff
      default:
        color = 0xfefefe
    }

    return new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshStandardMaterial({ color })
		)
  }

  createBlock(i: number,r: number,g: number,b: number) {

    let entity: Entity = {}
    const bodiesSrc = this.resources.getSourceByName('bodies') as Required<Source>
    const { x,y,z} = this.getCoordinatesBy(i,bodiesSrc.sizes.width,bodiesSrc.sizes.height)

    if(r === 255 && b === 0) {
      new ChestBlock(x,y,z)
      return
    } else if(r === 0) {
      const bodyDesc = RAPIER.RigidBodyDesc.fixed()
			.setTranslation(x, y, z)
      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      entity = this.physics.addEntity(bodyDesc, colliderDesc)
    }

		entity.mesh = this.getMesh(r,g,b)
    entity.mesh.position.set(x,y,z)

		this.scene.add(entity.mesh)
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
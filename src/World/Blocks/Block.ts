import { BoxGeometry, BufferAttribute, MathUtils, Mesh, MeshStandardMaterial, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from "three";
import Game from "../../Game";
import Resources from "../../Utils/Resources";
import Debug from "../../Utils/Debug";
import ENUMS from "../../Utils/Enums";
import Physics from "../../Physics";
import { Entity } from "../../Types/entity.types";
import { getRigidBodyDesc } from "../../Utils/BodyTypes";
import RAPIER from "@dimforge/rapier3d";
import { PaneArgs } from "../../Types/callbacks.types";

export interface BlockProps {
  position: Vector3,
  r: number,
  g: number,
  b: number,
  depth: number
}

export default class Block {

  position: Vector3
  r: number
  g: number
  b: number
  depth: number

  game: Game

  constructor({ position = new Vector3(), r, g, b, depth }: BlockProps) {

    this.game = new Game()

    this.position = position
    this.r = r
    this.g = g
    this.b = b
    this.depth = depth

    this.create()

  }

  get debug(): Debug {
    return this.game.debug
  }

  get resources(): Resources {
    return this.game.resources
  }

  get physics(): Physics {
    return this.game.physics
  }

  get scene(): Scene {
    return this.game.world.scene
  }

  get blocksMaterial(): ShaderMaterial {
    return this.game.world.materials.blocksMaterial
  }

  create() {
    // console.log('new block')
    const entity = this.getPhysics()
    const mesh = this.getMesh()

    mesh.position.copy(this.position)
    entity.mesh = mesh

    this.scene.add(entity.mesh)

    if(this.debug.active) {
      this.debug.on('texturePackChange',(e) => {
        const event = e as PaneArgs
        mesh.material = this.getMaterial(event.value)
      })
    }
  }

  getPhysics() {

    let entity: Entity = {}

    // Red channel for body type
    const bodyDesc = getRigidBodyDesc(this.r)

    if(bodyDesc) {
      const { x, y, z } = this.position
      bodyDesc.setTranslation(x, y, z)
      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      entity = this.physics.addEntity(bodyDesc, colliderDesc)
    }

    return entity

  }

  getMesh() {
    return new Mesh(
			this.getGeometry(),
			this.getMaterial()
		)
  }

  getGeometry() {
// console.log('alpha:',opacity,textureDepth)

    // const bright = MathUtils.mapLinear(this.b,0,200,-1,1)

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

      newUvAttribute.setXYZ(i, u, v, this.g)
      // brightAttribute.setX(i,bright)
      brightAttribute.setX(i,0)
      // opacityAttribute.setX(i,opacity / 255)
      opacityAttribute.setX(i,1)
    }

    newUvAttribute.needsUpdate = true
    brightAttribute.needsUpdate = true
    opacityAttribute.needsUpdate = true

    // plane.deleteAttribute('uv')
    box.setAttribute('aUv', newUvAttribute)
    box.setAttribute('aBright', brightAttribute)
    box.setAttribute('aOpacity', opacityAttribute)

    box.translate(0,0,this.depth)

    return box
  }

  getMaterial(type?: string) {
    type = type || this.debug.params.texturePack
    return type === ENUMS.TEXTURE_PLACEHOLDER ? new MeshStandardMaterial() : this.blocksMaterial
  }
}
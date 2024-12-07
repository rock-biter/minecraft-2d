import { BoxGeometry, BufferAttribute, BufferGeometry, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from "three";
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
  textureIndex: number | number[],
  b?: number,
  depth?: number
  height?: number
  width?: number
}

export default class Block {

  position: Vector3
  r: number
  textureIndex: number | number[]
  b: number
  depth: number

  game: Game

  entity!: Entity
  width: number
  height: number

  constructor({ position = new Vector3(), r, textureIndex, b = 0, depth, width = 1, height = 1 }: BlockProps) {

    this.game = new Game()

    this.width = width
    this.height = height

    this.position = position
    // this.position.z = 
    this.r = r
    this.textureIndex = textureIndex
    this.b = b
    this.depth = depth ?? this.position.z

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

  get material(): ShaderMaterial | MeshStandardMaterial | MeshBasicMaterial {
    return this.game.world.materials.blocksMaterial
  }

  get geometry(): BufferGeometry | undefined {
    return this.entity.mesh?.geometry
  }

  create() {
    // console.log('new block')
    const entity = this.getPhysics()
    const mesh = this.getMesh()

    mesh.position.copy(this.position)
    mesh.castShadow = true
    mesh.receiveShadow = true
    entity.mesh = mesh

    this.scene.add(entity.mesh)

    if(this.debug.active) {
      this.debug.on('texturePackChange',(e) => {
        const event = e as PaneArgs
        mesh.material = this.getMaterial(event.value)
      })
    }

    this.entity = entity
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

    const geom = this.getGeometry()
    this.setGeometryAttributes(geom)

    return new Mesh(
			geom,
			this.getMaterial()
		)
  }

  getGeometry(): BufferGeometry {
// console.log('alpha:',opacity,textureDepth)

    // const bright = MathUtils.mapLinear(this.b,0,200,-1,1)

    const box = new BoxGeometry(1, 1,1)

    return box
  }

  setGeometryAttributes(geometry: BufferGeometry) {
    const uvAttribute = geometry.getAttribute('uv')
    const normalAttribute = geometry?.getAttribute('normal') as BufferAttribute
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

    const [t, r, f, l, bk, b] = this.getTextureIndexes()

    for (let i = 0; i < uvCount; i++) {
      const u = uvAttribute.getX(i)
      const v = uvAttribute.getY(i)
      const y = normalAttribute.getY(i)
      const x = normalAttribute.getX(i)
      const z = normalAttribute.getZ(i)

      newUvAttribute.setXYZ(i, u, v, 0)

      if(y === 1) {
        newUvAttribute.setZ(i, t)
      }

      if(y === -1) {
        newUvAttribute.setZ(i, b)
      }

      if(x === 1) {
        newUvAttribute.setZ(i, r)
      }

      if(x === -1) {
        newUvAttribute.setZ(i, l)
      }

      if(z === 1) {
        newUvAttribute.setZ(i, f)
      }

      if(z === -1) {
        newUvAttribute.setZ(i, bk)
      }

      // brightAttribute.setX(i,bright)
      brightAttribute.setX(i,0)
      // opacityAttribute.setX(i,opacity / 255)
      opacityAttribute.setX(i,1)
    }

    newUvAttribute.needsUpdate = true
    brightAttribute.needsUpdate = true
    opacityAttribute.needsUpdate = true

    // plane.deleteAttribute('uv')
    geometry.setAttribute('aUv', newUvAttribute)
    geometry.setAttribute('aBright', brightAttribute)
    geometry.setAttribute('aOpacity', opacityAttribute)

    // geometry.translate(0,0,this.depth)
  }

  getTextureIndexes(): number[] {

    let t, r, f, l, bk, b

    if(Array.isArray(this.textureIndex)) {

      switch(this.textureIndex.length) {
        case 2:
          t = this.textureIndex[0]
          b = r = l = f = bk = this.textureIndex[1]
          break
        case 3:
          t = this.textureIndex[0]
          r = l = f = bk = this.textureIndex[1]
          b = this.textureIndex[2]
          break
        case 6:
          t = this.textureIndex[0]
          r = this.textureIndex[1]
          f = this.textureIndex[2]
          l = this.textureIndex[3]
          bk = this.textureIndex[4]
          b = this.textureIndex[5]
          break
      } 

    } else {
      t = b = r = l = f = bk = this.textureIndex
    }

    return [t, b, l, r, f, bk] as number[]

  }

  getMaterial(type?: string) {
    type = type || this.debug.params.texturePack
    return type === ENUMS.TEXTURE_PLACEHOLDER ? new MeshStandardMaterial() : this.material
  }
}
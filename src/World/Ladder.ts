import { BoxGeometry, BufferAttribute, Mesh, MeshStandardMaterial, Plane, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from "three";
import Game from "../Game";
import Physics from "../Physics";
import Resources from "../Utils/Resources";
import { Entity } from "../Types/entity.types";
import RAPIER from "@dimforge/rapier3d";
import { CollideArg, PaneArgs } from "../Types/callbacks.types";
import { texturesIndexes } from "../Utils/BlocksTexture";
import { BufferGeometryUtils } from "three/examples/jsm/Addons";
import ENUMS, { TEXTURES } from "../Utils/Enums";

export default class Ladder {

  game: Game
  scene: Scene
  physics: Physics
  resources: Resources
  position: Vector3 
  length: number
  textureName = 'LADDER'
  entity!: Entity
  blocksMaterial: ShaderMaterial | MeshStandardMaterial

  constructor(position = new Vector3(), length: number) {
    this.game = new Game()
    this.scene = this.game.world.scene
    this.resources = this.game.resources
    this.physics = this.game.physics

    this.position = position
    this.length = length

    this.blocksMaterial = this.game.world.materials.blocksMaterial

    this.create(position,length)
  }

  create(position: Vector3, length: number) {

    this.entity = {}

    const mesh = this.getMesh(position,length)
    mesh.receiveShadow = true
    mesh.renderOrder = 1
    this.entity.mesh = mesh
    this.entity.collider = this.getCollider(position,length)
    this.scene.add(mesh)

    if(this.game.debug.active) {
      this.game.debug.on('texturePackChange',(e) => {
        const event = e as PaneArgs
        mesh.material = this.getMaterial(event.value)
      })
    }

  }

  getMesh(position: Vector3, length: number) {

    const geometry = this.getGeometry(length)
    geometry.translate(0,0,-0.4)
    const mesh = new Mesh(
			geometry,
			this.getMaterial()
		)

    mesh.position.copy(position)
    return mesh
  }

  getMaterial(type ?: string) {

    type = type || this.game.debug.params.texturePack
    switch(type) {
      case ENUMS.TEXTURE_MINECRAFT_TRAILER:
        return this.game.world.materials.ladderMaterial
      default: 
        return new MeshStandardMaterial({ color: 0x666666})
    }

  }

  getGeometry(length: number) {

    const geometries = []

    for (let i = 0; i < length; i++) {
      const plane = this.getPlaneGeometry();
      plane.translate(0,-i,0)

      geometries.push(plane)
      
    }

    const geometry = BufferGeometryUtils.mergeGeometries(geometries)

    return geometry

  }

  getPlaneGeometry() {
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

      // newUvAttribute.setXYZ(i, u, v, texturesIndexes['LADDER'])
      newUvAttribute.setXYZ(i, u, v,9.6)
      brightAttribute.setX(i,0)
      opacityAttribute.setX(i,1)
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

  getCollider(position: Vector3, height = 1) {

    const {x,y,z} = position
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.25,height/2,0.5)
    .setTranslation(x, y - height/2 + 0.5, z)
    .setSensor(true)

    const {collider} = this.physics.addSensor(colliderDesc)

    this.physics.on('collide',(arg) => {
      const {handle1, handle2, started} = arg as CollideArg
			if(!this.entity || !this.entity?.collider || !this.game.world.player) return

      if ([handle1, handle2].includes(this.entity?.collider?.handle)) {
        // console.log('collision with ladder')

        this.game.world.player.isOnLadder = started
        if(!started) {
          this.game.world.player.grabLadder = false
        }

      }
    })

    return collider


  }



}
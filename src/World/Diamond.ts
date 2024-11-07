import { CylinderGeometry, Mesh, MeshStandardMaterial, Scene } from 'three'
import Game from '../Game'
import Events from '../Utils/Events'
import * as RAPIER from '@dimforge/rapier3d'
import gsap from 'gsap'
import Physics from '../Physics'

import { Entity } from '../Types/entity.types'

import { CollideArg } from '../Types/callbacks.types'

export default class Diamond extends Events {

	game: Game
	physics: Physics
	scene: Scene
	entity: Entity = {}

	constructor(x: number, y: number, z: number) {
		super()

		this.game = new Game()
		this.physics = this.game.physics
		this.scene = this.game.world.scene

		this.create(x, y, z)
	}

	create(x: number, y: number, z: number) {
		const geometry = new CylinderGeometry(0.3, 0.3, 0.1)
		const mesh = new Mesh(
			geometry,
			new MeshStandardMaterial({ color: 'gold', transparent: true })
		)

		mesh.rotation.x = Math.PI * 0.5
		mesh.position.set(x, y, z)

		// const bodyDesc = RAPIER.RigidBodyDesc.fixed()
		// 	.setTranslation(x, y, z)
		// 	.setRotation(mesh.quaternion)

		const colliderDesc = RAPIER.ColliderDesc.cylinder(0.05, 0.3)
			.setTranslation(x, y, z)
			.setRotation(mesh.quaternion)
			.setSensor(true)
		this.entity = this.physics.addSensor(colliderDesc)
		this.entity.mesh = mesh
		// entity.collider.setActiveEvents(true)
		mesh.rotation.x = 0
		mesh.geometry.rotateX(Math.PI * 0.5)

		this.scene.add(this.entity.mesh)

		this.physics.on('collide', (arg) => {

			const {handle1, handle2} = arg as CollideArg
			if(!this.entity || !this.entity?.collider) return

			if ([handle1, handle2].includes(this.entity?.collider?.handle)) {
				
				this.physics.removeEntity(this.entity)

				if(!this.entity.mesh) return 
				
				gsap.to(this.entity.mesh.position, { y: '+=2' })
				gsap.to(this.entity.mesh.rotation, { y: Math.PI * 2 })
				gsap.to(this.entity.mesh.material, {
					opacity: 0,
					onComplete: () => {
						this.scene.remove(this.entity.mesh as Mesh)
					},
				})
			}
		})
	}
}

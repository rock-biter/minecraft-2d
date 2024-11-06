import Game from '../Game'
import * as RAPIER from '@dimforge/rapier3d'
import Events from '../Utils/Events'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import Diamond from './Diamond'

export default class Floor extends Events {
	constructor(size = 10) {
		super()

		this.size = size
		this.game = new Game()
		this.physics = this.game.physics
		this.scene = this.game.world.scene

		const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(this.size * 0.5, 0.5, 0.5)
		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.mesh = new Mesh(
			new BoxGeometry(this.size, 1, 1),
			new MeshStandardMaterial({ color: 'lightgray' })
		)
		this.entity.mesh.position.y = -0.5

		this.scene.add(this.entity.mesh)

		this.createBox(0 + 5, 4, 0, 'fixed')
		this.createBox(0 + 6, 4, 0, 'fixed')
		this.createBox(0 + 7, 4, 0, 'fixed')
		this.createBox(0 + 8, 4, 0, 'fixed')
		this.createBox(0 + 9, 4, 0, 'fixed')
		this.createBox(0 + 10, 4, 0, 'fixed')
		this.createBox(0 + 11, 4, 0, 'fixed')
		// this.createBox(0 + 11, 1, 0, 'fixed')

		new Diamond(0 + 6, 5.5, 0)
		new Diamond(0 + 7, 5.5, 0)
		new Diamond(0 + 8, 5.5, 0)
		new Diamond(0 + 9, 5.5, 0)
		new Diamond(0 + 10, 5.5, 0)

		new Diamond(0 + 10, 2, 0)
		new Diamond(0 + 11, 2, 0)
		new Diamond(0 + 12, 2, 0)
		new Diamond(0 + 13, 2, 0)
		new Diamond(0 + 14, 2, 0)

		new Diamond(-3, 2, 0)
		new Diamond(-4, 4, 0)
		new Diamond(-5, 5, 0)
		new Diamond(-6, 5.3, 0)
		new Diamond(-7, 5, 0)
		new Diamond(-8, 4, 0)
		new Diamond(-9, 2, 0)

		// this.createBox(1, 4, 0)
		// this.addRandomBoxes(10)
	}

	addRandomBoxes(num = 10) {
		for (let i = 0; i < num; i++) {
			const x = Math.floor((Math.random() - 0.5) * 50)
			const y = Math.random() * 4 + 1
			const z = 0

			this.createBox(x, y, z)
		}
	}

	createBox(x, y, z, type = 'dynamic') {
		const desc =
			type === 'dynamic'
				? RAPIER.RigidBodyDesc.dynamic
				: RAPIER.RigidBodyDesc.fixed

		const bodyDesc = desc()
			// .lockRotations()
			// .lockTranslations()
			// .enabledTranslations(false, true, false)
			.setTranslation(x, y, z)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
		const entity = this.physics.addEntity(bodyDesc, colliderDesc)
		entity.mesh = new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshStandardMaterial({ color: 'white' })
		)

		this.scene.add(entity.mesh)
	}

	update() {}
}

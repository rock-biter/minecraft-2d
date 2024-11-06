import Game from '../Game'
import * as RAPIER from '@dimforge/rapier3d'
import Events from '../Utils/Events'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export default class Floor extends Events {
	constructor(size = 10) {
		super()

		this.size = size
		this.game = new Game()
		this.physics = this.game.physics
		this.scene = this.game.world.scene

		const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(this.size * 0.5, 0.5, 0.5)
		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.mesh = new Mesh(
			new BoxGeometry(this.size, 1, 1),
			new MeshStandardMaterial({ color: 'lightgray' })
		)
		this.entity.mesh.position.y = -0.5

		this.scene.add(this.entity.mesh)

		this.addRandomBoxes(200)
	}

	addRandomBoxes(num = 10) {
		for (let i = 0; i < num; i++) {
			const x = Math.floor((Math.random() - 0.5) * 50)
			const y = Math.random() * 4 + 1

			const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
				.lockRotations()
				.lockTranslations()
				.enabledTranslations(false, true, false)
				.setTranslation(x, y, 0)
			const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
			const entity = this.physics.addEntity(bodyDesc, colliderDesc)
			entity.mesh = new Mesh(
				new BoxGeometry(1, 1, 1),
				new MeshStandardMaterial({ color: 'white' })
			)

			this.scene.add(entity.mesh)
		}
	}

	update() {}
}

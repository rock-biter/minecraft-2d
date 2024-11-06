import Game from './Game'
import Events from './Utils/Events'
import * as RAPIER from '@dimforge/rapier3d'

export default class Physics extends Events {
	entities = []

	constructor() {
		super()
		this.game = new Game()
		this.time = this.game.time

		this.gravity = new RAPIER.Vector3(0, -9.81, 0)
		// // const gravity = new RAPIER.Vector3(0, -9.81, 0)
		this.instance = new RAPIER.World(this.gravity)

		this.time.on('tick', () => {
			this.update()
		})
	}

	addEntity(rigidBodyDesc, colliderDesc = null) {
		// add entity to the physics
		const RB = this.instance.createRigidBody(rigidBodyDesc)

		const entity = {
			body: RB,
			collider: colliderDesc
				? this.instance.createCollider(colliderDesc, RB)
				: null,
		}

		this.entities.push(entity)

		return entity
	}

	removeEntity() {
		//
	}

	update() {
		this.instance.timestep = this.time.delta * 0.001
		this.instance.step()

		for (const entity of this.entities) {
			const { body, mesh } = entity

			if (mesh) {
				mesh.position.copy(body.translation())
				mesh.quaternion.copy(body.rotation())
			}
		}
	}
}

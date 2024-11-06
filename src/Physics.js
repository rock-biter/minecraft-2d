import Game from './Game'
import Events from './Utils/Events'
import * as RAPIER from '@dimforge/rapier3d'

export default class Physics extends Events {
	entities = []

	constructor() {
		super()
		this.game = new Game()
		this.time = this.game.time

		this.gravity = new RAPIER.Vector3(0, -9.81 * 4, 0)
		// // const gravity = new RAPIER.Vector3(0, -9.81, 0)
		this.instance = new RAPIER.World(this.gravity)
		this.eventQueue = new RAPIER.EventQueue(true)

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

	addSensor(colliderDesc) {
		const entity = {
			collider: this.instance.createCollider(colliderDesc),
		}

		return entity
	}

	removeEntity(entity) {
		//
		entity.body && this.instance.removeRigidBody(entity.body)
		entity.collider && this.instance.removeCollider(entity.collider)

		const index = this.entities.indexOf(entity)

		if (index !== -1) {
			this.entities.splice(index, 1)
		}
	}

	update() {
		this.instance.timestep = this.time.delta * 0.001
		// console.log(this.instance.timestep)
		this.instance.step(this.eventQueue)

		this.eventQueue.drainCollisionEvents((h1, h2, started) => {
			// console.log('collision', h1, h2, started)
			this.trigger('collide', [h1, h2, started])

			// console.log('collision', coll2)
		})

		for (const entity of this.entities) {
			const { body, mesh } = entity

			if (mesh) {
				mesh.position.copy(body.translation())
				mesh.quaternion.copy(body.rotation())
			}
		}
	}
}

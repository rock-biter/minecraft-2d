import Game from './Game'
import Events from './Utils/Events'
import * as RAPIER from '@dimforge/rapier3d'
import Time from './Utils/Time'
import { Mesh } from 'three'

import { Entity } from './Types/entity.types'
import { CollideArg } from './Types/callbacks.types'


export default class Physics extends Events {
	entities: Entity[] = []
	game: Game
	time: Time
	eventQueue: RAPIER.EventQueue
	gravity: RAPIER.Vector3
	instance: RAPIER.World

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

	addEntity(rigidBodyDesc: RAPIER.RigidBodyDesc, colliderDesc: RAPIER.ColliderDesc | null = null) {
		// add entity to the physics
		const RB = this.instance.createRigidBody(rigidBodyDesc)

		const entity = {
			body: RB,
			collider: colliderDesc
				? this.instance.createCollider(colliderDesc, RB)
				: null,
		} as Entity

		this.entities.push(entity)

		return entity
	}

	addSensor(colliderDesc: RAPIER.ColliderDesc) {
		const entity = {
			collider: this.instance.createCollider(colliderDesc),
		}

		return entity
	}

	removeEntity(entity: Entity) {
		//
		entity.body && this.instance.removeRigidBody(entity.body)
		entity.collider && this.instance.removeCollider(entity.collider, false)

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
			this.trigger('collide', { handle1: h1, handle2: h2, started })

			// console.log('collision', coll2)
		})

		for (const entity of this.entities) {
			const { body, mesh } = entity

			if (mesh && body) {
				mesh.position.copy(body.translation())
				mesh.quaternion.copy(body.rotation())
			}
		}
	}
}

import {
	BoxGeometry,
	CapsuleGeometry,
	MathUtils,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	Vector3,
} from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import Inputs from '../Utils/Inputs'
import Events from '../Utils/Events'
import Game from '../Game'
import Controller from '../Utils/Controller'

const _V = new Vector3()

export default class Player extends Events {
	constructor() {
		super()

		this.game = new Game()
		this.scene = this.game.world.scene
		this.physics = this.game.physics
		this.time = this.game.time
		this.inputs = this.game.inputs
		this.controller = Controller.create(0.1)
		this.controller.enableAutostep(0.1, 0.2, true)
		this.controller.enableSnapToGround(0.5)
		this.controller.setApplyImpulsesToDynamicBodies(true)
		this.velocity = new Vector3()
		this.speed = 5
		this.jump = 20

		this.init()
	}

	init() {
		this.createBody()
		this.time.on(
			'tick',
			() => {
				this.updateVelocity()
			},
			4
		)

		this.inputs.on('jump', (args) => {
			// console.log('jump', args)
			// raycast to check if player il close to ground
			this.checkGround() && args && this.velocity.add(_V.set(0, this.jump, 0))
		})
		// this.initInputs()
	}

	getMesh() {
		const geometry = new CapsuleGeometry(0.38, 1)
		const material = new MeshStandardMaterial({ color: 'orange' })

		const mesh = new Mesh(geometry, material)
		this.scene.add(mesh)

		return mesh
	}

	createBody() {
		const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
			.lockTranslations()
			.enabledTranslations(true, true, false)
			.setTranslation(0, 10, 0)
		const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.38).setActiveEvents(
			RAPIER.ActiveEvents['COLLISION_EVENTS']
		)

		colliderDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes['ALL'])

		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.collider
		this.entity.mesh = this.getMesh()

		// this.update()
	}

	checkGround() {
		_V.copy(this.entity.body.translation())
		_V.y -= 0.9
		const ray = new RAPIER.Ray(_V, {
			x: 0,
			y: -1,
			z: 0,
		})
		const maxToi = 0.3
		let solid = false

		const hit = this.physics.instance.castRay(ray, maxToi, solid)

		if (hit != null) {
			// const hitPoint = ray.pointAt(hit.timeOfImpact)
			// console.log('hit collider:', hit.collider)
			return true
		}

		return false
	}

	updateVelocity() {
		// const { x, y, z } = this.body.translation()
		// this.entity.mesh.position.copy(this.entity.body.translation())
		// this.entity.mesh.quaternion.copy(this.entity.body.rotation())
		const dt = this.time.delta * 0.001
		// console.log(dt)
		const prevPosition = this.entity.body.translation()
		const force = _V.copy(this.physics.instance.gravity).multiplyScalar(dt)

		this.velocity.add(force)

		if (this.inputs.keys['left']) {
			this.velocity.x = MathUtils.lerp(
				this.velocity.x,
				-this.speed,
				1 - dt * 10
			)
		}

		if (this.inputs.keys['right']) {
			this.velocity.x = MathUtils.lerp(this.velocity.x, this.speed, 1 - dt * 10)
		}

		const desiredMov = _V.copy(this.velocity).multiplyScalar(dt).clone()
		desiredMov.z = 0

		// console.log(desiredMov.x)

		this.controller.computeColliderMovement(
			this.entity.collider,
			desiredMov,
			undefined,
			undefined,
			(coll) => !coll.isSensor()
		)

		// for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
		// 	const collision = this.controller.computedCollision(i)

		// 	console.log('constroller collision', collision)
		// }

		const newPosition = _V
			.copy(this.controller.computedMovement())
			.add(this.entity.body.translation())
		newPosition.z = 0

		this.entity.body.setNextKinematicTranslation(newPosition)

		this.velocity.copy(newPosition.sub(prevPosition).divideScalar(dt))
		this.velocity.x *= 1 - dt * 10
		this.velocity.z = 0
	}

	// initInputs() {
	// 	this.inputs = new Inputs([
	// 		{ name: 'right', keys: ['ArrowRight', 'KeyD'] },
	// 		{ name: 'down', keys: ['ArrowDown', 'KeyS'] },
	// 		{ name: 'left', keys: ['ArrowLeft', 'KeyA'] },
	// 		{ name: 'jump', keys: ['ArrowUp', 'KeyW'] },
	// 		{ name: 'attack', keys: ['MouseLeft', 'Space'] },
	// 	])

	// 	window.addEventListener('keydown', (e) => {
	// 		const code = e.code

	// 		console.log(code)

	// 		switch (code) {
	// 			case 'Space':
	// 			case 'KeyW':
	// 				this.body.applyImpulse({ x: 0.0, y: 15.0, z: 0.0 }, true)
	// 				break
	// 			case 'ArrowRight':
	// 			case 'KeyD':
	// 				this.body.applyImpulse({ x: 5.0, y: 0.0, z: 0.0 }, true)
	// 				break
	// 			case 'ArrowLeft':
	// 			case 'KeyA':
	// 				this.body.applyImpulse({ x: -5.0, y: 0.0, z: 0.0 }, true)
	// 				break
	// 		}
	// 	})
	// }
}

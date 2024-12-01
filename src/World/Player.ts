import {
	BoxGeometry,
	CapsuleGeometry,
	MathUtils,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	Scene,
	Vector3,
} from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import Inputs from '../Utils/Inputs'
import Events from '../Utils/Events'
import Game from '../Game'
import Controller from '../Utils/Controller'
import Physics from '../Physics'
import Time from '../Utils/Time'
import { Entity } from '../Types/entity.types'
import { InputsArg } from '../Types/callbacks.types'
import Life from '../Utils/Life'
import Fire from './Sprite/Fire'

const _V = new Vector3()

export interface Effect {
	enabled: boolean
	value: number
	damage?: number
	timer?: number | undefined
}
export type EffectNames = 'burn' | 'regeneration' | 'slowness'

export type Effects = { [key in EffectNames] : Effect }

export default class Player extends Events {

	game: Game
	scene: Scene
	physics: Physics 
	time: Time 
	inputs: Inputs 
	controller: RAPIER.KinematicCharacterController = Controller.create(0.05)
	life = new Life()

	velocity = new Vector3()
	speed = 5
	jump = 20
	isOnLadder = false
	grabLadder = false
	grounded = false
	initialPosition: Vector3

	entity: Entity | undefined

	effects: Effects = {
		burn: { enabled: false, value: 0, timer: undefined, damage: 1 },
		regeneration: { enabled: false, value: 0, timer: undefined, damage: -1 },
		slowness: { enabled: false, value: 0 }
	}

	constructor(position: Vector3) {
		super()

		this.initialPosition = position
		this.game = new Game()
		this.scene = this.game.world.scene
		this.physics = this.game.physics
		this.time = this.game.time
		this.inputs = this.game.inputs

		this.controller.enableAutostep(0.1, 0.2, true)
		this.controller.enableSnapToGround(0.5)
		this.controller.setApplyImpulsesToDynamicBodies(true)

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

		this.inputs.on('jump', (isJump) => {
			// isJump as InputsArg

			if(this.isOnLadder) {
				this.grabLadder = true
				this.velocity.x = 0
			}

			let jump = this.effects.slowness.enabled ? this.jump * 0.6 : this.jump


			this.controller.computedGrounded() &&
			isJump && this.velocity.add(_V.set(0, jump, 0))
		})
		// this.initInputs()

		// this.on('damage',() => {

		// 	this.onDamage()
		// })
	}

	onDamage(damage = 0) {
		// console.log('player damage!',this.life.points)
		this.life.points -= damage

		if(this.life.points <= 0) {
			this.death()
			this.life.points = this.life.MAX_LIFE

			for (const name in this.effects) {
				this.removeEffect(name as EffectNames)
			}
		}

		
	}

	removeEffect(name: EffectNames) {
		const effect = this.effects[name]
		effect.enabled = false
		effect.value = 0

		clearInterval(effect.timer)
		effect.timer = undefined

		if(name === 'burn') {
			const children = [...(this.entity!.mesh?.children || [])]
			children.forEach(el => {
				this.entity!.mesh?.remove(el)
			})
		}
	}

	addEffect({ name, value, damage }: { name: EffectNames, value: number, damage?: number }) {

		const effect = this.effects[name]
		effect.enabled = true
		effect.value = value
		damage && (effect.damage = damage)
		
		if(!effect.timer) {
			if(name === 'burn') {
				const fire = new Fire({ position: new Vector3(0,0,0.25), height: 2 })
				this.entity!.mesh!.add(fire.entity!.mesh!)
			}
			effect.damage && effect.damage > 0 && this.onDamage(effect.damage)
			effect.timer = setInterval(() => {
				// console.log(`effect ${name}`)
				effect.damage && this.onDamage(effect.damage)
				effect.value--
	
				if(effect.value === 0) {
					this.removeEffect(name)
				}
			},750)
		}

	}

	getMesh() {
		const geometry = new CapsuleGeometry(0.38, 1)
		const material = new MeshStandardMaterial({ color: 'orange' })

		const mesh = new Mesh(geometry, material)
		this.scene.add(mesh)

		return mesh
	}

	createBody() {
		const { x,y,z} = this.initialPosition
		const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
			.lockTranslations()
			.enabledTranslations(true, true, false)
			.setTranslation(x,y,z)
		const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.38).setActiveEvents(
			RAPIER.ActiveEvents['COLLISION_EVENTS']
		).setActiveCollisionTypes(RAPIER.ActiveCollisionTypes['ALL'])

		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.collider
		this.entity.mesh = this.getMesh()

		// this.update()
	}

	checkGround() {

		if(!this.entity || !this.entity.body) return

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

	death() {
		this.entity?.body?.setTranslation(this.initialPosition as RAPIER.Vector3,true)
	}

	updateVelocity() {
		if(!this.entity || !this.entity.body || !this.entity.collider) return
		// const { x, y, z } = this.body.translation()
		// this.entity.mesh.position.copy(this.entity.body.translation())
		// this.entity.mesh.quaternion.copy(this.entity.body.rotation())
		const dt = this.time.delta * 0.001
		// console.log(dt)
		const prevPosition = this.entity.body.translation()

		
		if(this.grabLadder ) {
			this.velocity.y = 0
		}	else {
			const force = _V.copy(this.physics.instance.gravity).multiplyScalar(dt)
			this.velocity.add(force)
		}

		if (this.inputs.keys['left']) {
			let speed = this.effects.slowness.enabled ? this.speed * 0.3 : this.speed
			this.velocity.x = MathUtils.lerp(
				this.velocity.x,
				-speed,
				1 - dt * 10
			)
		}

		if (this.inputs.keys['right']) {
			let speed = this.effects.slowness.enabled ? this.speed * 0.3 : this.speed
			this.velocity.x = MathUtils.lerp(this.velocity.x, speed, 1 - dt * 10)
		}

		if (this.isOnLadder && this.inputs.keys['jump']) {
			this.velocity.y = MathUtils.lerp(this.velocity.y, this.speed, 1 - dt * 10)
		}

		if (this.isOnLadder && this.inputs.keys['down']) {
			this.velocity.y = MathUtils.lerp(this.velocity.y, -this.speed, 1 - dt * 10)
		}

		const desiredMov = _V.copy(this.velocity).multiplyScalar(dt).clone()
		desiredMov.z = 0

		// console.log(desiredMov.x)

		this.controller.computeColliderMovement(
			this.entity.collider,
			desiredMov,
			undefined,
			undefined,
			(coll) => {
				// console.log(coll.parent())
				// if(coll.isSensor()) {
				// 	console.log(coll.parent())
				// }
				return !coll.isSensor() 
			}
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
		if(this.controller.computedGrounded() && this.velocity.y < 0) {
			this.velocity.y = 0
		}
	}

}

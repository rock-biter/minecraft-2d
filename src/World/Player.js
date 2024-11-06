import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import Inputs from '../Utils/Inputs'
import Events from '../Utils/Events'
import Game from '../Game'

export default class Player extends Events {
	constructor() {
		super()

		this.game = new Game()
		this.scene = this.game.world.scene
		this.physics = this.game.physics
		this.time = this.game.time

		this.init()
	}

	async init() {
		this.createBody()
		// this.initInputs()
	}

	getMesh() {
		const geometry = new BoxGeometry(1, 2, 1)
		const material = new MeshStandardMaterial({ color: 'orange' })

		const mesh = new Mesh(geometry, material)
		this.scene.add(mesh)

		return mesh
	}

	createBody() {
		const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 4, 0)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 1, 0.5)

		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.mesh = this.getMesh()

		this.update()
	}

	update() {
		// const { x, y, z } = this.body.translation()
		this.entity.mesh.position.copy(this.entity.body.translation())
		this.entity.mesh.quaternion.copy(this.entity.body.rotation())
	}

	initInputs() {
		this.inputs = new Inputs([
			{ name: 'right', keys: ['ArrowRight', 'KeyD'] },
			{ name: 'down', keys: ['ArrowDown', 'KeyS'] },
			{ name: 'left', keys: ['ArrowLeft', 'KeyA'] },
			{ name: 'jump', keys: ['ArrowUp', 'KeyW'] },
			{ name: 'attack', keys: ['MouseLeft', 'Space'] },
		])

		window.addEventListener('keydown', (e) => {
			const code = e.code

			console.log(code)

			switch (code) {
				case 'Space':
				case 'KeyW':
					this.body.applyImpulse({ x: 0.0, y: 15.0, z: 0.0 }, true)
					break
				case 'ArrowRight':
				case 'KeyD':
					this.body.applyImpulse({ x: 5.0, y: 0.0, z: 0.0 }, true)
					break
				case 'ArrowLeft':
				case 'KeyA':
					this.body.applyImpulse({ x: -5.0, y: 0.0, z: 0.0 }, true)
					break
			}
		})
	}
}

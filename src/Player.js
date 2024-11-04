import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three'
import * as RAPIER from '@dimforge/rapier3d'

export default class Player extends Object3D {
	constructor({ scene, world }) {
		super()

		this.scene = scene
		this.world = world

		this.scene.add(this)

		this.init()
	}

	async init() {
		this.createMesh()
		this.initControls()
	}

	createMesh() {
		const geometry = new BoxGeometry(1, 2, 1)
		const material = new MeshStandardMaterial({ color: 0x000000 })

		const mesh = new Mesh(geometry, material)
		this.mesh = mesh

		this.add(mesh)
		this.createBody()
	}

	createBody() {
		const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
			.setTranslation(0.0, 4, 0)
			.lockTranslations() // prevent translations along along all axes.
			.lockRotations() // prevent rotations along all axes.
			.enabledTranslations(true, true, false)
		this.body = this.world.createRigidBody(bodyDesc)

		let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 1, 0.5)
		this.collider = this.world.createCollider(colliderDesc, this.body)

		this.update()
	}

	update(dt) {
		const { x, y, z } = this.body.translation()
		// this.body.setTranslation(x, y, z)

		this.position.set(x, y, z)
	}

	initControls() {
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

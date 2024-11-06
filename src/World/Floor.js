import Game from '../Game'
import * as RAPIER from '@dimforge/rapier3d'
import Events from '../Utils/Events'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export default class Floor extends Events {
	constructor() {
		super()
		this.game = new Game()
		this.physics = this.game.physics
		this.scene = this.game.world.scene

		const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(5, 0.5, 5)
		this.entity = this.physics.addEntity(bodyDesc, colliderDesc)
		this.entity.mesh = new Mesh(
			new BoxGeometry(10, 1, 10),
			new MeshStandardMaterial({ color: 'lightgray' })
		)
		this.entity.mesh.position.y = -0.5

		this.scene.add(this.entity.mesh)
	}

	update() {}
}

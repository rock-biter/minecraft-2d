import { KinematicCharacterController } from '@dimforge/rapier3d'
import Game from '../Game'

export default class Controller {

	static instance: KinematicCharacterController

	static create(offset = 0) {
		const game = new Game()

		if(!Controller.instance) {
			Controller.instance = game.physics.instance.createCharacterController(offset)
		}

		return Controller.instance
	}

}

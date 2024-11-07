import Game from '../Game'

export default class Controller {
	static create(offset = 0) {
		const game = new Game()

		return game.physics.instance.createCharacterController(offset)
	}
}

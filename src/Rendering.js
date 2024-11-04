import Game from './Game'

export default class Rendering {
	constructor() {
		this.game = new Game()

		this.game.time.events.on(
			'tick',
			() => {
				this.render()
			},
			5
		)

		this.game.viewport.events.on('change', () => {
			this.resize()
		})
	}

	resize() {
		// ...
	}

	render() {
		// ...
	}
}

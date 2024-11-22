import Game from '../Game'
import Viewport from '../Viewport'
import Events from './Events'

export default class Time extends Events {

	game: Game
	viewport: Viewport
	start: number
	current: number
	elapsed: number
	delta: number
	focus = true

	constructor() {
		super()

		this.game = new Game()
		this.viewport = this.game.viewport
		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16

		window.requestAnimationFrame(() => {
			this.tick()
		})

		this.viewport.on('focus',(isFocusOn) => {
			this.focus = isFocusOn as boolean

			// console.log('focus',this.focus)
		})
	}

	tick() {
		const currentTime = Date.now()
		this.delta = currentTime - this.current
		this.current = currentTime
		this.elapsed = this.current - this.start

		// trigger tick event
		this.trigger('tick')

		window.requestAnimationFrame(() => {
			this.tick()
		})

	}
}

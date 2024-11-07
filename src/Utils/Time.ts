import Events from './Events'

export default class Time extends Events {

	start: number
	current: number
	elapsed: number
	delta: number

	constructor() {
		super()

		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16

		window.requestAnimationFrame(() => {
			this.tick()
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

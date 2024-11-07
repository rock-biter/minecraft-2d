import Events from './Utils/Events'

export default class Viewport extends Events {

	width: number = 0
	height: number = 0
	pixelRatio: number = 0

	constructor() {
		super()

		this.setSizes()

		window.addEventListener('resize', () => {
			this.setSizes()
			this.trigger('resize')
		})
	}

	setSizes() {
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)
	}
}

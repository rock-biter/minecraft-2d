import Events from './Utils/Events'

export default class Viewport extends Events {
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

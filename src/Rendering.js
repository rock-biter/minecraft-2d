import { WebGLRenderer } from 'three'
import Game from './Game'

export default class Rendering {
	constructor() {
		this.game = new Game()
		this.viewport = this.game.viewport
		this.camera = this.game.view.camera
		this.scene = this.game.world.scene
		this.setInstance()

		this.game.time.on(
			'tick',
			() => {
				this.render()
			},
			5
		)

		this.game.viewport.on('resize', () => {
			this.resize()
		})
	}

	setInstance() {
		this.instance = new WebGLRenderer({
			canvas: this.game.domElement,
			antialias: true,
		})

		this.resize()
	}

	resize() {
		this.instance.setSize(this.viewport.width, this.viewport.height)
		this.instance.setPixelRatio(this.viewport.pixelRatio)
	}

	render() {
		// ...
		// console.log('render')
		this.instance.render(this.scene, this.camera)
	}
}

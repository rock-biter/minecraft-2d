import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import Game from './Game'
import Viewport from './Viewport'

export default class Rendering {

	game: Game
	viewport: Viewport
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	instance: WebGLRenderer 

	constructor() {
		this.game = new Game()
		this.viewport = this.game.viewport
		this.camera = this.game.view.camera
		this.scene = this.game.world.scene
		this.instance = new WebGLRenderer({
			canvas: this.game.domElement,
			antialias: true,
		})

		this.resize()

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

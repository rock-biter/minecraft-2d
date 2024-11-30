import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import Game from './Game'
import Viewport from './Viewport'
import Debug from './Utils/Debug'
import { PaneArgs } from './Types/callbacks.types'
import ENUMS from './Utils/Enums'

export default class Rendering {

	game: Game
	viewport: Viewport
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	instance: WebGLRenderer 
	debug: Debug

	constructor() {
		this.game = new Game()
		this.debug = this.game.debug
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

		if(this.debug.active) {
			this.debug.on('cameraChange',(e) => {
				const event = e as PaneArgs
				console.log('rendering:',event.value)
				switch(event.value) {
					case ENUMS.ORBIT_CONTROLS:
						this.camera = this.game.view.debugCamera
						break
					default:
						this.camera = this.game.view.camera
				}
			})
		}
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

import { MathUtils, PerspectiveCamera } from 'three'
import Events from './Utils/Events'
import Game from './Game'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class View extends Events {
	constructor() {
		super()

		this.game = new Game()
		this.viewport = this.game.viewport
		this.world = this.game.world
		this.time = this.game.time
		this.scene = this.game.world.scene

		this.setCamera()
		// this.setControls()

		this.viewport.on('resize', () => {
			this.resize()
		})

		this.game.time.on(
			'tick',
			() => {
				this.update()
			},
			2
		)
	}

	setCamera() {
		this.camera = new PerspectiveCamera(
			35,
			this.viewport.width / this.viewport.height,
			0.1,
			200
		)
		this.camera.position.set(0, 5, 40)
		this.scene.add(this.camera)
	}

	setControls() {
		this.controls = new OrbitControls(this.camera, this.game.domElement)
		this.controls.target.set(0, 5, 0)
		this.controls.enableDamping = true
	}

	resize() {
		this.camera.aspect = this.viewport.width / this.viewport.height
		this.camera.updateProjectionMatrix()
	}

	update() {
		// this.controls.update()
		if (this.world?.player) {
			this.camera.position.x = MathUtils.lerp(
				this.camera.position.x,
				this.world.player.entity.mesh.position.x,
				this.time.delta * 0.001
			)

			this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0)
		}
	}
}

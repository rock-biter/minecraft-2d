import { Camera, MathUtils, OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from 'three'
import Events from './Utils/Events'
import Game from './Game'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Viewport from './Viewport'
import World from './World/World'
import Time from './Utils/Time'


const _V = new Vector3()
export default class View extends Events {

	game: Game
	viewport: Viewport
	world: World
	time: Time
	scene: Scene
	camera!: PerspectiveCamera | OrthographicCamera
	controls: OrbitControls | undefined

	constructor() {
		super()

		this.game = new Game()
		this.viewport = this.game.viewport
		this.world = this.game.world
		this.time = this.game.time
		this.scene = this.game.world.scene

		this.setCamera()

		if(this.game.debug.active) {
			this.setControls()
		}

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
		this.camera.position.set(0, 5, 30)
		this.scene.add(this.camera)
	}

	setControls() {
		this.controls = new OrbitControls(this.camera as Camera, this.game.domElement)
		this.controls.target.set(0, 5, 0)
		this.controls.enableDamping = true
	}

	resize() {
		if(this.camera instanceof PerspectiveCamera)
			this.camera.aspect = this.viewport.width / this.viewport.height
		this.camera.updateProjectionMatrix()
	}

	update() {
		if(this.game.debug.active) {
			this.controls?.update()
		} else if (this.world?.player?.entity?.mesh) {
			// this.camera.position.x = MathUtils.lerp(
			// 	this.camera.position.x,
			// 	this.world.player.entity.mesh.position.x,
			// 	this.time.delta * 0.001
			// )
			_V.copy(this.world.player.entity.mesh.position)
			_V.z = this.camera.position.z

			this.camera.position.lerp(_V,this.time.delta * 0.001)

			this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0)
		}
	}
}

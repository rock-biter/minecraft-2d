import { Camera, MathUtils, OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from 'three'
import Events from './Utils/Events'
import Game from './Game'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Viewport from './Viewport'
import World from './World/World'
import Time from './Utils/Time'
import Debug from './Utils/Debug'
import EMUNS from './Utils/Enums'


const _V = new Vector3()
export default class View extends Events {

	game: Game
	viewport: Viewport
	world: World
	time: Time
	scene: Scene
	camera!: PerspectiveCamera | OrthographicCamera
	debugCamera!: PerspectiveCamera | OrthographicCamera
	controls: OrbitControls | undefined
	debug!: Debug

	constructor() {
		super()

		this.game = new Game()
		this.viewport = this.game.viewport
		this.world = this.game.world
		this.time = this.game.time
		this.scene = this.game.world.scene
		this.debug = this.game.debug

		this.setCamera()

		if(this.debug.active) {
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
			60,
			this.viewport.width / this.viewport.height,
			0.1,
			300
		)
		this.camera.position.set(0, 7, 10)
		this.scene.add(this.camera)

		if(this.debug.active) {
			this.debugCamera = new PerspectiveCamera(
				60,
				this.viewport.width / this.viewport.height,
				0.1,
				300
			)
			this.debugCamera.position.set(0, 10, 30)
			this.scene.add(this.debugCamera)
		}
	}

	setControls() {
		this.controls = new OrbitControls(this.debugCamera as Camera, this.game.domElement)
		this.controls.target.set(0, 5, 0)
		this.controls.enableDamping = true
		this.controls.update()
	}

	resize() {
		if(this.camera instanceof PerspectiveCamera)
			this.camera.aspect = this.viewport.width / this.viewport.height
		this.camera.updateProjectionMatrix()

		if(!this.debug.active) return

		if(this.debugCamera instanceof PerspectiveCamera)
			this.debugCamera.aspect = this.viewport.width / this.viewport.height
		this.debugCamera.updateProjectionMatrix()
	}

	update() {
		if(this.debug.active) {
			this.controls?.update()
		} 
		
		if (this.world?.player?.entity?.mesh) {
			// this.camera.position.x = MathUtils.lerp(
			// 	this.camera.position.x,
			// 	this.world.player.entity.mesh.position.x,
			// 	this.time.delta * 0.001
			// )
			_V.copy(this.world.player.entity.mesh.position)
			_V.z = this.camera.position.z
			_V.y += 2

			this.camera.position.lerp(_V,this.time.delta * 0.003)
			const {x,y,z} = this.world.player.entity.mesh.position

			this.camera.lookAt(x,y,z)
		}
	}
}

import {
	AmbientLight,
	BoxGeometry,
	DirectionalLight,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	Scene,
} from 'three'
import Game from './Game'

export default class World {
	constructor() {
		this.game = new Game()
		this.scene = new Scene()

		this.resources = this.game.resources
		// this.scene = this.game.scene

		// qui creaimo gli oggetti di gioco e ttutti gli elementi?
		/**
		 * BOX
		 */
		const material = new MeshStandardMaterial({ color: 'coral' })
		const geometry = new BoxGeometry(1, 1, 1)
		const mesh = new Mesh(geometry, material)
		mesh.position.y += 0.5
		this.scene.add(mesh)

		/**
		 * Plane
		 */
		const groundMaterial = new MeshStandardMaterial({ color: 'lightgray' })
		const groundGeometry = new PlaneGeometry(10, 10)
		groundGeometry.rotateX(-Math.PI * 0.5)
		const ground = new Mesh(groundGeometry, groundMaterial)
		this.scene.add(ground)

		const ambientLight = new AmbientLight(0xffffff, 1.5)
		const directionalLight = new DirectionalLight(0xffffff, 4.5)
		directionalLight.position.set(3, 10, 7)
		this.scene.add(ambientLight, directionalLight)

		this.resources.on('load', () => {
			console.log('ready to generate world')
			// this.environment = new Environment() // => lights
		})
	}

	update() {
		// update the world each frame (for object animations for instance)
	}
}

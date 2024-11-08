import {
	AmbientLight,
	BoxGeometry,
	DirectionalLight,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	Scene,
} from 'three'
import Game from '../Game'
import Environment from './Environment'
import Floor from './Floor'
import Player from './Player'
import Physics from '../Physics'
import Time from '../Utils/Time'
import Resources from '../Utils/Resources'
import MapBuilder from '../MapBuilder'

export default class World {

	game: Game
	scene: Scene
	physics: Physics
	time: Time
	resources: Resources

	environment: Environment | undefined
	floor: Floor | undefined
	player: Player | undefined

	constructor() {
		this.game = new Game()
		this.scene = new Scene()
		this.physics = this.game.physics
		this.time = this.game.time
		this.resources = this.game.resources

		this.resources.on('load', () => {
			console.log('load')
			console.log('ready to generate world')
			this.environment = new Environment()
			// this.floor = new Floor(50)

			new MapBuilder().build()
			
			this.player = new Player()

			// this.environment = new Environment() // => lights
		})

		this.time.on(
			'tick',
			() => {
				this.update()
			},
			4
		)
	}

	update() {
		// update the world each frame (for object animations for instance)
	}
}

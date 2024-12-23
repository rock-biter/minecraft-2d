import {
	AmbientLight,
	BoxGeometry,
	Color,
	DirectionalLight,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	Scene,
	Vector3,
} from 'three'
import Game from '../Game'
import Environment from './Environment'
import Floor from './Floor'
import Player from './Player'
import Physics from '../Physics'
import Time from '../Utils/Time'
import Resources from '../Utils/Resources'
import MapBuilder from '../MapBuilder'
import Materials from '../Utils/Materials'
import Enemy from './Mobs/Enemy'
import Fire from './Sprite/Fire'
import House from './Structures/House'

export default class World {

	game: Game
	scene: Scene
	physics: Physics
	time: Time
	resources: Resources
	materials!: Materials

	environment: Environment | undefined
	floor: Floor | undefined
	player: Player | undefined

	constructor() {
		this.game = new Game()
		this.scene = new Scene()
		this.scene.background = new Color(0x8AE0FF)
		this.physics = this.game.physics
		this.time = this.game.time
		this.resources = this.game.resources

		this.resources.on('load', () => {
			// console.log('load')
			// console.log('ready to generate world')
			this.environment = new Environment()
			this.materials = new Materials()
			// this.floor = new Floor(50)

			

			new MapBuilder().build()
			

			this.player = new Player(new Vector3(0, 20, 0))
			// this.player = new Player(new Vector3(4, -40, 0)) // x: -9.5

			

			// new Fire({ position: new Vector3(-11.5, 7, 0)})
			
			// Enemy.spawn(new Vector3(-5,14.5,0))

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

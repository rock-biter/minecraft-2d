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

export default class World {
	constructor() {
		this.game = new Game()
		this.scene = new Scene()
		this.game.physics = this.game.physics
		this.time = this.game.time

		this.resources = this.game.resources
		// this.scene = this.game.scene

		this.resources.on('load', () => {
			console.log('load')
			console.log('ready to generate world')
			this.environment = new Environment()
			this.floor = new Floor()
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

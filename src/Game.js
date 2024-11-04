import Debug from './Debug'
import Inputs from './Inputs'
import Player from './Player'

export default class Game {
	constructor() {
		if (Game.instance) {
			return Game.instance
		}

		Game.instance = this

		this.domElement = document.querySelector('.game')

		this.debug = new Debug()
		this.inputs = new Inputs([
			{ name: 'right', keys: ['ArrowRight', 'KeyD'] },
			{ name: 'down', keys: ['ArrowDown', 'KeyS'] },
			{ name: 'left', keys: ['ArrowLeft', 'KeyA'] },
			{ name: 'jump', keys: ['ArrowUp', 'KeyW'] },
			{ name: 'attack', keys: ['MouseLeft', 'Space'] },
		])
		this.time = new Time()
		this.viewport = new Viewport(this.domElement)
		this.physics = new Physics()
		this.world = new World()
		this.physicsDebug = new PhysicsDebug()
		this.view = new View()
		this.rendering = new Rendering()
		this.player = new Player()
	}
}

import Debug from './Utils/Debug'
import Inputs from './Utils/Inputs'
import PhysicsDebug from './Utils/PhysicsDebug'
import Rendering from './Rendering'
import Resources from './Utils/Resources'
import Time from './Utils/Time'
import View from './View'
import Viewport from './Viewport'
import World from './World/World'
import Physics from './Physics'

import cobblestoneSrc from './textures/cobblestone.png?url'
import grassSrc from './textures/grass.png?url'
import gravelSrc from './textures/gravel.png?url'
import sandstoneSrc from './textures/sandstone.png?url'
import dirtSrc from './textures/dirt.png?url'
import stoneSrc from './textures/stone.png?url'
import graniteSrc from './textures/granite.png?url'
import snowyGrassSrc from './textures/snowy-grass.png?url'
import questionMark from './textures/question-mark.png?url'

import { inputMap } from './Types/input.types'

const inputsKeys = [
			{ name: 'right', keys: ['ArrowRight', 'KeyD'] },
			{ name: 'down', keys: ['ArrowDown', 'KeyS'] },
			{ name: 'left', keys: ['ArrowLeft', 'KeyA'] },
			{ name: 'jump', keys: ['ArrowUp', 'KeyW'] },
			{ name: 'attack', keys: ['MouseLeft', 'Space'] },
		]

const sources = [
	{
		name: 'blocks',
		type: 'arrayTexture',
		sizes: {
			width: 16,
			height: 16
		},
		path: [
			cobblestoneSrc,
			grassSrc,
			gravelSrc,
			sandstoneSrc,
			dirtSrc,
			stoneSrc,
			graniteSrc,
			snowyGrassSrc,
			questionMark, // ? 
		],
	},
]

export default class Game {

	static instance: Game
	domElement!: HTMLCanvasElement
	debug!: Debug
	inputs!: Inputs
	time!: Time
	viewport!: Viewport 
	resources!: Resources 
	physics!: Physics 
	world!: World 
	physicsDebug!: PhysicsDebug 
	view!: View 
	rendering!: Rendering 

	constructor(className = '.game') {
		if (Game.instance) {
			return Game.instance
		}

		Game.instance = this

		const canvas = document.querySelector(className)
		if(!canvas) {
			throw new Error('Canvas not found! Provide a canvas with class `game` or pass a class name canvas to the contrusctor.')
		}

		if(!(canvas instanceof HTMLCanvasElement)) {
			throw new Error('Element is not an instance od HTMLCanvasElement!')
		}

		this.domElement = canvas

		this.debug = new Debug()
		this.inputs = new Inputs(inputsKeys as inputMap)
		this.viewport = new Viewport() // this is the Size class of course why pass dom element?
		this.time = new Time()
		this.resources = new Resources(sources) // pass all the resources to load
		this.physics = new Physics() // this init the physics engine
		this.world = new World() // this create the world game and contains scene
		this.physicsDebug = new PhysicsDebug()
		this.view = new View() // this contains the camera
		this.rendering = new Rendering()
	}
}
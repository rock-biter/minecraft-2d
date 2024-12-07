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

import bodiesMap from './textures/map/map-19.png?url'
import backgroundMap from './textures/map/background-08.png?url'
import background2Map from './textures/map/background-2-01.png?url'
import frontgroundMap from './textures/map/frontground-04.png?url'
import frontground2Map from './textures/map/frontground-2-02.png?url'
import specialBodiesMap from './textures/map/specials-10.png?url'
import collectablesMap from './textures/map/collectables-08.png?url'
import ladderSrc from './textures/blocks/ladder.png?url'
import goldenAppleSrc from './textures/golden-apple.png?url'
import goldenCarrotSrc from './textures/golden-carrot.png?url'
import emeraldSrc from './textures/emerald.png?url'
import diamondSrc from './textures/diamond.png?url'
import lifeHeartSrc from './textures/life-heart.png?url'
import lavaStillSrc from './textures/blocks/lava_still.png?url'
import fireSrc from './textures/blocks/fire_1.png?url'
import marioTexture from './assets/models/steve/textures/mario-texture.png?url'

import playerModelSrc from './assets/models/steve/source/model.gltf?url'

import { inputMap } from './Types/input.types'
import { texturesPaths } from './Utils/BlocksTexture'
import { Source } from './Types/resources.types'

const inputsKeys = [
			{ name: 'right', keys: ['ArrowRight', 'KeyD'] },
			{ name: 'down', keys: ['ArrowDown', 'KeyS'] },
			{ name: 'left', keys: ['ArrowLeft', 'KeyA'] },
			{ name: 'jump', keys: ['ArrowUp', 'KeyW','Space'] },
			{ name: 'attack', keys: ['MouseLeft'] },
		]

const sources: Source[] = [
	{
		name: 'player-model',
		type: 'gltf',
		path: playerModelSrc,
	},
	{
		name: 'bodies',
		type: 'map',
		path: bodiesMap,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'background',
		type: 'map',
		path: backgroundMap,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'background-2',
		type: 'map',
		path: background2Map,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'frontground',
		type: 'map',
		path: frontgroundMap,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'frontground-2',
		type: 'map',
		path: frontground2Map,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'player-texture',
		type: 'texture',
		path: marioTexture
	},
	{
		name: 'heart',
		type: 'texture',
		path: lifeHeartSrc,
		sizes: {
			width: 15,
			height: 15
		},
	},
	{
		name: 'ladder',
		type: 'texture',
		path: ladderSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'lava_still',
		type: 'texture',
		path: lavaStillSrc,
		sizes: {
			width: 16,
			height: 320
		},
	},
	{
		name: 'fire',
		type: 'texture',
		path: fireSrc,
		sizes: {
			width: 16,
			height: 512
		},
	},
	{
		name: 'emerald',
		type: 'texture',
		path: emeraldSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'diamond',
		type: 'texture',
		path: diamondSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'golden-apple',
		type: 'texture',
		path: goldenAppleSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'golden-carrot',
		type: 'texture',
		path: goldenCarrotSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'collectables',
		type: 'map',
		path: collectablesMap,
		sizes: {
			width: 41,
			height: 35
		},
	},
	{
		name: 'special-bodies',
		type: 'map',
		path: specialBodiesMap,
		sizes: {
			width: 42,
			height: 12
		},
	},
	{
		name: 'blocks',
		type: 'arrayTexture',
		sizes: {
			width: 16,
			height: 16
		},
		path: texturesPaths,
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
		this.debug.addStats()
		this.resources = new Resources(sources) // pass all the resources to load
		this.physics = new Physics() // this init the physics engine
		this.world = new World() // this create the world game and contains scene
		this.physicsDebug = new PhysicsDebug()
		this.view = new View() // this contains the camera
		this.rendering = new Rendering()
	}
}

import bodiesMap from '../textures/map/map-20.png?url'
import backgroundMap from '../textures/map/background-09.png?url'
import background2Map from '../textures/map/background-2-02.png?url'
import frontgroundMap from '../textures/map/frontground-06.png?url'
import frontground2Map from '../textures/map/frontground-2-03.png?url'
// import specialBodiesMap from '../textures/map/specials-10.png?url'
// import collectablesMap from '../textures/map/collectables-08.png?url'
// import enemiesMap from '../textures/map/enemies-01.png?url'
import ladderSrc from '../textures/blocks/ladder.png?url'

// layers
import layer__16 from '../textures/map/layers/-layer-16.png?url'
import layer__14 from '../textures/map/layers/-layer-14.png?url'
import layer__13 from '../textures/map/layers/-layer-13.png?url'
import layer__11 from '../textures/map/layers/-layer-11.png?url'
import layer__10 from '../textures/map/layers/-layer-10.png?url'
import layer__9 from '../textures/map/layers/-layer-9.png?url'
import layer__7 from '../textures/map/layers/-layer-7.png?url'
import layer__6 from '../textures/map/layers/-layer-6.png?url'
import layer__4 from '../textures/map/layers/-layer-4.png?url'
import layer__3 from '../textures/map/layers/-layer-3.png?url'
import layer__2 from '../textures/map/layers/-layer-2.png?url'
import layer__1 from '../textures/map/layers/-layer-1.png?url'
import layer_0 from '../textures/map/layers/layer-0.png?url'
import layer_1 from '../textures/map/layers/layer-1.png?url'
import layer_3 from '../textures/map/layers/layer-3.png?url'
import layer_4 from '../textures/map/layers/layer-4.png?url'
import layer_s from '../textures/map/layers/layer-s.png?url'
import layer_e from '../textures/map/layers/layer-e.png?url'

// import lifeHeartSrc from '../textures/life-heart.png?url'
import lifeHeartSrc from '../textures/heart/full.png?url'
import lavaStillSrc from '../textures/blocks/lava_still.png?url'
import fireSrc from '../textures/blocks/fire_1.png?url'

// plants
import poppySrc from '../textures/blocks/poppy.png?url'
import dandelionSrc from '../textures/blocks/dandelion.png?url'
import redTulipSrc from '../textures/blocks/red_tulip.png?url'
import pinkTulipSrc from '../textures/blocks/pink_tulip.png?url'
import orangeTulipSrc from '../textures/blocks/orange_tulip.png?url'
import whiteTulipSrc from '../textures/blocks/white_tulip.png?url'
import oxeyeDaisySrc from '../textures/blocks/oxeye_daisy.png?url'
import alliumSrc from '../textures/blocks/allium.png?url'
import cornflowerSrc from '../textures/blocks/cornflower.png?url'

// items
import goldenAppleSrc from '../textures/item/golden_apple.png?url'
import goldenCarrotSrc from '../textures/item/golden_carrot.png?url'
import emeraldSrc from '../textures/item/emerald.png?url'
import diamondSrc from '../textures/item/diamond.png?url'

// player
import marioTexture from '../assets/models/steve/textures/mario-texture.png?url'
import playerModelSrc from '../assets/models/steve/source/model.gltf?url'

// mob
import zombieSrc from '../assets/models/mob/zombie/zombie.glb?url'

import { Source } from "../Types/resources.types";
import { texturesPaths } from './BlocksTexture'

export const plants = [
	{
		name: 'poppy',
		type: 'texture',
		path: poppySrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'dandelion',
		type: 'texture',
		path: dandelionSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'red_tulip',
		type: 'texture',
		path: redTulipSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'white_tulip',
		type: 'texture',
		path: whiteTulipSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'pink_tulip',
		type: 'texture',
		path: pinkTulipSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'orange_tulip',
		type: 'texture',
		path: orangeTulipSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'oxeye_daisy',
		type: 'texture',
		path: oxeyeDaisySrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'allium',
		type: 'texture',
		path: alliumSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
	{
		name: 'cornflower',
		type: 'texture',
		path: cornflowerSrc,
		sizes: {
			width: 16,
			height: 16
		},
	},
]

// items sources
export const items = [
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
]

export const mapSize =  {
			width: 240,
			height: 250
		}

type layersMap = {
	[key: string]: number
}

export const mapLayersName: layersMap = {
	'-layer-17': -17,
	'-layer-16': -16,
	'-layer-15': -15,
	'-layer-14': -14,
	'-layer-13': -13,
	'-layer-12': -12,
	'-layer-11': -11,
	'-layer-10': -10,
	'-layer-9': -9,
	'-layer-8': -8,
	'-layer-7': -7,
	'-layer-6': -6,
	'-layer-5': -5,
	'-layer-4': -4,
	'-layer-3': -3,
	'-layer-2': -2,
	'-layer-1': -1,
	'layer-0': 0,
	'layer-1': 1,
	'layer-2': 2,
	'layer-3': 3,
	'layer-4': 4,
	'layer-5': 5,
}

// dungeon
export const mapLayers = [
	{
		name: 'layer-s',
		type: 'map',
		path: layer_s,
		sizes: mapSize
	},
	{
		name: 'layer-e',
		type: 'map',
		path: layer_e,
		sizes: mapSize
	},
	{
		name: '-layer-17',
		type: 'map',
		path: layer__16,
		sizes: mapSize
	},
	{
		name: '-layer-16',
		type: 'map',
		path: layer__16,
		sizes: mapSize
	},
	{
		name: '-layer-15',
		type: 'map',
		path: layer__14,
		sizes: mapSize
	},
	{
		name: '-layer-14',
		type: 'map',
		path: layer__14,
		sizes: mapSize
	},
	{
		name: '-layer-13',
		type: 'map',
		path: layer__13,
		sizes: mapSize
	},
	{
		name: '-layer-12',
		type: 'map',
		path: layer__11,
		sizes: mapSize
	},
	{
		name: '-layer-11',
		type: 'map',
		path: layer__11,
		sizes: mapSize
	},
	{
		name: '-layer-10',
		type: 'map',
		path: layer__10,
		sizes: mapSize
	},
	{
		name: '-layer-9',
		type: 'map',
		path: layer__9,
		sizes: mapSize
	},
	{
		name: '-layer-8',
		type: 'map',
		path: layer__7,
		sizes: mapSize
	},
	{
		name: '-layer-7',
		type: 'map',
		path: layer__7,
		sizes: mapSize
	},
	{
		name: '-layer-6',
		type: 'map',
		path: layer__6,
		sizes: mapSize
	},
	{
		name: '-layer-5',
		type: 'map',
		path: layer__4,
		sizes: mapSize
	},
	{
		name: '-layer-4',
		type: 'map',
		path: layer__4,
		sizes: mapSize
	},
	{
		name: '-layer-3',
		type: 'map',
		path: layer__3,
		sizes: mapSize
	},
	{
		name: '-layer-2',
		type: 'map',
		path: layer__2,
		sizes: mapSize
	},
	{
		name: '-layer-1',
		type: 'map',
		path: layer__1,
		sizes: mapSize
	},
	
	{
		name: 'layer-0',
		type: 'map',
		path: layer_0,
		sizes: mapSize
	},
	{
		name: 'layer-1',
		type: 'map',
		path: layer_1,
		sizes: mapSize
	},
	{
		name: 'layer-2',
		type: 'map',
		path: layer_1,
		sizes: mapSize
	},
	{
		name: 'layer-3',
		type: 'map',
		path: layer_3,
		sizes: mapSize
	},
	{
		name: 'layer-4',
		type: 'map',
		path: layer_4,
		sizes: mapSize
	},
	{
		name: 'layer-5',
		type: 'map',
		path: layer_4,
		sizes: mapSize
	},
	// {
	// 	name: 'background-2',
	// 	type: 'map',
	// 	path: background2Map,
	// 	sizes: mapSize
	// },
	// {
	// 	name: 'background',
	// 	type: 'map',
	// 	path: backgroundMap,
	// 	sizes: mapSize
	// },
	// {
	// 	name: 'bodies',
	// 	type: 'map',
	// 	path: bodiesMap,
	// 	sizes: mapSize
	// },
	// {
	// 	name: 'frontground',
	// 	type: 'map',
	// 	path: frontgroundMap,
	// 	sizes: mapSize
	// },
	// {
	// 	name: 'frontground-2',
	// 	type: 'map',
	// 	path: frontground2Map,
	// 	sizes: mapSize
	// },
]

const sources: Source[] = [
	{
		name: 'player-model',
		type: 'gltf',
		path: playerModelSrc,
	},
	{
		name: 'zombie',
		type: 'gltf',
		path: zombieSrc,
	},
	// {
	// 	name: 'enemies',
	// 	type: 'map',
	// 	path: enemiesMap,
	// 	sizes: mapSize
	// },
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
	// {
	// 	name: 'collectables',
	// 	type: 'map',
	// 	path: collectablesMap,
	// 	sizes: mapSize
	// },
	// {
	// 	name: 'special-bodies',
	// 	type: 'map',
	// 	path: specialBodiesMap,
	// 	sizes: mapSize
	// },
	{
		name: 'blocks',
		type: 'arrayTexture',
		sizes: {
			width: 16,
			height: 16
		},
		path: texturesPaths,
	},
	...mapLayers,
	...items,
	...plants
]



export default sources
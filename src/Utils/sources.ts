import bodiesMap from '../textures/map/map-19.png?url'
import backgroundMap from '../textures/map/background-08.png?url'
import background2Map from '../textures/map/background-2-01.png?url'
import frontgroundMap from '../textures/map/frontground-04.png?url'
import frontground2Map from '../textures/map/frontground-2-02.png?url'
import specialBodiesMap from '../textures/map/specials-10.png?url'
import collectablesMap from '../textures/map/collectables-08.png?url'
import ladderSrc from '../textures/blocks/ladder.png?url'
// import lifeHeartSrc from '../textures/life-heart.png?url'
import lifeHeartSrc from '../textures/heart/full.png?url'
import lavaStillSrc from '../textures/blocks/lava_still.png?url'
import fireSrc from '../textures/blocks/fire_1.png?url'

import goldenAppleSrc from '../textures/item/golden_apple.png?url'
import goldenCarrotSrc from '../textures/item/golden_carrot.png?url'
import emeraldSrc from '../textures/item/emerald.png?url'
import diamondSrc from '../textures/item/diamond.png?url'

// player
import marioTexture from '../assets/models/steve/textures/mario-texture.png?url'
import playerModelSrc from '../assets/models/steve/source/model.gltf?url'

import { Source } from "../Types/resources.types";
import { texturesPaths } from './BlocksTexture'

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

export default sources
import cobblestoneSrc from '../textures/blocks/cobblestone.png?url'
// import grassSrc from '../textures/grass.png?url'
import grassSrc from '../textures/blocks/grass_block_side.png?url'
import grassTopSrc from '../textures/blocks/grass_block_top_colored.png?url'
import gravelSrc from '../textures/blocks/gravel.png?url'
import sandSrc from '../textures/blocks/sand.png?url'
import dirtSrc from '../textures/blocks/dirt.png?url'
import stoneSrc from '../textures/blocks/stone.png?url'
import graniteSrc from '../textures/blocks/granite.png?url'
import snowyGrassSrc from '../textures/blocks/grass_block_snow.png?url'
// import ladderSrc from '../textures/ladder.png?url'
import questionMarkSrc from '../textures/question-mark.png?url'
import obsidianSrc from '../textures/blocks/obsidian.png?url'
import oakLogSrc from '../textures/blocks/oak_log.png?url'
import oakLogTopSrc from '../textures/blocks/oak_log_top.png?url'
import oakPlanksSrc from '../textures/blocks/oak_planks.png?url'
import oakLeavesSrc from '../textures/blocks/oak_leaves.png?url'

import birchLogSrc from '../textures/blocks/birch_log.png?url'
import birchLogTopSrc from '../textures/blocks/birch_log_top.png?url'
import birchPlanksSrc from '../textures/blocks/birch_planks.png?url'
import birchLeavesSrc from '../textures/blocks/birch_leaves.png?url'

import jungleLogSrc from '../textures/blocks/jungle_log.png?url'
import jungleLogTopSrc from '../textures/blocks/jungle_log_top.png?url'
import junglePlanksSrc from '../textures/blocks/jungle_planks.png?url'
import jungleLeavesSrc from '../textures/blocks/jungle_leaves.png?url'

import quartzTopSrc from '../textures/blocks/quartz_block_top.png?url'
import quartzSideSrc from '../textures/blocks/quartz_block_side.png?url'
import quartzBottomSrc from '../textures/blocks/quartz_block_bottom.png?url'

import coalOreSrc from '../textures/blocks/coal_ore.png?url'
import ironOreSrc from '../textures/blocks/iron_ore.png?url'
import goldOreSrc from '../textures/blocks/gold_ore.png?url'
import diamondOreSrc from '../textures/blocks/diamond_ore.png?url'
// import transparentSrc from '../textures/transparent.png?url'
import { TEXTURES } from './Enums'

interface TextureIndexes {
  [name: string] : number
}

interface Texture {
  name: string,
  path: string
}

export const blocksTextures: Texture[] = [
  {
    name: TEXTURES.COBBLESTONE,
    path: cobblestoneSrc,
  },
  {
    name: TEXTURES.GRASS,
    path: grassSrc,
  },
  {
    name: TEXTURES.GRAVEL,
    path: gravelSrc,
  },
  {
    name: TEXTURES.SAND,
    path: sandSrc,
  },
  {
    name: TEXTURES.DIRT,
    path: dirtSrc,
  },
  {
    name: TEXTURES.STONE,
    path: stoneSrc,
  },
  {
    name: TEXTURES.GRANITE,
    path: graniteSrc,
  },
  {
    name: TEXTURES.SNOWY_GRASS,
    path: snowyGrassSrc,
  },
  {
    name: TEXTURES.GRASS_TOP,
    path: grassTopSrc,
  },
  {
    name: TEXTURES.QUESTION_MARK,
    path: questionMarkSrc,
  },
  {
    name: TEXTURES.OBSIDIAN,
    path: obsidianSrc,
  },
  {
    name: TEXTURES.OAK_LEAVES,
    path: oakLeavesSrc,
  },
  {
    name: TEXTURES.OAK_LOG,
    path: oakLogSrc,
  },
  {
    name: TEXTURES.OAK_LOG_TOP,
    path: oakLogTopSrc,
  },
  {
    name: TEXTURES.OAK_PLANKS,
    path: oakPlanksSrc,
  },
  {
    name: TEXTURES.COAL_ORE,
    path: coalOreSrc,
  },
  {
    name: TEXTURES.IRON_ORE,
    path: ironOreSrc,
  },
  {
    name: TEXTURES.GOLD_ORE,
    path: goldOreSrc,
  },
  {
    name: TEXTURES.DIAMOND_ORE,
    path: diamondOreSrc,
  },
  {
    name: TEXTURES.QUARTZ_TOP,
    path: quartzTopSrc,
  },
  {
    name: TEXTURES.QUARTZ_SIDE,
    path: quartzSideSrc,
  },
  {
    name: TEXTURES.QUARTZ_BOTTOM,
    path: quartzBottomSrc,
  },
  {
    name: TEXTURES.BIRCH_LEAVES,
    path: birchLeavesSrc,
  },
  {
    name: TEXTURES.BIRCH_LOG,
    path: birchLogSrc,
  },
  {
    name: TEXTURES.BIRCH_LOG_TOP,
    path: birchLogTopSrc,
  },
  {
    name: TEXTURES.BIRCH_PLANKS,
    path: birchPlanksSrc,
  },
  {
    name: TEXTURES.JUNGLE_LEAVES,
    path: jungleLeavesSrc,
  },
  {
    name: TEXTURES.JUNGLE_LOG,
    path: jungleLogSrc,
  },
  {
    name: TEXTURES.JUNGLE_LOG_TOP,
    path: jungleLogTopSrc,
  },
  {
    name: TEXTURES.JUNGLE_PLANKS,
    path: junglePlanksSrc,
  },

  // {
  //   name: 'TRANSPARENT-LADDER',
  //   path: transparentSrc,
  // },
  // {
  //   name: 'LADDER',
  //   path: ladderSrc,
  // }
]

export const texturesPaths: string[] = blocksTextures.map(({ path }) => path)

export const texturesIndexes = blocksTextures.reduce((acc,texture,index) => {
  acc[texture.name] = index
  return acc
},{} as TextureIndexes)

export function getTextureName(i: number) {
  return blocksTextures[i]?.name || ''
}

export function getTextureIndex(textureName: string) {
  return blocksTextures.findIndex(({name}) => name === textureName)
}
import cobblestoneSrc from '../textures/blocks/cobblestone.png?url'
// import grassSrc from '../textures/grass.png?url'
import grassSrc from '../textures/blocks/grass_block_side.png?url'
import grassTopSrc from '../textures/blocks/grass_block_top.png?url'
import gravelSrc from '../textures/blocks/gravel.png?url'
import sandstoneSrc from '../textures/blocks/sand.png?url'
import dirtSrc from '../textures/blocks/dirt.png?url'
import stoneSrc from '../textures/stone.png?url'
import graniteSrc from '../textures/granite.png?url'
import snowyGrassSrc from '../textures/snowy-grass.png?url'
import ladderSrc from '../textures/ladder.png?url'
import questionMarkSrc from '../textures/question-mark.png?url'
import transparentSrc from '../textures/transparent.png?url'
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
    name: TEXTURES.GRASS,
    path: gravelSrc,
  },
  {
    name: TEXTURES.SANDOSTONE,
    path: sandstoneSrc,
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
    name: 'QUESTION_MARK',
    path: questionMarkSrc,
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
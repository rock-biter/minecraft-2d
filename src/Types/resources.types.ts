import { DataArrayTexture, Texture, TextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/Addons"

export type Path = string | Array<string>

export interface Source {
	name: string,
	type: string,
	path: Path
	sizes?: { width: number, height: number }
}

export type File =  Texture | HTMLImageElement | DataArrayTexture

export interface Items {
	[key: string]: File
}

export interface Loaders {
	gltfLoader?: GLTFLoader
	textureLoader?: TextureLoader
}
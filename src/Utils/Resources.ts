import { TextureLoader } from 'three'
import Events from './Events'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

type path = string | Array<string>

interface source {
	name: string,
	type: string,
	path: path
}

const sources = [
	{
		name: 'nomeSorce',
		type: 'texture',
		path: './src/texture/...',
	},
]

interface file {
	[key: string]: any // TODO definire queste props
}

interface items {
	[key: string]: file
}

interface loaders {
	gltfLoader?: GLTFLoader
	textureLoader?: TextureLoader
}

// loaders for all the resources
export default class Resources extends Events {

	sources: source[]
	items: items
	toLoad: number
	loaded: number
	loaders: loaders = {}

	constructor(sources = []) {
		super()

		this.sources = sources
		this.items = {}
		this.toLoad = this.sources.length
		this.loaded = 0

		this.setLoaders()
		this.startLoading()
	}

	setLoaders() {
		this.loaders = {}
		this.loaders.gltfLoader = new GLTFLoader()
		this.loaders.textureLoader = new TextureLoader()
		// altri loaders
	}

	startLoading() {
		for (const source of this.sources) {
			const { type } = source
			/**
			 *
			 * load source
			 *
			 * on load => this.sourceLoaded(source,file)
			 *
			 */
		}

		setTimeout(() => {
			this.trigger('load')
		}, 100)
	}

	sourceLoaded(source: source, file: file) {
		this.items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.trigger('load')
		}

		this.trigger('progress')
	}
}

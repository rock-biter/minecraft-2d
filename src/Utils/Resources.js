import { TextureLoader } from 'three'
import Events from './Events'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

const sources = [
	{
		name: 'nomeSorce',
		type: 'texture',
		path: './src/texture/...',
	},
]

// loaders for all the resources
export default class Resources extends Events {
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

	sourceLoaded(source, file) {
		this.items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.trigger('load')
		}

		this.trigger('progress')
	}
}

import { DataArrayTexture, LinearFilter, NearestFilter, TextureLoader } from 'three'
import Events from './Events'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

type path = string | Array<string>

interface source {
	name: string,
	type: string,
	path: path
	sizes?: { width: number, height: number }
}

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

	loadImage(src: string) {
		return new Promise((res,rej) => {
			const img = new Image()
			img.onload = () => {
				res(img)
				console.log('loaded img')
			}

			img.onerror = (e) => {
				console.error('errore',e)
				rej()
			}

			img.src = src
		})
	}

	startLoading() {
		for (const source of this.sources) {
			const { type } = source

			switch(type) {
				case 'arrayTexture':
					console.log('texture array',source)
					const s = source as Required<source>
					this.loadArrayTexture(s)
					break
			}

			// TODO gltfLoader, textureLoader
			/**
			 *
			 * load source
			 *
			 * on load => this.sourceLoaded(source,file)
			 *
			 */
		}

		// setTimeout(() => {
		// 	this.trigger('load')
		// }, 100)
	}

	async loadArrayTexture(source: Required<source>) {

		console.log('load array texture')
		const { width, height } = source.sizes
		const size = width * height
		const depth = source.path.length
		const data = new Uint8Array(4 * size * depth)

		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext('2d')

		if(!ctx) return

		const paths = source.path as Array<string>
		const images = await Promise.all(
			paths.map(async (src) => await this.loadImage(src))
		) as HTMLImageElement[]

		images.forEach((img: HTMLImageElement, i: number) => {
			ctx.drawImage(img, 0, 0, width, height)
			const imageData = ctx.getImageData(0, 0, width, height)

			for (let j = 0; j < size; j++) {
				const r = imageData.data[j * 4 + 0]
				const g = imageData.data[j * 4 + 1]
				const b = imageData.data[j * 4 + 2]
				const a = imageData.data[j * 4 + 3]
				// console.log(c)
				const stride = (i * size + j) * 4
				data[stride + 0] = r
				data[stride + 1] = g
				data[stride + 2] = b
				data[stride + 3] = a
			}
		})

		const texture = new DataArrayTexture(
			data,
			width,
			height,
			depth
		)

		texture.needsUpdate = true
		// texture.flipY = true
		texture.generateMipmaps = true
		texture.minFilter = LinearFilter
		texture.magFilter = NearestFilter
		texture.needsUpdate = true

		// console.log('finish')
		
		this.sourceLoaded(source,texture)

	}

	sourceLoaded(source: source, file: file) {
		this.items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.trigger('load')
			console.log('ready!!!')
		}

		this.trigger('progress')
	}
}

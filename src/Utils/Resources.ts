import { DataArrayTexture, LinearFilter, NearestFilter, Texture, TextureLoader } from 'three'
import Events from './Events'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { File, Items, Loaders, Source } from '../Types/resources.types'



// loaders for all the resources
export default class Resources extends Events {

	sources: Source[]
	items: Items
	toLoad: number
	loaded: number
	loaders: Loaders = {}

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

	loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((res,rej) => {
			const img = new Image()
			img.onload = () => {
				res(img)
				console.log('loaded img')
			}

			img.onerror = (e) => {
				console.error('errore',e)
				rej(e)
			}

			img.src = src
		})
	}

	getSourceByName(srcName: string) {
		return this.sources.find(({name}) => name === srcName)
	}

	startLoading() {
		for (const source of this.sources) {
			const { type } = source

			switch(type) {
				case 'arrayTexture':
					console.log('texture array',source)
					const s = source as Required<Source>
					this.loadArrayTexture(s)
					break
				case 'map':
					this.loadImage(source.path as string).then((img) => {
						source.sizes = {
							width: img.width,
							height: img.height
						}
						this.sourceLoaded(source,img)
					})
					break
				case 'texture':
					this.loaders.textureLoader?.load(source.path as string,(texture) => {
						texture.minFilter = LinearFilter
						texture.magFilter = NearestFilter		
						this.sourceLoaded(source,texture)
					})
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

	async loadArrayTexture(source: Required<Source>) {

		console.log('load array texture')
		const { width, height } = source.sizes
		const size = width * height
		const depth = source.path.length
		const data = new Uint8Array(4 * size * depth)

		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		
		const ctx = canvas.getContext('2d', { willReadFrequently: true })
		

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

	sourceLoaded(source: Source, file: File) {
		this.items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.trigger('load')
			console.log('ready!!!')
		}

		this.trigger('progress')
	}
}

import {
	BoxGeometry,
	BufferAttribute,
	DataArrayTexture,
	LinearFilter,
	LoadingManager,
	Mesh,
	MeshStandardMaterial,
	NearestFilter,
	PlaneGeometry,
	ShaderMaterial,
} from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import cobblestoneSrc from './assets/textures/cobblestone.png?url'
import grassSrc from './assets/textures/grass.png?url'
import gravelSrc from './assets/textures/gravel.png?url'
import sandstoneSrc from './assets/textures/sandstone.png?url'
import dirtSrc from './assets/textures/dirt.png?url'
import stoneSrc from './assets/textures/stone.png?url'
import graniteSrc from './assets/textures/granite.png?url'
import snowyGrassSrc from './assets/textures/snowy-grass.png?url'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'
import * as RAPIER from '@dimforge/rapier3d'

const TILES = {
	COBBLESTONE: 0,
	GRASS: 1,
	GRAVEL: 2,
	SAND: 3,
	DIRT: 4,
	STONE: 5,
	GRANITE: 6,
	SNOWY_GRASS: 7,
}

const texturesSrc = [
	cobblestoneSrc,
	grassSrc,
	gravelSrc,
	sandstoneSrc,
	dirtSrc,
	stoneSrc,
	graniteSrc,
	snowyGrassSrc,
]

const {
	COBBLESTONE: C,
	GRASS: G,
	SAND: S,
	GRANITE: GR,
	STONE: ST,
	GRAVEL: GV,
	DIRT: D,
	SNOWY_GRASS: SG,
} = TILES

const defaultSpriteMap = [
	[C, C, C, GV, GV, GR, GR, GR, ST, ST, ST, ST, C, C, C, C, ST, ST, GR, GR],
	[S, S, S, GV, C, D, GR, C, GV, ST, GR, GR, GR, C, D, C, ST, ST, ST, GR],
	[, , S, S, G, D, D, C, GV, GV, G, G, G, G, D, ST, GR, ST, ST, ST],
	[, , , , , G, G, D, D, C, , , , , G, ST, GR, C, C, C],
	[, , , , , , , G, G, , , , , , , ST, C, D, D, D],
	[, , , , , , , , , , , , , , , SG, ST, D, SG, SG],
	[, , , , , , , , , , , , , , , , SG, SG, ,],
]

export default class MapBuilder {
	manager = new LoadingManager()

	texturesSrc = texturesSrc

	width = 16
	height = 16
	depth = texturesSrc.length

	get textureSize() {
		return this.width * this.height
	}

	uniforms = {
		uDepth: {
			value: 0,
		},
		uDiffuse: {
			value: null,
		},
	}

	constructor({ scene, world, spriteMap = defaultSpriteMap } = {}) {
		this.scene = scene
		this.world = world
		this.spriteMap = spriteMap

		this.init()
	}

	async init() {
		await this.createMesh()
	}

	async initTexture() {
		const data = new Uint8Array(4 * this.textureSize * this.depth)

		const canvas = document.createElement('canvas')
		// document.body.appendChild(canvas)
		const ctx = canvas.getContext('2d')
		ctx.width = this.width
		ctx.height = this.height

		const images = await Promise.all(
			this.texturesSrc.map(async (src) => await this.loadImage(src))
		)

		images.forEach((img, i) => {
			ctx.drawImage(img, 0, 0, this.width, this.height)
			const imageData = ctx.getImageData(0, 0, this.width, this.height)

			for (let j = 0; j < this.textureSize; j++) {
				const r = imageData.data[j * 4 + 0]
				const g = imageData.data[j * 4 + 1]
				const b = imageData.data[j * 4 + 2]
				const a = imageData.data[j * 4 + 3]
				// console.log(c)
				const stride = (i * this.textureSize + j) * 4
				data[stride + 0] = r
				data[stride + 1] = g
				data[stride + 2] = b
				data[stride + 3] = a
			}
		})

		const texture = new DataArrayTexture(
			data,
			this.width,
			this.height,
			this.depth
		)

		texture.needsUpdate = true
		// texture.flipY = true
		texture.generateMipmaps = true
		texture.minFilter = LinearFilter
		texture.magFilter = NearestFilter
		texture.needsUpdate = true

		this.texture = texture
		this.uniforms.uDiffuse.value = texture
	}

	initMaterial() {
		this.material = new ShaderMaterial({
			uniforms: this.uniforms,
			fragmentShader: fragment,
			vertexShader: vertex,
		})
	}

	initGeometry() {
		const geometries = []

		this.spriteMap.forEach((row, i) => {
			row.forEach((z, j) => {
				if (z === undefined) {
					return
				}

				const plane = new PlaneGeometry(1, 1)
				plane.translate(j, i, 0)

				this.createBody(j, i, 0)

				// const textureId = Math.floor(Math.random() * texturesSrc.length)

				const uvCount = 4
				const uvSize = 3
				const uvAttribute = plane.getAttribute('uv')
				// console.log(uvAttribute)
				const uvArray = new Float32Array(uvCount * uvSize)
				const newUvAttribute = new BufferAttribute(uvArray, 3)
				// console.log(newUvAttribute)

				for (let i = 0; i < uvCount; i++) {
					const u = uvAttribute.getX(i)
					const v = uvAttribute.getY(i)

					newUvAttribute.setXYZ(i, u, v, z)
				}

				newUvAttribute.needsUpdate = true

				// plane.deleteAttribute('uv')
				plane.setAttribute('aUv', newUvAttribute)

				// const mesh = new THREE.Mesh(plane, material)
				// mesh.position.x = i
				// mesh.position.y = j

				geometries.push(plane)

				// console.log(mesh)
			})
		})

		const mapGeometry = BufferGeometryUtils.mergeGeometries(geometries)
		// mapGeometry.center()

		this.geometry = mapGeometry
	}

	createBody(x, y, z) {
		const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z)
		const body = this.world.createRigidBody(bodyDesc)
		const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
		const collider = this.world.createCollider(colliderDesc, body)

		// const bodyMesh = new Mesh(
		// 	new BoxGeometry(1, 1, 1),
		// 	new MeshStandardMaterial({ wireframe: true })
		// )
		const position = body.translation()
		// bodyMesh.position.set(position.x, position.y, position.z)

		// this.scene.add(bodyMesh)
	}

	async createMesh() {
		await this.initTexture()
		this.initMaterial()
		this.initGeometry()

		this.mesh = new Mesh(this.geometry, this.material)
		this.scene.add(this.mesh)
	}

	loadImage(src) {
		return new Promise((res) => {
			const img = new Image()
			img.onload = () => {
				res(img)
			}

			img.src = src
		})
	}
}

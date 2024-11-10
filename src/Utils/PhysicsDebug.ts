import {
	BufferGeometry,
	Float32BufferAttribute,
	LineBasicMaterial,
	LineSegments,
	Scene,
} from 'three'
import Game from '../Game'
import Physics from '../Physics'
import Time from './Time'

export default class PhysicsDebug {

	game: Game
	physics: Physics
	scene: Scene
	time: Time
	geometry: BufferGeometry = new BufferGeometry()
	material: LineBasicMaterial | undefined
	lineSegments: LineSegments | undefined

	constructor() {
		this.game = new Game()
		this.physics = this.game.physics
		this.scene = this.game.world.scene
		this.time = this.game.time

		if (this.game.debug.active) {
			this.initDebug()
		}
	}

	initDebug() {
		this.geometry.setAttribute('position', new Float32BufferAttribute([], 3))
		this.geometry.setAttribute('color', new Float32BufferAttribute([], 4))

		this.material = new LineBasicMaterial({ vertexColors: true })

		this.lineSegments = new LineSegments(this.geometry, this.material)
		this.lineSegments.frustumCulled = false
		this.scene.add(this.lineSegments)

		this.time.on(
			'tick',
			() => {
				this.update()
			},
			3
		)
	}

	update() {
		const { vertices, colors } = this.physics.instance.debugRender()

		// console.log('physics debug')
		this.geometry.setAttribute(
			'position',
			new Float32BufferAttribute(vertices, 3)
		)
		this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 4))
		// this.geometry.attributes.position.array = vertices
		// this.geometry.attributes.position.count = vertices.length / 3
		// this.geometry.attributes.position.needsUpdate = true

		// this.geometry.attributes.color.array = colors
		// this.geometry.attributes.color.count = colors.length / 4
		// this.geometry.attributes.color.needsUpdate = true
	}
}

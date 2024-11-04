import {
	BufferGeometry,
	Float32BufferAttribute,
	LineBasicMaterial,
	LineSegments,
} from 'three'

export default class PhysicsDebug {
	constructor() {
		this.geometry = new BufferGeometry()
		this.geometry.setAttribute('position', new Float32BufferAttribute([], 3))
		this.geometry.setAttribute('color', new Float32BufferAttribute([], 4))

		this.material = new LineBasicMaterial({ vertexColors: true })

		this.lineSegments = new LineSegments(this.geometry, this.material)
	}

	update(world) {
		const { vertices, colors } = world.debugRender()

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

import Events from './Events'

export default class Inputs extends Events {
	constructor(map) {
		super()

		this.map = map
		this.keys = map.reduce((acc, val) => {
			acc[val.name] = false
			return acc
		}, {})

		addEventListener('keydown', (e) => {
			this.down(e.code)
		})

		addEventListener('keyup', (e) => {
			this.up(e.code)
		})
	}

	down(code) {
		const map = this.map.find((m) => m.keys.indexOf(code) !== -1)

		if (map && !this.keys[map.name]) {
			this.keys[map.name] = true
			this.trigger(map.name, [true])
		}
	}

	up(code) {
		const map = this.map.find((m) => m.keys.indexOf(code) !== -1)

		if (map && !this.keys[map.name]) {
			this.keys[map.name] = false
			this.trigger(map.name, [false])
		}
	}
}

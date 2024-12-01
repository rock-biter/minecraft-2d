import Events from './Events'

import { input,
inputMap, keys } from '../Types/input.types'

export default class Inputs extends Events {

	map: inputMap
	keys: keys

	constructor(map: inputMap) {
		super()

		this.map = map
		this.keys = map.reduce((acc: keys, val: input) => {
			acc[val.name] = false
			return acc
		}, {} as keys)

		addEventListener('keydown', (e) => {
			this.down(e.code)
		})

		addEventListener('keyup', (e) => {
			this.up(e.code)
		})
	}

	down(code: string) {
		const map = this.map.find((m) => m.keys.indexOf(code) !== -1)

		if (map && !this.keys[map.name]) {
			this.keys[map.name] = true
			this.trigger(map.name, true)
		}

		// console.log(this.keys)
	}

	up(code: string) {
		const map = this.map.find((m) => m.keys.indexOf(code) !== -1)

		if (map && this.keys[map.name]) {
			this.keys[map.name] = false

			this.trigger(map.name, false)
		}
	}
}


import { CallbackArg } from '../Types/callbacks.types'

type callback = (arg?: CallbackArg) => void

interface callbacks {
	[key: string] : callback[][]
}

export default class Events {
	callbacks: callbacks = {}

	// ...
	on(name: string, callback: callback, order = 1) {
		// register callbacks
		if (!Array.isArray(this.callbacks[name])) {
			this.callbacks[name] = []
		}

		if (!Array.isArray(this.callbacks[name][order])) {
			this.callbacks[name][order] = []
		}

		this.callbacks[name][order].push(callback)
	}

	off(name: string, callback: callback | null = null) {
		if (typeof callback === 'function') {
			const callbacks = this.callbacks[name]

			for (const order in this.callbacks[name]) {
				const index = callbacks[order].indexOf(callback)
				if (index !== -1) {
					callbacks[order].splice(index, 1)
				}
			}
		} else {
			if (Array.isArray(this.callbacks[name])) {
				delete this.callbacks[name]
			}
		}

		return this
	}

	// trigger events
	trigger(name: string , args?: CallbackArg) {
		if (Array.isArray(this.callbacks[name])) {
			for (const order in this.callbacks[name]) {
				for (const callback of this.callbacks[name][order]) {
					callback.apply(this, [args])
				}
			}
		}
		return this
	}
}

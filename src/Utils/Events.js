export default class Events {
	constructor() {
		this.callbacks = {}
	}

	// ...
	on(name, callback, order = 1) {
		// register callbacks
		if (!Array.isArray(this.callbacks[name])) {
			this.callbacks[name] = []
		}

		if (!Array.isArray(this.callbacks[name][order])) {
			this.callbacks[name][order] = []
		}

		this.callbacks[name][order].push(callback)
	}

	off(name, callback = null) {
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
	trigger(name, args) {
		if (Array.isArray(this.callbacks[name])) {
			for (const order in this.callbacks[name]) {
				for (const callback of this.callbacks[name][order]) {
					callback.apply(this, args)
				}
			}
		}
		return this
	}
}

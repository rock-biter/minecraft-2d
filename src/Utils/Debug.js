import { Pane } from 'tweakpane'

export default class Debug {
	constructor() {
		this.active = location.hash.indexOf('debug') !== -1

		if (this.active) {
			this.panel = new Pane()
		}
	}
}

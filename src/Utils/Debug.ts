import { Pane } from 'tweakpane'
import Events from './Events'
import EMUNS from './Enums'

export default class Debug extends Events {

	active: boolean
	panel!: Pane

	params = {
		camera: EMUNS.CAMERA_FOLLOW
	}

	constructor() {
		super() 

		this.active = location.hash.indexOf('debug') !== -1

		if (this.active) {
			this.panel = new Pane()

			this.init()
		}
	}

	init() {
		
		this.panel.addBinding(this.params,'camera',{ options: { Follow: EMUNS.CAMERA_FOLLOW, OrbitControls: EMUNS.ORBIT_CONTROLS }}).on('change',(e) => {
			console.log(e,e.value)
			this.trigger('cameraChange',e)
		})

	}
}

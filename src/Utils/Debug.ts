import { Pane } from 'tweakpane'
import Events from './Events'
import EMUNS from './Enums'
import ENUMS from './Enums'

export default class Debug extends Events {

	active: boolean
	panel!: Pane

	params = {
		camera: EMUNS.CAMERA_FOLLOW,
		texturePack: ENUMS.TEXTURE_MINECRAFT_TRAILER
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
		
		this.addCameraPane()
		this.addTexturePane()

	}

	addCameraPane() {
		this.panel.addBinding(this.params,'camera',{ options: { Follow: EMUNS.CAMERA_FOLLOW, OrbitControls: EMUNS.ORBIT_CONTROLS }}).on('change',(e) => {
			// console.log(e,e.value)
			this.trigger('cameraChange',e)
		})
	}

	addTexturePane() {
		this.panel.addBinding(this.params,'texturePack',{ options: { Trailer: EMUNS.TEXTURE_MINECRAFT_TRAILER, Hidden: EMUNS.TEXTURE_PLACEHOLDER }}).on('change',(e) => {
			// console.log(e,e.value)
			this.trigger('texturePackChange',e)
		})
	}
}

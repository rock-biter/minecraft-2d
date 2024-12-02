import { Pane } from 'tweakpane'
import Events from './Events'
import ENUMS from './Enums'
// import { ThreePerf } from 'three-perf'
import Game from '../Game'
import { WebGLRenderer } from 'three'
// import Stats from 'three/examples/jsm/libs/stats.module'
import Stats from "stats-gl";

export default class Debug extends Events {

	active: boolean
	panel!: Pane
	stats: Stats | undefined

	game: Game

	params = {
		camera: ENUMS.CAMERA_FOLLOW,
		texturePack: ENUMS.TEXTURE_MINECRAFT_TRAILER
	}

	constructor() {
		super() 

		this.game = new Game()

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

	addStats() {

		if(this.active) {

			const div = document.createElement('div')
			document.body.appendChild(div)

			this.stats = new Stats({
				trackGPU: false,
				trackHz: false,
				trackCPT: false,
				logsPerSecond: 4,
				graphsPerSecond: 30,
				samplesLog: 40, 
				samplesGraph: 10, 
				precision: 2, 
				horizontal: true,
				minimal: false, 
				mode: 2
			});

			document.body.appendChild( this.stats.dom );

		}
		
	}

	addCameraPane() {
		this.panel.addBinding(this.params,'camera',{ options: { Follow: ENUMS.CAMERA_FOLLOW, OrbitControls: ENUMS.ORBIT_CONTROLS }}).on('change',(e) => {
			// console.log(e,e.value)
			this.trigger('cameraChange',e)
		})
	}

	addTexturePane() {
		this.panel.addBinding(this.params,'texturePack',{ options: { Trailer: ENUMS.TEXTURE_MINECRAFT_TRAILER, Hidden: ENUMS.TEXTURE_PLACEHOLDER }}).on('change',(e) => {
			// console.log(e,e.value)
			this.trigger('texturePackChange',e)
		})
	}
}

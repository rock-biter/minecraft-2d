import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, Scene, Vector3 } from 'three'
import Game from '../Game'

const _V = new Vector3()

export default class Environment {
	
	game: Game

	ambientLight!: AmbientLight
	directionalLight!: DirectionalLight
	
	constructor() {
		this.game = new Game()

		this.setAmbientLight()
		this.setDirectionLight()

		this.game.time.on(
			'tick',
			() => {
				this.update()
			},
			2
		)
	}

	get scene(): Scene {
		return this.game.world.scene
	}

	setAmbientLight() {
		this.ambientLight = new AmbientLight(0xffffff, 1)
		this.scene.add(this.ambientLight)
	}

	setDirectionLight() {
		this.directionalLight = new DirectionalLight(0xffffff, 4)
		const {x = 0,y = 0,z = 0} = this.game.world.player?.entity?.mesh?.position || {}
		this.directionalLight.position.set(x,y,z)
		_V.set(10, -14, -8)
		this.directionalLight.position.sub(_V)
		this.directionalLight.castShadow = true
		this.directionalLight.shadow.mapSize.width = 2048
		this.directionalLight.shadow.mapSize.height = 2048
		this.directionalLight.shadow.bias = 0.0002
		this.directionalLight.shadow.radius = 15
		this.directionalLight.shadow.normalBias = 0.02
		this.directionalLight.shadow.blurSamples = 20
		this.directionalLight.shadow.camera.far = 30
		this.directionalLight.shadow.camera.left = -20
		this.directionalLight.shadow.camera.top = 20
		this.directionalLight.shadow.camera.bottom = -20
		this.directionalLight.shadow.camera.right = 20

		// this.directionalLight.shadow.camera.updateProjectionMatrix()
		this.scene.add(this.directionalLight,this.directionalLight.target)

		if(this.game.debug.active) {
			this.debug()
			this.addPaneFolder()
		}
	}

	addPaneFolder() {
		const f = this.game.debug.panel.addFolder({ title: 'Directional Light', expanded: true })

		f.addBinding(this.directionalLight.shadow,'blurSamples',{ min: 1, max: 30, step: 1})
		f.addBinding(this.directionalLight.shadow,'radius',{ min: 0, max: 20, step: 1})

		f.addBinding(this.directionalLight.shadow,'bias',{ min: 0.0001, max: 0.002, step: 0.0001})

		f.addBinding(this.directionalLight.shadow,'normalBias',{ min: 0.005, max: 0.07, step: 0.001})
	}

	debug() {
		const helper = new DirectionalLightHelper(this.directionalLight,3)
		this.scene.add( helper, new CameraHelper(this.directionalLight.shadow.camera) )

		// this.game.time.on(
		// 	'tick',
		// 	() => {
		// 		helper.update()
		// 	},
		// 	2
		// )
	}

	update() {
		this.directionalLight.position.x = this.game.world.player!.entity!.mesh!.position.x - _V.x
		this.directionalLight.target.position.copy(this.directionalLight.position.clone().add(_V))
	}
}

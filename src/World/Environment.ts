import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, HemisphereLight, Mesh, Scene, Vector3 } from 'three'
import Game from '../Game'

const _V = new Vector3()

export default class Environment {
	
	game: Game

	ambientLight!: AmbientLight
	directionalLight!: DirectionalLight
	undergroundLight?: DirectionalLight
	hemisphereLight?: HemisphereLight
	
	constructor() {
		this.game = new Game()

		this.setAmbientLight()
		this.setDirectionLight()
		// this.setHemisphereLight()
		// this.setUndergroundLight()

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

	setHemisphereLight() {
		this.hemisphereLight = new HemisphereLight(0xeeeeff,0x292929,1)
		this.scene.add(this.hemisphereLight)
	}

	setAmbientLight() {
		this.ambientLight = new AmbientLight(0xffffff, 0.8)
		this.scene.add(this.ambientLight)
	}

	setUndergroundLight() {
		this.undergroundLight = new DirectionalLight(0xffffff, 0.5)
		const {x = 0,y = 0,z = 0} = this.game.world.player?.entity?.mesh?.position || {}
		this.undergroundLight.position.set(x,y,z)
		_V.set(5, -5, -8)
		this.undergroundLight.position.sub(_V)
		this.undergroundLight.castShadow = true
		this.undergroundLight.shadow.mapSize.width = 2048
		this.undergroundLight.shadow.mapSize.height = 2048
		this.undergroundLight.shadow.bias = 0.0002
		this.undergroundLight.shadow.radius = 15
		this.undergroundLight.shadow.normalBias = 0.02
		this.undergroundLight.shadow.blurSamples = 20
		this.undergroundLight.shadow.camera.far = 50
		this.undergroundLight.shadow.camera.left = -20
		this.undergroundLight.shadow.camera.top = 20
		this.undergroundLight.shadow.camera.bottom = -20
		this.undergroundLight.shadow.camera.right = 20

		// this.undergroundLight.target

		// this.undergroundLight.shadow.camera.updateProjectionMatrix()
		this.scene.add(this.undergroundLight,this.undergroundLight.target)

		if(this.game.debug.active) {
			const helper = new DirectionalLightHelper(this.undergroundLight,3)
			this.scene.add( helper, new CameraHelper(this.undergroundLight.shadow.camera) )
		}
	}

	setDirectionLight() {
		this.directionalLight = new DirectionalLight(0xffffff, 3.5)
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
		this.directionalLight.shadow.camera.far = 50
		this.directionalLight.shadow.camera.left = -30
		this.directionalLight.shadow.camera.top = 30
		this.directionalLight.shadow.camera.bottom = -30
		this.directionalLight.shadow.camera.right = 30

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
		this.directionalLight.position.y = this.game.world.player!.entity!.mesh!.position.y - _V.y
		this.directionalLight.target.position.copy(this.directionalLight.position.clone().add(_V))
	}
}

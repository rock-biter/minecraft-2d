import { AmbientLight, DirectionalLight } from 'three'
import Game from '../Game'

export default class Environment {
	constructor() {
		this.game = new Game()
		this.scene = this.game.world.scene

		this.setAmbientLight()
		this.setDirectionLight()
	}

	setAmbientLight() {
		this.ambientLight = new AmbientLight(0xffffff, 1.5)
		this.scene.add(this.ambientLight)
	}

	setDirectionLight() {
		this.directionalLight = new DirectionalLight(0xffffff, 4.5)
		this.directionalLight.position.set(3, 10, 7)
		this.scene.add(this.directionalLight)
	}
}

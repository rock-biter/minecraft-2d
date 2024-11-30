import { Color, IUniform, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, Texture, Vector3 } from "three"
import Game from "../Game"
import Resources from "./Resources"

import fragment from '../shaders/fragment.glsl'
import vertex from '../shaders/vertex.glsl'

import grassFragment from '../shaders/grass/fragment.glsl'
import grassVertex from '../shaders/grass/vertex.glsl'

interface blockUniform {
  [uniform: string]: IUniform<any>
  uDepth: IUniform< number >
  uDiffuse: IUniform< Texture | null>
}

export default class Materials {

  game: Game
  resources: Resources
  uniforms: blockUniform = {
		uDepth: {
			value: 0,
		},
		uDiffuse: {
			value: null,
		},
    uColor: {
      value: new Color(0xffffff)
    }
	}
  blocksMaterial: ShaderMaterial  
  ladderMaterial: MeshBasicMaterial
  grassMaterial: ShaderMaterial

  constructor() {
    this.game = new Game()
    this.resources = this.game.resources

    this.blocksMaterial = new ShaderMaterial({
			uniforms: this.uniforms,
			fragmentShader: fragment,
			vertexShader: vertex,
      transparent: true,
		})

    this.uniforms.uDiffuse.value = this.resources.items['blocks'] as Texture


    this.ladderMaterial = new MeshBasicMaterial({
      map: this.resources.items['ladder'] as Texture,
      transparent: true
    })

    this.grassMaterial = new ShaderMaterial({
			uniforms: this.uniforms,
			fragmentShader: grassFragment,
			vertexShader: grassVertex,
      transparent: true,
		})

  }

}
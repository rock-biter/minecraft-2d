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
  blocksMaterial!: ShaderMaterial | MeshStandardMaterial
  ladderMaterial!: MeshBasicMaterial | MeshStandardMaterial
  grassMaterial!: ShaderMaterial | MeshStandardMaterial
  lavaStillMaterial!: ShaderMaterial | MeshStandardMaterial
  fireMaterial!: ShaderMaterial | MeshBasicMaterial
  waterMaterial!: ShaderMaterial | MeshStandardMaterial

  constructor() {
    this.game = new Game()
    this.resources = this.game.resources
    this.uniforms.uDiffuse.value = this.resources.items['blocks'] as Texture

    this.initBlockMaterial()
    this.initGrassMaterial()
    this.initLadderMaterial()
    this.initLavaMaterials()
    this.initFireMaterial()
    this.initWaterMaterial()

  }

  initWaterMaterial() {
    this.waterMaterial = new MeshStandardMaterial({ color: 0x3355ff, transparent: true,
      opacity: 0.7,
    })
  }

  initBlockMaterial() {
    // this.blocksMaterial = new ShaderMaterial({
		// 	uniforms: this.uniforms,
		// 	fragmentShader: fragment,
		// 	vertexShader: vertex,
    //   // transparent: true,
		// })

    this.blocksMaterial = new MeshStandardMaterial()
    // this.blocksMaterial.defines = {
    //   USE_UV: true
    // }

    this.blocksMaterial.onBeforeCompile = (shader) => {

      shader.uniforms.uDiffuse = this.uniforms.uDiffuse
      
      let token = '#include <common>'

      shader.vertexShader = shader.vertexShader.replace(token,
        /* glsl */`
        ${token}
        attribute vec3 aUv;
        uniform sampler2DArray uDiffuse;
        varying vec3 vUv;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(token,
        /* glsl */`
        ${token}
        uniform sampler2DArray uDiffuse;
        varying vec3 vUv;
        `
      )

      token = '#include <uv_vertex>'

      shader.vertexShader = shader.vertexShader.replace(token,
        /* glsl */`
        ${token}
        vUv.xyz = aUv.xyz;
        vUv.y = 1. - vUv.y;
        `
      )

      token = '#include <map_fragment>'

      shader.fragmentShader = shader.fragmentShader.replace(token,
        /* glsl */`
        // ${token}
        
        diffuseColor.rgb = texture( uDiffuse, vUv ).rgb;
        `
      )


    }
  }

  initGrassMaterial() {
    // this.grassMaterial = new ShaderMaterial({
		// 	uniforms: this.uniforms,
		// 	fragmentShader: grassFragment,
		// 	vertexShader: grassVertex,
    //   transparent: true,
		// })

    this.grassMaterial = new MeshStandardMaterial()

    this.grassMaterial.onBeforeCompile = (shader) => {

      shader.uniforms.uDiffuse = this.uniforms.uDiffuse
      shader.uniforms.uColor = this.uniforms.uColor
      
      let token = '#include <common>'

      shader.vertexShader = shader.vertexShader.replace(token,
        /* glsl */`
        ${token}
        attribute vec3 aUv;
        uniform sampler2DArray uDiffuse;
        varying vec3 vUv;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(token,
        /* glsl */`
        ${token}
        uniform sampler2DArray uDiffuse;
        varying vec3 vUv;
        `
      )

      token = '#include <uv_vertex>'

      shader.vertexShader = shader.vertexShader.replace(token,
        /* glsl */`
        ${token}
        vUv.xyz = aUv.xyz;
        vUv.y = 1. - vUv.y;
        `
      )

      token = '#include <map_fragment>'

      shader.fragmentShader = shader.fragmentShader.replace(token,
        /* glsl */`
        // ${token}
        
        diffuseColor.rgb = texture( uDiffuse, vUv ).rgb;

        if(vUv.z == 8.) {
          // top grass
          vec4 g_color = texture( uDiffuse, vec3(0.,0.,1.) );
          diffuseColor.rgb -= vec3(0.42);
          diffuseColor.rgb += g_color.rgb;
        }
        `
      )


    }
  }

  initLadderMaterial() {
    this.ladderMaterial = new MeshStandardMaterial({
      map: this.resources.items['ladder'] as Texture,
      transparent: true
    })
  }

  initLavaMaterials() {

    const map = this.resources.items['lava_still'] as Texture
    map.repeat.y = 1/20
    let count = 0
    setInterval(() => {
      count++
      count = count % (19 * 16)
      map.offset.y = count/(20 * 16)
    },250)

    this.lavaStillMaterial = new MeshStandardMaterial({
      map,
      transparent: true,
      opacity: 1
    })
  }

  initFireMaterial() {
    const map = this.resources.items['fire'] as Texture

    map.repeat.y = 1/32
    let count = 0
    setInterval(() => {
      count++
      count = count % 32
      map.offset.y = count/32
    },100)

    this.fireMaterial = new MeshBasicMaterial({
      map,
      transparent: true,
      // wireframe: true,
      opacity: 1,
    })
  }

}
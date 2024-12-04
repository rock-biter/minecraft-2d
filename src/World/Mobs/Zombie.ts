import { AxesHelper, BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import Enemy from "./Enemy";
import { GLTF } from "three/examples/jsm/Addons";
import gsap from "gsap";

export default class Zombie extends Enemy {
  constructor({ position = new Vector3(), buonds = 3}) {
    super(position, buonds)

		// this.addSkin()
  }

	turnSkin(angle: number) {

		if(!this.skin) return


		gsap.to(this.skin.rotation,{ z: angle })

	}

  getMesh() {

    let gltf = this.resources.items['zombie'] as GLTF

    console.log('enemy',gltf)
    
		if(!gltf /*|| this.debug.active*/) {

			return new Mesh(
				new BoxGeometry(1,2,1),
				this.material
			)

		}

		// console.log(gltf.animations)
		this.animations = gltf.animations

		// // mesh.scene.scale.setScalar(20)
		// const mesh = gltf.scene.children[0] as Object3D
    const mesh = gltf.scene.children[0] as Object3D

		// mesh.scale.setScalar(0.92)
		// mesh.position.y = -0.95
		// mesh.rotation.y = Math.PI
		const obj = new Object3D()
		
		this.skin = mesh.clone()
		this.skin.rotation.z = Math.PI
		this.skin.position.y -= +1
		this.skin.scale.setScalar(1)
		
		// this.skin.position.set(0,10,0)
		obj.add(this.skin)

		this.skin.traverse(el => {
			// if(!(el instanceof AxesHelper)) {
			// 	// el.add(new AxesHelper(1))
			// }

			if(el.name.includes('rightArm_7')) {
				el.children[0].position.set(-0.3,-0.,-0)
				const mesh = el.children[0].children[0] as Mesh
				mesh.position.y -= 1.4
				// mesh.add(new AxesHelper(1))
				el.children[0].rotation.x = Math.PI * 0.5
			}

			if(el.name.includes('leftArm_10')) {
				// el.position.setScalar(0)
				// el.add(new AxesHelper(1))
				// el.rotation.x = Math.PI * 0.25
				// el.rotation.x = Math.PI * 0.25
				el.children[0].position.set(0.3,-0.,-0)
				const mesh = el.children[0].children[0] as Mesh
				mesh.position.y -= 1.4
				// mesh.add(new AxesHelper(1))
				el.children[0].rotation.x = Math.PI * 0.5
				// mesh.geometry.center()


				
				// el.po
				// setInterval(() => {
				// 	el.children[0].rotation.x += 0.01
					
				// },16)
			}
		})

		if(this.velocity.x !== 0 ) {
			this.turnSkin(Math.PI * 0.5)

			const turn = () => {
				this.turnSkin(Math.sign(this.velocity.x) === 1 ? Math.PI * 3 / 2 : Math.PI * 0.5)
			}

			this.on('changeDirection',turn)
			this.on('beforeDestroy',() => {
				this.off('changeDirection',turn)
			})
		}

		// console.log('skin',this.skin)

		this.scene.add(obj)

		return obj

		// this.createMixer()

		// return obj

  }

  

  
}
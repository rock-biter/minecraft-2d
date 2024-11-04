import './style.css'
import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

console.log(RAPIER)

// __controls_import__
// __gui_import__

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import MapBuilder from './src/MapBuilder'
import Player from './src/Player'
import Debug from './src/Debug'
import PhysicsDebug from './src/PhysicsDebug'

/**
 * Debug
 */
// __gui__
// const configs = {
// 	uDepth: 0,
// }
// const gui = new dat.GUI()
// gui.add(configs, 'uDepth', 0, 10, 1).onChange((val) => console.log(val))
const debug = new Debug()
const physicsDebug = new PhysicsDebug()

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xabe9ff)
// scene.background = new THREE.Color(0xdedede)

// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshStandardMaterial({ color: 'coral' })
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.y += 0.5
// scene.add(mesh)

// __floor__
/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

// const textureLoader = new THREE.TextureLoader()
const gravity = new RAPIER.Vector3(0, -9.81, 0)
const world = new RAPIER.World(gravity)
const spriteMap = new MapBuilder({ scene, world })
const player = new Player({ scene, world })

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const f = 8
let aspect = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(
	-f * aspect,
	f * aspect,
	f,
	-f,
	0.1,
	1000
)
camera.position.set(0, 0, 10)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

physicsDebug.update(world)

scene.add(physicsDebug.lineSegments)

/**
 * Three js Clock
 */
// __clock__
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	// __controls_update__
	controls.update()
	world.step()
	player.update()
	physicsDebug.update(world)

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	aspect = sizes.width / sizes.height
	camera.left = -f * aspect
	camera.right = f * aspect

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

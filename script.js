import * as THREE from 'https://cdn.skypack.dev/three@0.124.0';
import orbitControls from 'https://cdn.skypack.dev/three-orbit-controls';
import { RGBELoader  } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/RGBELoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/OBJLoader.js';


// threejs boilerplate
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('cv-container');
const containerRect = container.getBoundingClientRect();
renderer.setSize( containerRect.width, containerRect.height );
document.getElementById("cv-container").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, containerRect.width / containerRect.height, 0.1, 1000 );
camera.position.set(9,5,10);

// orbit controls
const OrbitControls = orbitControls(THREE);
const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const axisHelper = new THREE.AxesHelper( 5 );
scene.add( axisHelper );
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

// geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( box );

const planeGeometry = new THREE.PlaneGeometry( 5, 5, 32 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = Math.PI / 2;
scene.add( plane );


// animation loop
function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();

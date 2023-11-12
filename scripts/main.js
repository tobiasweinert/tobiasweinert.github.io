import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import createBoxWithRoundedEdges from "./boxWithRoundedEdges.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// threejs boilerplate
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById("cv-container");
const containerRect = container.getBoundingClientRect();
renderer.setSize(containerRect.width, containerRect.height);
document.getElementById("cv-container").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  containerRect.width / containerRect.height,
  0.1,
  1000
);
camera.position.set(0, 0, 20);

// orbit controls
// const OrbitControls = orbitControls(THREE);
const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const axisHelper = new THREE.AxesHelper(50);
scene.add(axisHelper);
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

// geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const exPlaneGeometry = new THREE.PlaneGeometry(5, 5, 32);
const exPlaneMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const exPlane = new THREE.Mesh(exPlaneGeometry, exPlaneMaterial);
exPlane.rotation.x = Math.PI / 2;
scene.add(exPlane);

// we want a carousel of 5 planes that rotate around the y axis
const carousel = new THREE.Group();
scene.add(carousel);

// Define the geometry and material for the planes
const roundedBoxGeometry = new RoundedBoxGeometry(10, 16, 0.7, 3, 0.5);
const roundedBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
console.log(roundedBoxGeometry.attributes.position);

// Create 5 planes and add them to the carousel
for (let i = 0; i < 5; i++) {
  const roundedBox = new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial);

  const angle = (i / 5) * Math.PI * 2;
  const radius = 8;

  // Calculate the position using polar coordinates
  roundedBox.position.x = radius * Math.cos(angle);
  roundedBox.position.z = radius * Math.sin(angle);

  // Rotate the plane
  roundedBox.rotation.y = -angle + Math.PI / 2;

  carousel.add(roundedBox);
}

// // text
const fontLoader = new FontLoader();
fontLoader.load(
  "./assets/fonts/droid_serif_regular.typeface.json",
  (droidFont) => {
    const textGeometry = new TextGeometry("hello world", {
      height: 0.2,
      size: 1,
      font: droidFont,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(-10, 0, 0);
    scene.add(text);
  }
);

function animate() {
  // Rotate the entire carousel group around the y-axis
  carousel.rotation.y += 0.005;

  // Render the scene
  renderer.render(scene, camera);

  // Request the next frame
  requestAnimationFrame(animate);
}

function handleResize() {
  const containerRect = container.getBoundingClientRect();
  renderer.setSize(containerRect.width, containerRect.height);
  camera.aspect = containerRect.width / containerRect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", handleResize);
// Start the animation loop
animate();

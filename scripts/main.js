import * as THREE from "three";
import * as TWEEN from "tween";
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
//const controls = new OrbitControls(camera, renderer.domElement);

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
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

// create 5 boxes and add them to the carousel
for (let i = 0; i < 5; i++) {
  const roundedBoxMaterial = new THREE.MeshBasicMaterial({ color: colors[i] });
  const roundedBox = new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial);

  const angle = (i / 5) * Math.PI * 2;
  const radius = 8;

  // calculate the position using polar coordinates
  roundedBox.position.x = radius * Math.cos(angle);
  roundedBox.position.z = radius * Math.sin(angle);

  // rotate the box
  roundedBox.rotation.y = -angle + Math.PI / 2;

  // rotate the carousel so that it faces the camera at 0,0,20
  carousel.rotation.y = Math.PI * 0.7;
  carousel.add(roundedBox);
}

const snapAngles = [];
for (let i = 0; i < 5; i++) {
  snapAngles.push((i / 5) * Math.PI * 2 + Math.PI * 0.7);
  // push negative values
  snapAngles.push(-(i / 5) * Math.PI * 2 + Math.PI * 0.7);
}

function findClosestSnapAngle(currentAngle) {
  let closestSnapAngle = snapAngles[0];
  let closestAngleDifference = Math.abs(currentAngle - closestSnapAngle);
  for (let i = 1; i < snapAngles.length; i++) {
    const angleDifference = Math.abs(currentAngle - snapAngles[i]);
    if (angleDifference < closestAngleDifference) {
      closestSnapAngle = snapAngles[i];
      closestAngleDifference = angleDifference;
    }
  }
  //("curr, close", currentAngle, closestSnapAngle);
  return closestSnapAngle;
}

// text
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

// animation
let isDragging = false;
let previousPointerX = 0;

document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);

function onPointerDown(event) {
  isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
}

function onPointerMove(event) {
  if (isDragging) {
    const currentPointerX = event.clientX || event.touches[0].clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    carousel.rotation.y += deltaX * 0.005;
    previousPointerX = currentPointerX;
    renderer.render(scene, camera);
  }
}

function onPointerUp() {
  if (isDragging) {
    isDragging = false;

    // Calculate a threshold as a percentage of one full rotation
    const rotationThreshold = (Math.PI * 2) / 10;
    // Reset positive rotation
    if (carousel.rotation.y > Math.PI * 2 + Math.PI * 0.7 - rotationThreshold) {
      carousel.rotation.y = carousel.rotation.y % (Math.PI * 2);
    }
    // Reset negative rotation
    if (
      carousel.rotation.y <
      -Math.PI * 2 + Math.PI * 0.7 + rotationThreshold
    ) {
      carousel.rotation.y =
        ((carousel.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    }
    const snapAngle = findClosestSnapAngle(carousel.rotation.y);
    carousel.rotation.y = snapAngle;
  }
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

function handleResize() {
  const containerRect = container.getBoundingClientRect();
  renderer.setSize(containerRect.width, containerRect.height);
  camera.aspect = containerRect.width / containerRect.height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", handleResize);

import * as THREE from "three";
import * as TWEEN from "tween";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// threejs boilerplate
const texture = new THREE.TextureLoader().load(`./assets/images/diffuse.jpg`);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById("cv-container");
const containerRect = container.getBoundingClientRect();
renderer.setSize(containerRect.width, containerRect.height);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementById("cv-container").appendChild(renderer.domElement);
const fontLoader = new FontLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  containerRect.width / containerRect.height,
  0.1,
  1000
);

// lights
const light = new THREE.DirectionalLight(0xffffff, 2.5);
light.position.set(0, 0, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

camera.position.set(0, 0, 25);

const glowParams = {
  thresold: 0.05,
  strength: 0.15,
  radius: 1,
  exposure: 1,
};

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(containerRect.width, containerRect.height),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = glowParams.thresold;
bloomPass.strength = glowParams.strength;
bloomPass.radius = glowParams.radius;

const outputPass = new OutputPass();
outputPass.renderToScreen = true;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(outputPass);

// orbit controls
// const OrbitControls = orbitControls(THREE);
//const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const axisHelper = new THREE.AxesHelper(5000);
//scene.add(axisHelper);
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

// we want a carousel of 5 planes that rotate around the y axis
const carousel = new THREE.Group();
scene.add(carousel);

// Define the geometry and material for the planes
const roundedBoxGeometry = new RoundedBoxGeometry(13, 13, 0.5, 3, 0.5);
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

// create 5 boxes and add them to the carousel
for (let i = 0; i < 5; i++) {
  // const roundedBoxMaterial = new THREE.MeshStandardMaterial({
  //   color: colors[i],
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  const roundedBoxMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1,
    metalness: 0.2,
  });
  roundedBoxMaterial.side = THREE.DoubleSide;
  roundedBoxMaterial.flatShading = true;
  roundedBoxMaterial.aoMap = texture;
  roundedBoxMaterial.aoMapIntensity = 1;
  roundedBoxMaterial.displacementMap = texture;
  roundedBoxMaterial.displacementScale = 0.4;
  roundedBoxMaterial.displacementBias = 0.3;
  const roundedBox = new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial);
  const angle = (i / 5) * Math.PI * 2;
  const radius = 13;
  // calculate the position using polar coordinates
  roundedBox.position.x = radius * Math.cos(angle);
  roundedBox.position.z = radius * Math.sin(angle);
  // rotate the box
  roundedBox.rotation.y = -angle + Math.PI / 2;
  // rotate the carousel so that it faces the camera at 0,0,20
  carousel.rotation.y = Math.PI * 0.7;

  // add text to the box
  fontLoader.load(
    "./assets/fonts/droid_serif_regular.typeface.json",
    (droidFont) => {
      const textGeometry = new TextGeometry("Heading", {
        height: 0.2,
        size: 1,
        font: droidFont,
        curveSegments: 18,
      });
      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x545352,
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // set the position of the text with respect to the box rotation
      text.position.x = -2.5;
      text.position.y = 5;
      text.position.z = 0.9;
      roundedBox.add(text);
    }
  );
  carousel.add(roundedBox);
}

// animation
let isDragging = false;
let isTransitioning = false;
let previousPointerX = 0;

document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onPointerMove);
// add event for arrow left and right
document.addEventListener("keydown", (event) => {
  if (isTransitioning) return;
  let targetRotation = carousel.rotation.y;
  if (event.key === "ArrowLeft") {
    targetRotation += Math.PI * 2 * (1 / 5);
  }
  if (event.key === "ArrowRight") {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(carousel.rotation)
    .to({ y: targetRotation }, 800)
    .easing(TWEEN.Easing.Bounce.Out)
    .onComplete(() => {
      isTransitioning = false;
    })
    .onStart(() => {
      isTransitioning = true;
    })
    .onStop(() => {
      isTransitioning = false;
    })
    .start();
});

function onPointerDown(event) {
  isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
}

function onPointerMove(event) {
  if (isTransitioning) return;
  if (event.type === "wheel") {
    // if the user scrolls, we need to rotate the carousel all the way to the next box
    const scrollThreshold = 10;
    let targetRotation = carousel.rotation.y;
    if (event.deltaY < -scrollThreshold) {
      targetRotation += Math.PI * 2 * (1 / 5);
    } else if (event.deltaY > scrollThreshold) {
      targetRotation -= Math.PI * 2 * (1 / 5);
    }
    new TWEEN.Tween(carousel.rotation)
      .to({ y: targetRotation }, 800)
      .easing(TWEEN.Easing.Bounce.Out)
      .onComplete(() => {
        isTransitioning = false;
      })
      .onStart(() => {
        isTransitioning = true;
      })
      .onStop(() => {
        isTransitioning = false;
      })
      .start();

    // Start the animation loop
    animate();
  }
  if (isDragging) {
    const currentPointerX = event.clientX || event.touches[0].clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    carousel.rotation.y += deltaX * 0.005;
    previousPointerX = currentPointerX;
    renderer.render(scene, camera);
  }
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
  return closestSnapAngle;
}

function onPointerUp() {
  if (isTransitioning) return;
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
    new TWEEN.Tween(carousel.rotation)
      .to({ y: snapAngle }, 300)
      .easing(TWEEN.Easing.Back.Out)
      .onComplete(() => {
        isTransitioning = false;
      })
      .onStart(() => {
        isTransitioning = true;
      })
      .onStop(() => {
        isTransitioning = false;
      })
      .start();
  }
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  TWEEN.update();
  composer.render();
}
animate();

function handleResize() {
  const containerRect = container.getBoundingClientRect();
  renderer.setSize(containerRect.width, containerRect.height);
  camera.aspect = containerRect.width / containerRect.height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", handleResize);

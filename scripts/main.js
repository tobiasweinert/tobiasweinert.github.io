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
async function fetchText() {
  const text = await fetch("../assets/en.texts.json");
  return text.json();
}
const texts = await fetchText();

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
const light = new THREE.DirectionalLight(0x7e7c82, 7);
light.position.set(0, 0, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x4287f5, 2);
scene.add(ambientLight);

// camera.position.set(0, 0, 25);

const glowParams = {
  thresold: 0.05,
  strength: 0.15,
  radius: 0.3,
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
// const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const axisHelper = new THREE.AxesHelper(5000);
//scene.add(axisHelper);
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

// Starry night background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
});
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 1000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 4)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const roundedBoxMaterial = new THREE.MeshPhongMaterial({
  map: texture,
  shininess: 100,
});

function getCenterXForText(textGeometry) {
  textGeometry.computeBoundingBox();
  const textWidth =
    textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
  const centerX = -textWidth / 2;
  return centerX;
}

// we want a carousel of 5 planes that rotate around the y axis
const carousel = new THREE.Group();
scene.add(carousel);

// Define the geometry and material for the planes
const roundedBoxGeometry = new RoundedBoxGeometry(13, 13, -0.5, 3, 0.5);
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
// create 5 boxes and add them to the carousel
for (let i = 0; i < 5; i++) {
  // const roundedBoxMaterial = new THREE.MeshStandardMaterial({
  //   color: colors[i],
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 2.5);

  roundedBoxMaterial.side = THREE.DoubleSide;
  roundedBoxMaterial.flatShading = true;
  roundedBoxMaterial.aoMap = texture;
  roundedBoxMaterial.aoMapIntensity = 1;
  roundedBoxMaterial.displacementMap = texture;
  roundedBoxMaterial.displacementScale = 0.2;
  roundedBoxMaterial.displacementBias = 0.5;
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

  const lines = texts.planes[i].text.split("\n");
  let textHeight = 0;
  for (let j = 0; j < lines.length; j++) {
    fontLoader.load("./assets/fonts/Nexa Heavy_Regular.json", (droidFont) => {
      const textGeometry = new TextGeometry(lines[j], {
        height: 0.1,
        size: 0.3,
        font: droidFont,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xa1a1a1,
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // set the position of the text with respect to the box rotation
      text.position.x = getCenterXForText(textGeometry);
      text.position.y = 4 - textHeight;
      text.position.z = 0.4;
      roundedBox.add(text);
      textHeight += 0.8;
    });
  }
  // add text to the box
  fontLoader.load("./assets/fonts/Nexa Heavy_Regular.json", (droidFont) => {
    const textGeometry = new TextGeometry(texts.planes[i].title, {
      height: 0.15,
      size: 0.8,
      font: droidFont,
      curveSegments: 18,
    });
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1a1a1,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    // set the position of the text with respect to the box rotation
    text.position.x = getCenterXForText(textGeometry);
    text.position.y = 5;
    text.position.z = 0.4;
    roundedBox.add(text);
  });
  carousel.position.y = -0.7;
  carousel.add(roundedBox);
}

// add another plane in front of the first visible plane
// this plane will tell the user how to navigate the carousel

let isTransitioning = true;
let isDragging = false;
const cameraPositions = [
  { x: 40, y: 60, z: 50 },
  { x: 30, y: 50, z: 40 },
  { x: 20, y: 40, z: 30 },
  { x: 10, y: 30, z: 25 },
  { x: 0, y: 20, z: 25 },
  { x: 0, y: -0.7, z: 25 },
];

const cameraLooks = [
  { x: 0, y: -1, z: -1 },
  { x: 0, y: 0, z: -1 },
];

camera.position.set(
  cameraPositions[0].x,
  cameraPositions[0].y,
  cameraPositions[0].z
);

const initialLookAt = new THREE.Vector3();
const finalLookAt = new THREE.Vector3(
  cameraLooks[1].x,
  cameraLooks[1].y,
  cameraLooks[1].z
);

new TWEEN.Tween({ t: 0 })
  .to({ t: 1 }, 3500)
  .easing(TWEEN.Easing.Linear.None)
  .onUpdate(({ t }) => {
    const interpolatedLookAt = new THREE.Vector3().lerpVectors(
      initialLookAt,
      finalLookAt,
      t
    );
    // Update camera position
    camera.position.set(
      camera.position.x + (cameraLooks[1].x - cameraLooks[0].x) * t,
      camera.position.y + (cameraLooks[1].y - cameraLooks[0].y) * t,
      camera.position.z + (cameraLooks[1].z - cameraLooks[0].z) * t
    );

    // Update camera lookAt
    camera.lookAt(interpolatedLookAt);
  })
  .start();

// do the camera animation
new TWEEN.Tween(camera.position)
  .to(cameraPositions[1], 500)
  .onStart(() => {
    new TWEEN.Tween(carousel.rotation)
      .to({ y: Math.PI * 2 + Math.PI * 0.7 }, 3500)
      .start();
  })
  .easing(TWEEN.Easing.Linear.None)
  .onComplete(() => {
    new TWEEN.Tween(camera.position)
      .to(cameraPositions[2], 500)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        new TWEEN.Tween(camera.position)
          .to(cameraPositions[3], 500)
          .easing(TWEEN.Easing.Linear.None)
          .onComplete(() => {
            new TWEEN.Tween(camera.position)
              .to(cameraPositions[4], 500)
              .easing(TWEEN.Easing.Linear.None)
              .onComplete(() => {
                new TWEEN.Tween(camera.position)
                  .to(cameraPositions[5], 1500)
                  .easing(TWEEN.Easing.Quadratic.InOut)
                  .onComplete(() => {
                    // Tadd the controls after the animation is complete
                    isTransitioning = false;
                  })
                  .start();
              })
              .start();
          })
          .start();
      })
      .start();
  })
  .start();
let previousPointerX = 0;
let mouseX = 0;
let mouseY = 0;
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onPointerMove);
// add event for arrow left and right
document.addEventListener("keydown", (event) => {
  if (isTransitioning || isDragging) return;
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
  if (isTransitioning) return;
  isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
}

function onPointerMove(event) {
  if (isTransitioning) return;
  if (event.type === "wheel" && isDragging) return;
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
  }
  if (isDragging) {
    const currentPointerX = event.clientX || event.touches[0].clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    carousel.rotation.y += deltaX * 0.005;
    previousPointerX = currentPointerX;
    renderer.render(scene, camera);
  }
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
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
      .to({ y: snapAngle }, 200)
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
  // add movement to starry night using mouse position
  stars.rotation.y = mouseX * 0.1;
  stars.rotation.x = mouseY * 0.1;
  // make random stars twinkle
  const time = Date.now() * 0.00005;
  stars.geometry.attributes.position.array.forEach((_, index) => {
    if (index % 3 === 0) {
      stars.geometry.attributes.position.array[index] +=
        Math.sin(index + time) * 3;
    }
  });
  stars.geometry.attributes.position.needsUpdate = true;
}
animate();

function handleResize() {
  const containerRect = container.getBoundingClientRect();
  renderer.setSize(containerRect.width, containerRect.height);
  camera.aspect = containerRect.width / containerRect.height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", handleResize);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    camera.lookAt(0, 0, -1);
  } else {
    camera.lookAt(0, 0, -1);
  }
});

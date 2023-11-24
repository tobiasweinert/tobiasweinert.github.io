import * as THREE from "three";
import globals from "./globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const imageLoader = new THREE.ImageLoader();

const snapAngles = [];
const positiveSnapAngles = [];
const negativeSnapAngles = [];
// angle in radiants for one full positive and negative rotation
for (let i = 0; i < 5; i++) {
  snapAngles.push((i / 5) * Math.PI * 2 + Math.PI * 0.7);
  negativeSnapAngles.push((i / 5) * Math.PI * 2 + Math.PI * 0.7);
  snapAngles.push(-(i / 5) * Math.PI * 2 + Math.PI * 0.7);
  positiveSnapAngles.push(-(i / 5) * Math.PI * 2 + Math.PI * 0.7);
}
// Swap second and last elements
[negativeSnapAngles[1], negativeSnapAngles[4]] = [
  negativeSnapAngles[4],
  negativeSnapAngles[1],
];

// Swap third and fourth elements
[negativeSnapAngles[2], negativeSnapAngles[3]] = [
  negativeSnapAngles[3],
  negativeSnapAngles[2],
];

const slideNamesMap = {
  0: "Welcome",
  1: "About Myself",
  2: "Education",
  3: "Projects",
  4: "Contact",
};

export function getCenterXForText(textGeometry) {
  textGeometry.computeBoundingBox();
  const textWidth =
    textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
  const centerX = -textWidth / 2;
  return centerX;
}

export function findClosestSnapAngle(currentAngle) {
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

export function setCurrentSlide(nextSnapAngle) {
  nextSnapAngle = normalizeAngle(nextSnapAngle);
  let currentSlide = -1;
  for (let i = 0; i < positiveSnapAngles.length; i++) {
    if (nextSnapAngle === positiveSnapAngles[i]) {
      currentSlide = i;
    }
  }
  if (currentSlide === -1) {
    for (let i = 0; i < negativeSnapAngles.length; i++) {
      if (nextSnapAngle === negativeSnapAngles[i]) {
        currentSlide = i;
      }
    }
  }
  if (currentSlide === -1) {
    // no slide was found, search for the nearest one
    // this happens because cumulative rounding errors when rotating the carousel
    // and suggests a better state management is needed
    let closest = findClosestSnapAngle(nextSnapAngle);
    for (let i = 0; i < positiveSnapAngles.length; i++) {
      if (closest === positiveSnapAngles[i]) {
        currentSlide = i;
      }
    }
    if (currentSlide === -1) {
      for (let i = 0; i < negativeSnapAngles.length; i++) {
        if (closest === negativeSnapAngles[i]) {
          currentSlide = i;
        }
      }
    }
  }
  globals.currentSlide = currentSlide;
  setCurrentSlideText(currentSlide);
}

export function normalizeAngle(angle) {
  // Reset positive rotation
  if (angle > Math.PI * 1.6 + Math.PI * 0.7) {
    angle = angle % (Math.PI * 2);
  }
  // Reset negative rotation
  if (angle < -Math.PI * 1.6 + Math.PI * 0.7) {
    angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  }
  return angle;
}

export function setCurrentSlideText(currentSlide) {
  // Set current slide text to div id currentSlide
  const currentSlideText = document.getElementById("currentSlide");
  currentSlideText.innerHTML = "Current Slide: " + slideNamesMap[currentSlide];
}

export function createTextMesh(
  text,
  x,
  y,
  z,
  size,
  height,
  lineHeight,
  font,
  centered = false
) {
  // create an array of meshes, one for each line of text
  const meshes = [];
  const lines = text.split("\n");
  let textHeight = 0;
  for (let i = 0; i < lines.length; i++) {
    const textGeometry = new TextGeometry(lines[i], {
      height: height,
      size: size,
      font: font,
      curveSegments: 12,
    });
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1a1a1,
      flatShading: true,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    // set the position of the text with respect to the box rotation
    text.position.x = centered ? getCenterXForText(textGeometry) : x;
    text.position.y = y - textHeight;
    text.position.z = z;
    meshes.push(text);
    textHeight += lineHeight;
  }
  return meshes;
}

export async function loadImage(src) {
  return new Promise((resolve, reject) => {
    imageLoader.load(src, (image) => {
      resolve(image);
    });
  });
}

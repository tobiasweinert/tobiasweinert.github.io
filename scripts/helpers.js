import globals from "./globals.js";

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
  globals.currentSlide = currentSlide;
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

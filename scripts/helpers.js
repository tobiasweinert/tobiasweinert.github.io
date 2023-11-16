export function getCenterXForText(textGeometry) {
  textGeometry.computeBoundingBox();
  const textWidth =
    textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
  const centerX = -textWidth / 2;
  return centerX;
}

export function findClosestSnapAngle(currentAngle) {
  const snapAngles = [];
  // angle in radiants for one full positive and negative rotation
  for (let i = 0; i < 5; i++) {
    snapAngles.push((i / 5) * Math.PI * 2 + Math.PI * 0.7);
    snapAngles.push(-(i / 5) * Math.PI * 2 + Math.PI * 0.7);
  }
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

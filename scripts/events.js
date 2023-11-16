import globals from "./globals.js";
import * as TWEEN from "tween";

let previousPointerX = 0;
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onPointerMove);
// add event for arrow left and right
document.addEventListener("keydown", (event) => {
  if (globals.isTransitioning || globals.isDragging) return;
  let targetRotation = globals.carousel.rotation.y;
  if (event.key === "ArrowLeft") {
    targetRotation += Math.PI * 2 * (1 / 5);
  }
  if (event.key === "ArrowRight") {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(globals.carousel.rotation)
    .to({ y: targetRotation }, 800)
    .easing(TWEEN.Easing.Bounce.Out)
    .onComplete(() => {
      globals.isTransitioning = false;
    })
    .onStart(() => {
      globals.isTransitioning = true;
    })
    .onStop(() => {
      globals.isTransitioning = false;
    })
    .start();
});

function onPointerDown(event) {
  if (globals.isTransitioning) return;
  globals.isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
}

function onPointerMove(event) {
  if (globals.isTransitioning) return;
  if (event.type === "wheel" && globals.isDragging) return;
  if (event.type === "wheel") {
    // if the user scrolls, we need to rotate the carousel all the way to the next box
    const scrollThreshold = 10;
    let targetRotation = globals.carousel.rotation.y;
    if (event.deltaY < -scrollThreshold) {
      targetRotation += Math.PI * 2 * (1 / 5);
    } else if (event.deltaY > scrollThreshold) {
      targetRotation -= Math.PI * 2 * (1 / 5);
    }
    new TWEEN.Tween(globals.carousel.rotation)
      .to({ y: targetRotation }, 800)
      .easing(TWEEN.Easing.Bounce.Out)
      .onComplete(() => {
        globals.isTransitioning = false;
      })
      .onStart(() => {
        globals.isTransitioning = true;
      })
      .onStop(() => {
        globals.isTransitioning = false;
      })
      .start();
  }
  if (globals.isDragging) {
    const currentPointerX = event.clientX || event.touches[0].clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    globals.carousel.rotation.y += deltaX * 0.005;
    previousPointerX = currentPointerX;
    globals.renderer.render(globals.scene, globals.camera);
  }
  globals.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  globals.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
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
  if (globals.isTransitioning) return;
  if (globals.isDragging) {
    globals.isDragging = false;

    // Calculate a threshold as a percentage of one full rotation
    const rotationThreshold = (Math.PI * 2) / 10;
    // Reset positive rotation
    if (
      globals.carousel.rotation.y >
      Math.PI * 2 + Math.PI * 0.7 - rotationThreshold
    ) {
      globals.carousel.rotation.y = globals.carousel.rotation.y % (Math.PI * 2);
    }
    // Reset negative rotation
    if (
      globals.carousel.rotation.y <
      -Math.PI * 2 + Math.PI * 0.7 + rotationThreshold
    ) {
      carousel.rotation.y =
        ((globals.carousel.rotation.y % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2);
    }
    const snapAngle = findClosestSnapAngle(globals.carousel.rotation.y);
    new TWEEN.Tween(globals.carousel.rotation)
      .to({ y: snapAngle }, 200)
      .easing(TWEEN.Easing.Back.Out)
      .onComplete(() => {
        globals.isTransitioning = false;
      })
      .onStart(() => {
        globals.isTransitioning = true;
      })
      .onStop(() => {
        globals.isTransitioning = false;
      })
      .start();
  }
}

function handleResize() {
  const containerRect = container.getBoundingClientRect();
  globals.renderer.setSize(containerRect.width, containerRect.height);
  globals.camera.aspect = containerRect.width / containerRect.height;
  globals.camera.updateProjectionMatrix();
}

window.addEventListener("resize", handleResize);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    globals.camera.lookAt(0, 0, -1);
  } else {
    globals.camera.lookAt(0, 0, -1);
  }
});

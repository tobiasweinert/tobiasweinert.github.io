import * as TWEEN from "tween";
import {
  findClosestSnapAngle,
  setCurrentSlide,
  normalizeAngle,
} from "./helpers.js";
import globals from "./globals.js";

let previousRotationAngle =
  globals.devOptions.initialSlide * Math.PI * 2 * (1 / 5);

let previousPointerX = 0;
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onWheelScroll);
// add event for arrow left and right
document.addEventListener("keydown", (event) => {
  if (globals.isTransitioning || globals.isDragging) return;
  let targetRotation = globals.carousel.rotation.y;
  globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
  targetRotation = globals.carousel.rotation.y;
  if (event.key === "ArrowLeft") {
    targetRotation += Math.PI * 2 * (1 / 5);
  }
  if (event.key === "ArrowRight") {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(globals.carousel.rotation)
    .to({ y: targetRotation }, 400)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onComplete(() => {
      globals.isTransitioning = false;
      setCurrentSlide(targetRotation);
    })
    .onStart(() => {
      globals.isTransitioning = true;
    })
    .onStop(() => {
      globals.isTransitioning = false;
      setCurrentSlide(targetRotation);
    })
    .start();
});

function onPointerDown(event) {
  if (globals.isTransitioning) return;
  globals.isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
  previousRotationAngle = globals.carousel.rotation.y;
}

function onWheelScroll(event) {
  if (globals.isTransitioning) return;
  const scrollThreshold = 10;
  let targetRotation = globals.carousel.rotation.y;
  globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
  targetRotation = globals.carousel.rotation.y;
  if (event.deltaY < -scrollThreshold) {
    targetRotation += Math.PI * 2 * (1 / 5);
  } else if (event.deltaY > scrollThreshold) {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(globals.carousel.rotation)
    .to({ y: targetRotation }, 400)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onComplete(() => {
      globals.isTransitioning = false;
      setCurrentSlide(targetRotation);
    })
    .onStart(() => {
      globals.isTransitioning = true;
    })
    .onStop(() => {
      globals.isTransitioning = false;
      setCurrentSlide(targetRotation);
    })
    .start();
}

function onPointerMove(event) {
  if (globals.isTransitioning) return;
  if (event.type === "wheel" && globals.isDragging) return;
  if (globals.isDragging) {
    const currentPointerX = event.clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    globals.carousel.rotation.y += deltaX * 0.005;
    previousPointerX = currentPointerX;
    globals.renderer.render(globals.scene, globals.camera);
  }
  globals.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  globals.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onPointerUp() {
  if (globals.isTransitioning) return;
  if (globals.isDragging) {
    globals.isDragging = false;
    let nextAngle = globals.carousel.rotation.y;
    let animationTime = 250;
    let isForced = false;
    // support the user by forcing the rotation to the next slide if the rotation is less than 1/5 of the total rotation
    // user rotates to the right
    if (previousRotationAngle > globals.carousel.rotation.y) {
      // user rotates to the right and the rotation is less than 1/5 of the total rotation
      if (
        previousRotationAngle - Math.PI * 2 * (1 / 5) <
        globals.carousel.rotation.y
      ) {
        nextAngle = previousRotationAngle - Math.PI * 2 * (1 / 5);
        isForced = true;
      }
    } else if (previousRotationAngle < globals.carousel.rotation.y) {
      if (
        previousRotationAngle + Math.PI * 2 * (1 / 5) >
        globals.carousel.rotation.y
      ) {
        nextAngle = previousRotationAngle + Math.PI * 2 * (1 / 5);
        isForced = true;
      }
    }
    if (!isForced) {
      globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
      nextAngle = findClosestSnapAngle(globals.carousel.rotation.y);
      animationTime = 150;
    }
    setCurrentSlide(nextAngle);
    new TWEEN.Tween(globals.carousel.rotation)
      .to({ y: nextAngle }, animationTime)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
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
  globals.containerRect = globals.container.getBoundingClientRect();
  globals.renderer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );

  globals.camera.aspect =
    globals.containerRect.width / globals.containerRect.height;
  globals.camera.updateProjectionMatrix();
  // prevent blurry texts on resize
  globals.composer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );
}

window.addEventListener("resize", handleResize);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    globals.camera.lookAt(0, 0, -1);
  } else {
    globals.camera.lookAt(0, 0, -1);
  }
});

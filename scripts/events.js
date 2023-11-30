import * as THREE from "three";
import * as TWEEN from "tween";
import {
  findClosestSnapAngle,
  setCurrentSlide,
  normalizeAngle,
} from "./helpers.js";
import { toSlideAbout, fromSlideAbout } from "./slides/slideAbout.js";
import globals from "./globals.js";

let previousRotationAngle =
  globals.devOptions.initialSlide * Math.PI * 2 * (1 / 5);

let previousPointerX = 0;

let previousSlide = globals.devOptions.initialSlide;
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onWheelScroll);
document.addEventListener("keydown", (event) => {
  if (globals.isTransitioning || globals.isDragging) return;
  let targetRotation = globals.carousel.rotation.y;
  globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
  targetRotation = globals.carousel.rotation.y;
  if (event.key === "ArrowUp") {
    targetRotation += Math.PI * 2 * (1 / 5);
  }
  if (event.key === "ArrowDown") {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(globals.carousel.rotation)
    .to({ y: targetRotation }, 400)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onComplete(() => {
      slideHandlerGo(targetRotation);
    })
    .onStart(() => {
      slideHandlerFrom(targetRotation);
    })
    .start();
});

function onPointerDown(event) {
  if (globals.isTransitioning) return;
  previousSlide = globals.currentSlide;
  globals.isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
  previousRotationAngle = globals.carousel.rotation.y;
}

function onWheelScroll(event) {
  if (globals.isTransitioning || globals.isDragging) return;
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
      slideHandlerGo(targetRotation);
    })
    .onStart(() => {
      slideHandlerFrom(targetRotation);
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
        // this seems to cause a cumulative rounding error which causes problems when checking for currentSlide
        // it's weird because this doesnt happen with the arrow keys/scroll wheel, even though the calculation
        // is the same
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
    new TWEEN.Tween(globals.carousel.rotation)
      .to({ y: nextAngle }, animationTime)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onComplete(() => {
        slideHandlerGo(nextAngle);
      })
      .onStart(() => {
        slideHandlerFrom(nextAngle);
      })
      .start();
  }
}

function slideHandlerGo(nextAngle) {
  globals.isTransitioning = false;
  setCurrentSlide(nextAngle);
  switch (globals.currentSlide) {
    case 0:
      break;
    case 1:
      console.log("to slide about");
      toSlideAbout();
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
  }
}

function slideHandlerFrom(nextAngle) {
  previousSlide = globals.currentSlide;
  setCurrentSlide(nextAngle);
  if (previousSlide === globals.currentSlide) return;
  globals.isTransitioning = true;
  switch (previousSlide) {
    case 0:
      break;
    case 1:
      console.log("from slide about");
      fromSlideAbout();
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
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
  globals.camera.position.set(10, 0, 20);
  globals.camera.lookAt(new THREE.Vector3(-1000, 0, -10));
});

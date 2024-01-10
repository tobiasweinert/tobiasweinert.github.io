import * as THREE from "three";
import * as TWEEN from "tween";
import {
  findClosestSnapAngle,
  setCurrentSlide,
  normalizeAngle,
} from "./helpers.js";
import { toSlideAbout, fromSlideAbout } from "./slides/slideAbout.js";
import { toSlideWelcome, fromSlideWelcome } from "./slides/slideWelcome.js";
import {
  toSlideExperience,
  fromSlideExperience,
} from "./slides/slideExperience.js";
import {
  toSlideEducation,
  fromSlideEducation,
} from "./slides/slideEducation.js";
import { toSlideContact, fromSlideContact } from "./slides/slideContact.js";
import globals from "./globals.js";
import { initStarryNight } from "./inits.js";

let previousRotationAngle =
  globals.devOptions.initialSlide * Math.PI * 2 * (1 / 5);

let previousPointerX = 0;

let previousSlide = globals.devOptions.initialSlide;
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("wheel", onWheelScroll);
document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  if (
    globals.isTransitioning ||
    globals.isDragging ||
    globals.devOptions.orbitControls
  )
    return;
  let targetRotation = globals.carousel.rotation.y;
  previousRotationAngle = globals.carousel.rotation.y;
  globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
  targetRotation = globals.carousel.rotation.y;
  if (event.key === "ArrowRight") {
    targetRotation += Math.PI * 2 * (1 / 5);
  }
  if (event.key === "ArrowLeft") {
    targetRotation -= Math.PI * 2 * (1 / 5);
  }
  new TWEEN.Tween(globals.carousel.rotation)
    .to({ y: targetRotation }, 400)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onComplete(() => {
      globals.isTransitioning = false;
      slideHandlerGo(targetRotation);
    })
    .onStart(() => {
      globals.isTransitioning = true;
      slideHandlerFrom(targetRotation);
    })
    .start();
});

function onPointerDown(event) {
  if (
    globals.isTransitioning ||
    globals.devOptions.orbitControls ||
    globals.devOptions.gui
  )
    return;
  previousSlide = globals.currentSlide;
  globals.isDragging = true;
  previousPointerX = event.clientX || event.touches[0].clientX;
  previousRotationAngle = globals.carousel.rotation.y;
}

function onWheelScroll(event) {
  if (
    globals.isTransitioning ||
    globals.isDragging ||
    globals.devOptions.orbitControls
  )
    return;
  const scrollThreshold = 10;
  let targetRotation = globals.carousel.rotation.y;
  previousRotationAngle = globals.carousel.rotation.y;
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
      slideHandlerGo(targetRotation);
    })
    .onStart(() => {
      globals.isTransitioning = true;
      slideHandlerFrom(targetRotation);
    })
    .start();
}

function onPointerMove(event) {
  globals.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  globals.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  if (globals.isTransitioning || globals.devOptions.orbitControls) return;
  if (event.type === "wheel" && globals.isDragging) return;
  if (globals.isDragging) {
    if (!globals.isFadingOut) {
      slideHandlerFrom(globals.carousel.rotation.y);
    }
    const currentPointerX = event.clientX;
    const deltaX = currentPointerX - previousPointerX;
    // rotation speed multiplier
    globals.carousel.rotation.y -= deltaX * 0.005;
    previousPointerX = currentPointerX;
    globals.renderer.render(globals.scene, globals.camera);
  }
}

function onPointerUp() {
  if (globals.isTransitioning || globals.devOptions.orbitControls) return;
  if (globals.isDragging) {
    globals.isDragging = false;
    let nextAngle = globals.carousel.rotation.y;
    let animationTime = globals.isMobile ? 500 : 250;
    let isForced = false;
    // support the user by forcing the rotation to the next slide if the rotation is less than 1/5 of the total rotation
    // user rotates to the right
    if (previousRotationAngle > globals.carousel.rotation.y) {
      // user rotates to the right and the rotation is less than 1/5 of the total rotation
      if (
        previousRotationAngle - Math.PI * 2 * (1 / 5) <
        globals.carousel.rotation.y
        //    &&
        // previousRotationAngle - Math.PI * 2 * (0.35 / 5) >
        //   globals.carousel.rotation.y
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
        //   &&
        // previousRotationAngle + Math.PI * 2 * (0.35 / 5) <
        //   globals.carousel.rotation.y
      ) {
        nextAngle = previousRotationAngle + Math.PI * 2 * (1 / 5);
        isForced = true;
      }
    }
    if (!isForced) {
      globals.carousel.rotation.y = normalizeAngle(globals.carousel.rotation.y);
      nextAngle = findClosestSnapAngle(globals.carousel.rotation.y);
      animationTime = globals.isMobile ? 400 : 150;
    }
    if (previousRotationAngle === globals.carousel.rotation.y) {
      return;
    }
    new TWEEN.Tween(globals.carousel.rotation)
      .to({ y: nextAngle }, animationTime)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onComplete(() => {
        globals.isTransitioning = false;
        slideHandlerGo(nextAngle);
      })
      .onStart(() => {
        globals.isTransitioning = true;
        slideHandlerFrom(nextAngle);
      })
      .start();
  }
}

function handleItemMove() {
  new TWEEN.Tween(globals.item)
    .to({ speed: globals.item.moveSpeed }, 600)
    .easing(TWEEN.Easing.Cubic.Out)
    .onComplete(() => {
      new TWEEN.Tween(globals.item)
        .to({ speed: globals.item.defaultSpeed }, 600)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    })
    .start();
}

// Handlers for when the user rotates to a slide
function slideHandlerGo(nextAngle) {
  setCurrentSlide(nextAngle);
  if (!globals.isMobile) initStarryNight();
  switch (globals.currentSlide) {
    case 0:
      // Welcome slide
      toSlideWelcome();
      break;
    case 1:
      // Contact
      toSlideContact();
      break;
    case 2:
      // Education
      toSlideEducation();
      break;
    case 3:
      // Experience
      toSlideExperience();
      break;
    case 4:
      // About slide
      toSlideAbout();
      break;
  }
}

// Handlers for when the user rotates away from a slide
function slideHandlerFrom(nextAngle) {
  if (nextAngle == previousRotationAngle) return;
  handleItemMove();
  previousSlide = globals.currentSlide;
  setCurrentSlide(nextAngle);
  switch (previousSlide) {
    case 0:
      // Welcome slide
      fromSlideWelcome();
      break;
    case 1:
      // Contact
      fromSlideContact();
      break;
    case 2:
      // Education
      fromSlideEducation();
      break;
    case 3:
      // Experience
      fromSlideExperience();
      break;
    case 4:
      // About slide
      fromSlideAbout();
      break;
  }
}

window.addEventListener("resize", () => {
  globals.containerRect = globals.container.getBoundingClientRect();
  globals.renderer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );

  globals.composer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );

  globals.finalComposer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );

  globals.camera.aspect =
    globals.containerRect.width / globals.containerRect.height;
  globals.camera.updateProjectionMatrix();
});

document.addEventListener("visibilitychange", () => {
  globals.camera.position.set(20, 0, 80);
  globals.camera.lookAt(new THREE.Vector3(3, 0, 100));
});

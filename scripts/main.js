import * as TWEEN from "tween";
import * as THREE from "three";
import globals from "./globals.js";
import {
  initThree,
  initBloom,
  initStarryNight,
  initCameraShot,
} from "./inits.js";
import { initCarousel } from "./carousel.js";
import { initItem, toItem } from "./item.js";
import { initMenu } from "./menu.js";
import { toSlideWelcome } from "./slides/slideWelcome.js";
import { toSlideAbout } from "./slides/slideAbout.js";
import { toSlideContact } from "./slides/slideContact.js";
import { toSlideEducation } from "./slides/slideEducation.js";
import { toSlideExperience } from "./slides/slideExperience.js";
import "./events.js";

initThree();
initCarousel();
initBloom();
initItem();
toItem();
initMenu();
initStarryNight();
await initCameraShot();

// manually trigger the initial slide
switch (globals.devOptions.initialSlide) {
  case 0:
    toSlideWelcome();
    break;
  case 1:
    toSlideContact();
    break;
  case 2:
    toSlideEducation();
    break;
  case 3:
    toSlideExperience();
    break;
  case 4:
    toSlideAbout();
    break;
}

const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const materials = {};

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

function animate() {
  globals.renderer.render(globals.scene, globals.camera);
  TWEEN.update();

  globals.scene.traverse(darkenNonBloomed);

  globals.composer.render();
  globals.scene.traverse(restoreMaterial);
  globals.finalComposer.render();
  requestAnimationFrame(animate);

  const time = Date.now() * 0.00005;
  if (globals.redStars) {
    globals.redStars.geometry.attributes.position.array.forEach((_, index) => {
      globals.redStars.geometry.attributes.position.array[index] +=
        Math.sin(index + time) * 0.1;
    });
    globals.redStars.geometry.attributes.position.needsUpdate = true;
  }

  if (globals.blueStars) {
    globals.blueStars.geometry.attributes.position.array.forEach((_, index) => {
      globals.blueStars.geometry.attributes.position.array[index] +=
        Math.cos(index + time) * 0.1;
    });
    globals.blueStars.geometry.attributes.position.needsUpdate = true;
  }
}

animate();

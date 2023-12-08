import * as TWEEN from "tween";
import globals from "./globals.js";
import {
  initThree,
  initBloom,
  initStarryNight,
  initCameraShot,
} from "./inits.js";
import { initCarousel } from "./carousel.js";
import { toSlideWelcome } from "./slides/slideWelcome.js";
import { toSlideAbout } from "./slides/slideAbout.js";
import "./events.js";

initThree();
initCarousel();
initBloom();
initStarryNight();
await initCameraShot();

// manually trigger the initial slide
switch (globals.devOptions.initialSlide) {
  case 0:
    toSlideWelcome();
    break;
  case 1:
    break;
  case 2:
    break;
  case 3:
    break;
  case 4:
    toSlideAbout();
    break;
}

function animate() {
  globals.renderer.render(globals.scene, globals.camera);
  requestAnimationFrame(animate);
  TWEEN.update();
  globals.composer.render();
  // add movement to starry night using mouse position
  globals.stars.rotation.y = globals.mouseX * 0.1;
  globals.stars.rotation.x = globals.mouseY * 0.1;

  // make random stars twinkle
  const time = Date.now() * 0.00005;
  globals.stars.geometry.attributes.position.array.forEach((_, index) => {
    if (index % 3 === 0) {
      globals.stars.geometry.attributes.position.array[index] +=
        Math.sin(index + time) * 3;
    }
  });
  globals.stars.geometry.attributes.position.needsUpdate = true;
}

animate();

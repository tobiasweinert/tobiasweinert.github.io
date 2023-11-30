import * as THREE from "three";
import { createTextMesh } from "./helpers.js";
import { initSlideWelcome } from "./slides/slideWelcome.js";
import { initSlideAbout } from "./slides/slideAbout.js";
import globals from "./globals.js";

const texture = new THREE.TextureLoader().load(`./assets/images/diffuse.jpg`);

const roundedBoxMaterial = new THREE.MeshLambertMaterial({
  map: texture,
});

export function initCarousel() {
  // carousel of 5 planes that rotate around the y axis
  globals.carousel = new THREE.Group();
  globals.scene.add(globals.carousel);
  const roundedBoxGeometry = new THREE.BoxGeometry(10, 5, 0.1, 10, 10, 10);
  for (let i = 0; i < 5; i++) {
    roundedBoxMaterial.visible = false;
    globals.slides.push(new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial));
    const angle = (i / 5) * Math.PI * 2;
    const radius = 100;
    // calculate the position using polar coordinates
    globals.slides[i].position.x = radius * Math.cos(angle);
    globals.slides[i].position.z = radius * Math.sin(angle);
    // rotate the box
    globals.slides[i].rotation.y = -angle + Math.PI * 0.73;
    // rotate the carousel so that it faces the camera at 0,0,20
    globals.carousel.rotation.y = Math.PI * 0.72;
    // add title to plane
    const text = createTextMesh(
      globals.texts.planes[i].title,
      -1,
      9,
      30,
      5,
      0.01,
      globals.fonts.Nexa_Heavy_Regular
    );
    globals.slides[i].add(text);

    // custom properties
    switch (globals.texts.planes[i].id) {
      case "welcome":
        initSlideWelcome(globals.slides[i]);
        break;
      case "about":
        initSlideAbout();
        break;
      case "education":
        break;
      case "projects":
        break;
      case "contact":
        break;
    }
    globals.carousel.add(globals.slides[i]);
  }
  globals.carousel.position.y = -1;
}

import * as THREE from "three";
import { createTextMesh } from "./helpers.js";
import { initSlideWelcome } from "./slides/slideWelcome.js";
import { initSlideAbout } from "./slides/slideAbout.js";
import globals from "./globals.js";

// const texture = new THREE.TextureLoader().load(`./assets/images/diffuse.jpg`);

const roundedBoxMaterial = new THREE.MeshStandardMaterial({ visible: false });

export function initCarousel() {
  // carousel of 5 planes that rotate around the y axis
  globals.carousel = new THREE.Group();
  globals.scene.add(globals.carousel);
  const roundedBoxGeometry = new THREE.BoxGeometry(0, 0, 0, 1, 1, 1);
  roundedBoxMaterial.visible = false;
  for (let i = 0; i < 5; i++) {
    globals.slides.push(new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial));
    const angle = (i / 5) * Math.PI * 2;
    const radius = 300;
    // calculate the position using polar coordinates
    globals.slides[i].position.x = radius * Math.cos(angle);
    globals.slides[i].position.z = radius * Math.sin(angle);
    // rotate the box
    globals.slides[i].rotation.y = -angle + Math.PI * 0.775;
    // rotate the carousel so that it faces the camera at 0,0,20
    globals.carousel.rotation.y = 2.199114857512855;
    // add title to plane
    const text = createTextMesh(
      globals.texts.planes[i].title,
      -1,
      9,
      30,
      globals.mainHeadingSize,
      0.01,
      globals.fonts.pixelFont
    );
    text.name = "mainTitle";
    globals.slides[i].add(text);
    // add a white line under the title
    const lineLen = globals.isMobile ? 20 : 28;
    const lineGeometry = new THREE.PlaneGeometry(lineLen, 0.2);
    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.name = "mainTitle";
    const zPos = globals.isMobile ? 18.8 : 12;
    line.position.set(3.2, 5.9, zPos);
    line.rotation.y = Math.PI / 2;
    globals.slides[i].add(line);

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
  globals.carousel.position.x = 5.04;
  globals.carousel.position.y = 1.8;
  globals.carousel.position.z = -198.4;

  if (globals.isMobile) {
    globals.carousel.position.x = -20;
    globals.carousel.position.y = 10;
  }
}

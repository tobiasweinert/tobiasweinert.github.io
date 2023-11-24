import * as THREE from "three";
import { getCenterXForText } from "./helpers.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { initSlideWelcome } from "./slides/slideWelcome.js";
import { initSlideAbout } from "./slides/slideAbout.js";
import globals from "./globals.js";

const texture = new THREE.TextureLoader().load(`./assets/images/diffuse.jpg`);

const roundedBoxMaterial = new THREE.MeshPhongMaterial({
  map: texture,
  shininess: 100,
});

export function initCarousel() {
  // carousel of 5 planes that rotate around the y axis
  globals.carousel = new THREE.Group();
  globals.scene.add(globals.carousel);
  const roundedBoxGeometry = new RoundedBoxGeometry(13, 13, -0.5, 3, 0.5);
  // create 5 boxes and add them to the carousel
  for (let i = 0; i < 5; i++) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.5, 2.5);

    roundedBoxMaterial.side = THREE.DoubleSide;
    roundedBoxMaterial.flatShading = true;
    roundedBoxMaterial.aoMap = texture;
    roundedBoxMaterial.aoMapIntensity = 1;
    roundedBoxMaterial.displacementMap = texture;
    roundedBoxMaterial.displacementScale = 0.2;
    roundedBoxMaterial.displacementBias = 0.5;
    globals.slides.push(new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial));
    const angle = (i / 5) * Math.PI * 2;
    const radius = 13;
    // calculate the position using polar coordinates
    globals.slides[i].position.x = radius * Math.cos(angle);
    globals.slides[i].position.z = radius * Math.sin(angle);
    // rotate the box
    globals.slides[i].rotation.y = -angle + Math.PI / 2;
    // rotate the carousel so that it faces the camera at 0,0,20
    globals.carousel.rotation.y = Math.PI * 0.7;
    // add title to plane
    const textGeometry = new TextGeometry(globals.texts.planes[i].title, {
      height: 0.1,
      size: 0.8,
      font: globals.fonts.Nexa_Heavy_Regular,
      curveSegments: 18,
    });
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1a1a1,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    // set the position of the text with respect to the box rotation
    text.position.x = getCenterXForText(textGeometry);
    text.position.y = 5;
    text.position.z = 0.4;
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

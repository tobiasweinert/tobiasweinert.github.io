import * as THREE from "three";
import { getCenterXForText } from "./helpers.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import globals from "./globals.js";

const fontLoader = new FontLoader();
const texture = new THREE.TextureLoader().load(`./assets/images/diffuse.jpg`);
const imageLoader = new THREE.ImageLoader();

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
    const roundedBox = new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial);
    const angle = (i / 5) * Math.PI * 2;
    const radius = 13;
    // calculate the position using polar coordinates
    roundedBox.position.x = radius * Math.cos(angle);
    roundedBox.position.z = radius * Math.sin(angle);
    // rotate the box
    roundedBox.rotation.y = -angle + Math.PI / 2;
    // rotate the carousel so that it faces the camera at 0,0,20
    globals.carousel.rotation.y = Math.PI * 0.7;

    const lines = globals.texts.planes[i].text.split("\n");
    let textHeight = 0;
    for (let j = 0; j < lines.length; j++) {
      // add common text to plane
      fontLoader.load("./assets/fonts/Nexa Heavy_Regular.json", (droidFont) => {
        const textGeometry = new TextGeometry(lines[j], {
          height: 0.1,
          size: 0.3,
          font: droidFont,
          curveSegments: 12,
        });
        const textMaterial = new THREE.MeshStandardMaterial({
          color: 0xa1a1a1,
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        // set the position of the text with respect to the box rotation
        text.position.x = getCenterXForText(textGeometry);
        text.position.y = 4 - textHeight;
        text.position.z = 0.4;
        roundedBox.add(text);
        textHeight += 0.8;
      });
    }
    // add title to plane
    fontLoader.load("./assets/fonts/Nexa Heavy_Regular.json", (droidFont) => {
      const textGeometry = new TextGeometry(globals.texts.planes[i].title, {
        height: 0.15,
        size: 0.8,
        font: droidFont,
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
      roundedBox.add(text);
    });

    // custom properties
    switch (globals.texts.planes[i].id) {
      case "welcome":
        break;
      case "about":
        imageLoader.load(globals.texts.planes[i].images[0].src, (image) => {
          const texture = new THREE.Texture();
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.NearestFilter;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.image = image;
          texture.needsUpdate = true;
          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });
          // get the images width and height and calculate the aspect ratio
          const aspectRatio = image.width / image.height;
          const imgHeight = 5;
          const imgWidth = imgHeight * aspectRatio;
          const meImage = new THREE.Mesh(
            new THREE.PlaneGeometry(imgWidth, imgHeight, 12, 12),
            material
          );
          meImage.position.set(-4, 1, 0.5);
          roundedBox.add(meImage);
          // add a frame to the image
          const frameMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide,
          });
          const frameWidth = imgWidth + 0.2;
          const frameHeight = imgHeight + 0.2;
          const frameGeometry = new THREE.BoxGeometry(
            frameWidth,
            frameHeight,
            0.1
          );
          const frame = new THREE.Mesh(frameGeometry, frameMaterial);
          frame.position.set(-4, 1, 0.5);
          roundedBox.add(frame);
        });

        break;
      case "education":
        break;
      case "projects":
        break;
      case "contact":
        break;
    }
    globals.carousel.position.y = -0.7;
    globals.carousel.add(roundedBox);
  }
}

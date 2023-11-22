import * as THREE from "three";
import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const imageLoader = new THREE.ImageLoader();

export function initSlideAbout(slide) {
  imageLoader.load(globals.texts.planes[2].images[0].src, (image) => {
    const texture = new THREE.Texture();
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.image = image;
    texture.needsUpdate = true;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
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
    slide.add(meImage);
    // add a frame to the image
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const frameWidth = imgWidth + 0.2;
    const frameHeight = imgHeight + 0.2;
    const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.1);
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(-4, 1, 0.5);
    slide.add(frame);

    // add a "globals.texts.planes[2].images[0].title" under the image
    const title = globals.texts.planes[2].images[0].title;
    const titleMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
    });
    const titleGeometry = new TextGeometry(title, {
      height: 0.1,
      size: 0.3,
      font: globals.fonts.Nexa_Heavy_Regular,
      curveSegments: 12,
    });
    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.position.set(-5, -2.1, 0.4);
    slide.add(titleMesh);
  });
}

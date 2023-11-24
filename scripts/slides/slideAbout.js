import * as THREE from "three";
import * as TWEEN from "tween";

import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { loadImage } from "../helpers.js";

let imageGroup = new THREE.Group();
let frame;

const profileImage = await loadImage(globals.texts.planes[2].images[0].src);

export async function initSlideAbout(slide) {
  const texture = new THREE.Texture();
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.image = profileImage;
  texture.needsUpdate = true;
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
  });
  // calculate the aspect ratio for a fixed height of 5
  const aspectRatio = profileImage.width / profileImage.height;
  const imgHeight = 5;
  const imgWidth = imgHeight * aspectRatio;
  const meImage = new THREE.Mesh(
    new THREE.PlaneGeometry(imgWidth, imgHeight, 12, 12),
    material
  );
  meImage.position.set(-5, 0, 3);
  meImage.rotation.y = Math.PI / 20;
  // frame for image
  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.BackSide,
  });
  const frameWidth = imgWidth + 0.2;
  const frameHeight = imgHeight + 0.2;
  const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.1);
  frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(-5, 0, 3);
  frame.rotation.y = Math.PI / 20;
  // image title
  const title = globals.texts.planes[2].images[0].title;
  const titleMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
  });
  const titleGeometry = new TextGeometry(title, {
    height: 0.02,
    size: 0.3,
    font: globals.fonts.Nexa_Heavy_Regular,
    curveSegments: 12,
  });
  const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
  titleMesh.position.set(-6, -3.2, 3.15);
  titleMesh.rotation.y = Math.PI / 20;
  // group the image, frame and title
  imageGroup = new THREE.Group();
  imageGroup.add(meImage);
  imageGroup.add(frame);
  imageGroup.add(titleMesh);
  imageGroup.position.y = 12;
  globals.slides[2].add(imageGroup);
  imageGroup.visible = false;
}

export function toSlideAbout() {
  new TWEEN.Tween(imageGroup.position)
    .to({ y: 1 }, 400)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {
      imageGroup.visible = true;
    })
    .onComplete(() => {})
    .start();
}

export async function fromSlideAbout() {
  new TWEEN.Tween(imageGroup.position)
    .to({ y: 20 }, 400)
    .easing(TWEEN.Easing.Linear.None)
    .onComplete(() => {
      imageGroup.visible = false;
    })
    .onStart(() => {})
    .start();
}

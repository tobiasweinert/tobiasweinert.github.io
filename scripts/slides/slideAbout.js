import * as THREE from "three";
import * as TWEEN from "tween";

import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { loadImage, createTextMeshes } from "../helpers.js";

let imageGroup = new THREE.Group();
let frame;

const profileImage = await loadImage(globals.texts.planes[4].images[0].src);

export async function initSlideAbout() {}

export function toSlideAbout() {
  const texture = new THREE.Texture();
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.image = profileImage;
  texture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  // calculate the aspect ratio for a fixed height of 5
  const aspectRatio = profileImage.width / profileImage.height;
  const imgHeight = 3;
  const imgWidth = imgHeight * aspectRatio;
  const meImage = new THREE.Mesh(
    new THREE.PlaneGeometry(imgWidth, imgHeight, 12, 12),
    material
  );
  meImage.position.set(-1, 9, 30);
  meImage.rotation.y = Math.PI / 2;
  // frame for image
  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0xa1a1a1,
    side: THREE.BackSide,
  });
  const frameWidth = imgWidth + 0.2;
  const frameHeight = imgHeight + 0.2;
  const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.1);
  frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(-1, 9, 30);
  frame.rotation.y = Math.PI / 2;
  // image title
  const title = globals.texts.planes[4].images[0].title;
  const titleMaterial = new THREE.MeshBasicMaterial({
    color: globals.fontColor,
  });
  const titleGeometry = new TextGeometry(title, {
    height: 0.0,
    size: 0.15,
    font: globals.fonts.pixelFont,
    curveSegments: 12,
  });
  const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
  titleMesh.position.set(-1, 7, 31);
  titleMesh.rotation.y = Math.PI / 2;
  // group the image, frame and title
  imageGroup = new THREE.Group();
  imageGroup.add(meImage);
  imageGroup.add(frame);
  imageGroup.add(titleMesh);
  imageGroup.position.x = 21.3;
  imageGroup.position.y = 30;
  imageGroup.position.z = -30.3;

  globals.slides[4].add(imageGroup);
  new TWEEN.Tween(imageGroup.position)
    .to({ y: -8 }, 800)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {})
    .onComplete(() => {})
    .start();

  const textMeshes = createTextMeshes(
    globals.texts.planes[4].texts,
    -1,
    2.7,
    30,
    globals.mainTextSize,
    0.01,
    1.2,
    globals.fonts.pixelFont
  );
  const offsets = globals.texts.planes[4].texts.map((text, index) => {
    return index * 2;
  });

  textMeshes.forEach((textMesh, index) => {
    textMesh.position.y = -100;
    globals.slides[4].add(textMesh);
    new TWEEN.Tween(textMesh.position)
      .to({ y: 0 - index + 4 - offsets[index] }, 150 + index * 100)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  });
}

export async function fromSlideAbout() {
  for (let i = globals.slides[4].children.length - 1; i >= 0; i--) {
    const child = globals.slides[4].children[i];
    if (child.name != "mainTitle") {
      new TWEEN.Tween(child.position)
        .to({ y: -100 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(() => {
          globals.isFadingOut = false;
          globals.slides[4].remove(child);
        })
        .onStart(() => {
          globals.isFadingOut = true;
        })
        .start();
    }
  }
}

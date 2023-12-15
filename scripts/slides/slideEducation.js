import * as THREE from "three";
import * as TWEEN from "tween";

import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { loadImage, createTextMeshes } from "../helpers.js";

export async function initSlideEducation() {}

export function toSlideEducation() {
  const textMeshes = createTextMeshes(
    globals.texts.planes[1].texts,
    -1,
    2.7,
    30,
    globals.mainTextSize,
    0.01,
    1.2,
    globals.fonts.pixelFont
  );
  const offsets = globals.texts.planes[1].texts.map((text, index) => {
    return index * 2;
  });

  textMeshes.forEach((textMesh, index) => {
    textMesh.position.y = -100;
    globals.slides[1].add(textMesh);
    new TWEEN.Tween(textMesh.position)
      .to({ y: 0 - index + 4 - offsets[index] }, 150 + index * 100)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  });
}

export async function fromSlideEducation() {
  for (let i = globals.slides[1].children.length - 1; i >= 0; i--) {
    const child = globals.slides[1].children[i];
    if (child.name != "mainTitle") {
      new TWEEN.Tween(child.position)
        .to({ y: -100 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(() => {
          globals.isFadingOut = false;
          globals.slides[1].remove(child);
        })
        .onStart(() => {
          globals.isFadingOut = true;
        })
        .start();
    }
  }
}

import * as THREE from "three";
import * as TWEEN from "tween";

import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { loadImage, createTextMeshes } from "../helpers.js";

export async function initSlideExperience() {}

export function toSlideExperience() {
  const textMeshes = createTextMeshes(
    globals.texts.planes[0].texts,
    -1,
    2.7,
    30,
    globals.mainTextSize,
    0.01,
    1.2,
    globals.fonts.pixelFont
  );
  const offsets = globals.texts.planes[0].texts.map((text, index) => {
    if (index % 2 == 0) return index * 2 + 1;
    return index * 2;
  });

  textMeshes.forEach((textMesh, index) => {
    textMesh.position.y = -100;
    globals.slides[0].add(textMesh);
    new TWEEN.Tween(textMesh.position)
      .to({ y: 0 - index + 4 - offsets[index] }, 150 + index * 100)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  });
}

export async function fromSlideExperience() {
  for (let i = globals.slides[0].children.length - 1; i >= 0; i--) {
    const child = globals.slides[0].children[i];
    if (child.name != "mainTitle") {
      new TWEEN.Tween(child.position)
        .to({ y: -100 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(() => {
          globals.slides[0].remove(child);
          globals.isFadingOut = false;
        })
        .onStart(() => {
          globals.isFadingOut = true;
        })
        .start();
    }
  }
}

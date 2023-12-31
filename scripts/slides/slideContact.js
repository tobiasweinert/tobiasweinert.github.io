import * as THREE from "three";
import * as TWEEN from "tween";

import globals from "../globals.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { loadImage, createTextMeshes } from "../helpers.js";

export async function initSlideContact() {}

export function toSlideContact() {
  // we need to enlarge and reposition the socials buttons (class="socials")
  // and put them in the center of the screen
  const socials = document.getElementsByClassName("socials");
  for (let i = 0; i < socials.length; i++) {
    const social = socials[i];
    social.style.transform = "scale(2)";
  }

  const textMeshes = createTextMeshes(
    globals.texts.planes[2].texts,
    -1,
    2.7,
    30,
    globals.mainTextSize,
    0.01,
    1.2,
    globals.fonts.pixelFont
  );
  const offsets = globals.texts.planes[2].texts.map((text, index) => {
    return index * 2;
  });

  textMeshes.forEach((textMesh, index) => {
    textMesh.position.y = -100;
    globals.slides[2].add(textMesh);
    new TWEEN.Tween(textMesh.position)
      .to({ y: 0 - index + 4 - offsets[index] }, 150 + index * 100)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  });
}

export async function fromSlideContact() {
  // we need to put the socials buttons back in their original position and size
  const socials = document.getElementsByClassName("socials");
  for (let i = 0; i < socials.length; i++) {
    const social = socials[i];
    social.style.transform = "scale(1)";
  }
  for (let i = globals.slides[2].children.length - 1; i >= 0; i--) {
    const child = globals.slides[2].children[i];
    if (child.name != "mainTitle") {
      new TWEEN.Tween(child.position)
        .to({ y: -100 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(() => {
          globals.isFadingOut = false;
          globals.slides[2].remove(child);
        })
        .onStart(() => {
          globals.isFadingOut = true;
        })
        .start();
    }
  }
}

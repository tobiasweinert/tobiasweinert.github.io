import globals from "../globals.js";
import { createTextMesh } from "../helpers.js";
export function initSlideWelcome(slide) {
  const textMeshes = createTextMesh(
    globals.texts.planes[3].texts[0],
    0,
    4,
    20,
    0.3,
    0.01,
    0.8,
    globals.fonts.Nexa_Heavy_Regular,
    true
  );

  textMeshes.forEach((textMesh) => {
    textMesh.rotation.y = Math.PI / 2;
    slide.add(textMesh);
  });
}

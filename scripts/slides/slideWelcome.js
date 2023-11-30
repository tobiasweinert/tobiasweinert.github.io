import globals from "../globals.js";
import { createTextMeshes } from "../helpers.js";
export function initSlideWelcome(slide) {
  const textMeshes = createTextMeshes(
    globals.texts.planes[3].texts[0],
    -3,
    2.7,
    21,
    0.8,
    0.01,
    1.2,
    globals.fonts.Nexa_Heavy_Regular
  );

  textMeshes.forEach((textMesh) => {
    slide.add(textMesh);
  });
}

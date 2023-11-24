import globals from "../globals.js";
import { createTextMesh } from "../helpers.js";
export function initSlideWelcome(slide) {
  const textMeshes = createTextMesh(
    globals.texts.planes[3].texts[0],
    0,
    4,
    0.5,
    0.3,
    0.02,
    0.8,
    globals.fonts.Nexa_Heavy_Regular,
    true
  );
  textMeshes.forEach((textMesh) => slide.add(textMesh));
}

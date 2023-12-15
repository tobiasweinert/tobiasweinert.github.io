import * as THREE from "three";
import * as TWEEN from "tween";
import { createTextMesh } from "./helpers.js";
import { createTextMeshes } from "./helpers.js";
import globals from "./globals.js";

export function initMenu() {
  // camera is at 20,0,80 camera.lookAt(3,0,100)
  if (globals.isMobile) return;
  const tWelcome = createTextMesh(
    "Welcome",
    52.68,
    20,
    203,
    globals.menuSize,
    0.01,
    globals.fonts.pixelFont
  );
  tWelcome.rotation.y = Math.PI + 1;
  // gui rotation
  tWelcome.name = "mWelcome";
  globals.scene.add(tWelcome);

  const tAbout = createTextMesh(
    "About me",
    52.68,
    14,
    203,
    globals.menuSize,
    0.01,
    globals.fonts.pixelFont
  );
  tAbout.rotation.y = Math.PI + 1;
  tAbout.name = "mAbout";
  globals.scene.add(tAbout);

  const tEducation = createTextMesh(
    "Education",
    52.68,
    8,
    203,
    globals.menuSize,
    0.01,
    globals.fonts.pixelFont
  );
  tEducation.rotation.y = Math.PI + 1;
  tEducation.name = "mAbout";
  globals.scene.add(tEducation);

  const tExperience = createTextMesh(
    "Experience",
    52.68,
    2,
    203,
    globals.menuSize,
    0.01,
    globals.fonts.pixelFont
  );
  tExperience.rotation.y = Math.PI + 1;
  tExperience.name = "mAbout";
  globals.scene.add(tExperience);

  const tContact = createTextMesh(
    "Contact",
    52.68,
    -4,
    203,
    globals.menuSize,
    0.01,
    globals.fonts.pixelFont
  );
  tContact.rotation.y = Math.PI + 1;
  tContact.name = "mAbout";
  globals.scene.add(tContact);
}

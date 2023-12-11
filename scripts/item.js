import * as THREE from "three";
import * as TWEEN from "tween";
import globals from "./globals.js";

export function initItem() {
  const geometry = new THREE.BoxGeometry(-1, 9, 30);
  const material = new THREE.MeshBasicMaterial({ color: 0x000 });
  const item = new THREE.Mesh(geometry, material);
  globals.scene.add(item);
}

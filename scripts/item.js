import * as THREE from "three";
import * as TWEEN from "tween";
import globals from "./globals.js";
import vertexShader from "../shaders/vertex.js";
import fragmentShader from "../shaders/fragment.js";

const textureLoader = new THREE.TextureLoader();
export function initItem() {
  // const normalTexture = textureLoader.load("./assets/images/NormalMap.png");
  // const geometry = new THREE.SphereGeometry(4, 100, 100);
  // const material = new THREE.MeshStandardMaterial({
  //   metalness: 0.8,
  //   roughness: 0.2,
  //   color: 0x292929,
  //   normalMap: normalTexture,
  // });
  // const item = new THREE.Mesh(geometry, material);
  // item.position.set(1, 1, 84);
  // globals.scene.add(item);
  // // TODO: this causes stutter in the spin
  // const animateItem = () => {
  //   requestAnimationFrame(animateItem);
  //   item.rotation.y += 0.005;
  // };
  // animateItem();

  const geometry = new THREE.PlaneGeometry(5, 5);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  material.uniforms = {
    uTime: { value: 0 },
  };
  const ico = new THREE.Mesh(geometry, material);
  ico.position.set(1, 1, 84);
  ico.rotation.y = 2.3;
  globals.scene.add(ico);
}

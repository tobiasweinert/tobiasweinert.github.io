import * as THREE from "three";
import * as TWEEN from "tween";
import globals from "./globals.js";
import vertexShader from "../shaders/vertex.js";
import fragmentShader from "../shaders/fragment.js";
import vertexPars from "../shaders/vertexPars.js";
import vertexMain from "../shaders/vertexMain.js";
import fragmentMain from "../shaders/fragmentMain.js";
import fragmentPars from "../shaders/fragmentPars.js";

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

  const geometry = new THREE.IcosahedronGeometry(1, 200);
  const material = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
      material.userData.shader = shader;
      shader.uniforms.uTime = { value: 0 };

      const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`;
      shader.vertexShader = shader.vertexShader.replace(
        parsVertexString,
        parsVertexString + vertexPars
      );

      const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`;
      shader.vertexShader = shader.vertexShader.replace(
        mainVertexString,
        mainVertexString + vertexMain
      );

      const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
      const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`;
      shader.fragmentShader = shader.fragmentShader.replace(
        parsFragmentString,
        parsFragmentString + fragmentPars
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        mainFragmentString,
        mainFragmentString + fragmentMain
      );
    },
  });

  const ico = new THREE.Mesh(geometry, material);
  // camera is at 20,0,80, camer.lookAt is 3,0,100
  // we want to place the sphere close to the camera
  ico.position.set(11.63, -0.33, 81.75);
  globals.scene.add(ico);

  let i = 0.0001;
  const animateItem = () => {
    i += 0.001;
    requestAnimationFrame(animateItem);
    material.userData.shader.uniforms.uTime.value = i;
  };

  if (material.userData.shader == undefined) {
    setTimeout(animateItem, 0.1);
  }
}

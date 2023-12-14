import * as THREE from "three";
import * as TWEEN from "tween";
import globals from "./globals.js";
import vertexShader from "../shaders/vertex.js";
import fragmentShader from "../shaders/fragment.js";
import vertexPars from "../shaders/vertexPars.js";
import vertexMain from "../shaders/vertexMain.js";
import fragmentMain from "../shaders/fragmentMain.js";
import fragmentPars from "../shaders/fragmentPars.js";

export function initItem() {
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
  ico.name = "item";
  ico.layers.enable(1);
  // camera is at 20,0,80, camera.lookAt is 3,0,100
  ico.position.set(11.63, -10, 81.75);
  globals.scene.add(ico);

  let i = 0.0001;
  const animateItem = () => {
    if (material.userData.shader == undefined) return;
    i += globals.item.speed;
    requestAnimationFrame(animateItem);
    material.userData.shader.uniforms.uTime.value = i;
  };

  if (material.userData.shader == undefined) {
    setTimeout(animateItem, 1000);
  }
}

export function toItem() {
  // TODO: start the shorter animation inside the onStart to properly set isTransitioning
  const item = globals.scene.getObjectByName("item");
  const tween = new TWEEN.Tween(item.position)
    .to({ x: 11.63, y: -0.33, z: 81.75 }, 900)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onStart(() => {
      globals.isTransitioning = true;
    })
    .onComplete(() => {
      globals.isTransitioning = false;
    });
  tween.start();

  new TWEEN.Tween(item.rotation)
    .to({ y: Math.PI }, 10000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onStart(() => {
      globals.isTransitioning = true;
    })
    .onComplete(() => {
      globals.isTransitioning = false;
    })
    .start();
}

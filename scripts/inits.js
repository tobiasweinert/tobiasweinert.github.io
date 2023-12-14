import * as THREE from "three";
import * as TWEEN from "tween";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SavePass } from "three/examples/jsm/postprocessing/SavePass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { BlendShader } from "three/examples/jsm/shaders/BlendShader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setCurrentSlideText } from "./helpers.js";

import globals from "./globals.js";

export function initThree() {
  // threejs boilerplate
  globals.renderer = new THREE.WebGLRenderer({});
  globals.composer = new EffectComposer(globals.renderer);
  globals.composer.renderToScreen = false;
  globals.composer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );
  globals.renderer.setSize(
    globals.containerRect.width,
    globals.containerRect.height
  );
  globals.renderer.setPixelRatio(window.devicePixelRatio);
  globals.renderer.shadowMap.enabled = true;
  globals.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  globals.renderer.outputColorSpace = THREE.SRGBColorSpace;
  globals.renderer.toneMapping = THREE.CineonToneMapping;
  globals.renderer.toneMappingExposure = 1.5;
  document
    .getElementById("cv-container")
    .appendChild(globals.renderer.domElement);
  globals.scene = new THREE.Scene();
  globals.scene.background = new THREE.Color(globals.backgroundColor);

  globals.camera = new THREE.PerspectiveCamera(
    75,
    globals.containerRect.width / globals.containerRect.height,
    0.1,
    1000
  );

  // sphere is at 11.63, -0.33, 81.75
  const dirLight = new THREE.DirectionalLight(0x526cff, 0.05);
  dirLight.position.set(20, 0, 80);
  dirLight.target.position.set(16, 5, 85);

  const dirLight2 = new THREE.DirectionalLight(0xff0000, 0.05);
  dirLight2.position.set(-53.3, -4.15, -139.31);
  dirLight2.target.position.set(16, 5, 85);

  // globals.devOptions.gui.add(dirLight2.position, "x", -500, 500, 0.01);
  // globals.devOptions.gui.add(dirLight2.position, "y", -500, 500, 0.01);
  // globals.devOptions.gui.add(dirLight2.position, "z", -500, 500, 0.01);

  //const ambientLight = new THREE.AmbientLight(0x00ff0, 0.1);
  //ambientLight.position.set(16, 5, 85);
  globals.scene.add(dirLight, dirLight2);

  setCurrentSlideText(globals.currentSlide);
}

export function initBloom() {
  console.log("initBloom");
  const renderPass = new RenderPass(globals.scene, globals.camera);
  globals.composer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(
      globals.containerRect.width,
      globals.containerRect.height
    ),
    0.5,
    5,
    0.4
  );
  bloomPass.threshold = 0.0;
  bloomPass.strength = 2.22;
  bloomPass.radius = 0.0;
  // globals.devOptions.gui.add(bloomPass, "threshold", 0.0, 1.0, 0.01);
  // globals.devOptions.gui.add(bloomPass, "strength", 0.0, 3.0, 0.01);
  // globals.devOptions.gui.add(bloomPass, "radius", 0.0, 1.0, 0.01);
  globals.composer.addPass(bloomPass);

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: globals.composer.renderTarget2.texture },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
    }),
    "baseTexture"
  );

  //fxaa
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = globals.renderer.getPixelRatio();
  fxaaPass.material.uniforms["resolution"].value.x =
    1 / (globals.containerRect.width * pixelRatio);
  fxaaPass.material.uniforms["resolution"].value.y =
    1 / (globals.containerRect.height * pixelRatio);
  globals.composer.addPass(fxaaPass);

  globals.finalComposer = new EffectComposer(globals.renderer);
  globals.finalComposer.addPass(fxaaPass);

  globals.finalComposer.addPass(renderPass);
  globals.finalComposer.addPass(mixPass);

  globals.finalComposer.addPass(fxaaPass);
  globals.composer.addPass(fxaaPass);
  const outputPass = new OutputPass();
  globals.finalComposer.addPass(outputPass);
}

export function initStarryNight() {
  // Starry night background
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: globals.fontColor,
    size: 0.1,
  });
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 1000;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 4)
  );
  globals.stars = new THREE.Points(starGeometry, starMaterial);
  globals.scene.add(globals.stars);
}

export function initCameraShot() {
  if (globals.devOptions.prod) {
    const cameraPositions = [
      { x: 40, y: 60, z: 50 },
      { x: 30, y: 50, z: 40 },
      { x: 20, y: 40, z: 30 },
      { x: 10, y: 30, z: 25 },
      { x: 0, y: 20, z: 25 },
      { x: 0, y: -1, z: 25 },
    ];

    const cameraLooks = [
      { x: 0, y: -1, z: -1 },
      { x: 0, y: 0, z: -1 },
    ];

    globals.camera.position.set(
      cameraPositions[0].x,
      cameraPositions[0].y,
      cameraPositions[0].z
    );

    const initialLookAt = new THREE.Vector3();
    const finalLookAt = new THREE.Vector3(
      cameraLooks[1].x,
      cameraLooks[1].y,
      cameraLooks[1].z
    );

    new TWEEN.Tween({ t: 0 })
      .to({ t: 1 }, 3500)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(({ t }) => {
        const interpolatedLookAt = new THREE.Vector3().lerpVectors(
          initialLookAt,
          finalLookAt,
          t
        );
        // Update camera position
        globals.camera.position.set(
          globals.camera.position.x + (cameraLooks[1].x - cameraLooks[0].x) * t,
          globals.camera.position.y + (cameraLooks[1].y - cameraLooks[0].y) * t,
          globals.camera.position.z + (cameraLooks[1].z - cameraLooks[0].z) * t
        );

        // Update camera lookAt
        globals.camera.lookAt(interpolatedLookAt);
      })
      .start();

    // do the camera animation
    new TWEEN.Tween(globals.camera.position)
      .to(cameraPositions[1], 500)
      .onStart(() => {
        new TWEEN.Tween(globals.carousel.rotation)
          .to({ y: Math.PI * 2 + Math.PI * 0.7 }, 3500)
          .start();
      })
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        new TWEEN.Tween(globals.camera.position)
          .to(cameraPositions[2], 500)
          .easing(TWEEN.Easing.Linear.None)
          .onComplete(() => {
            new TWEEN.Tween(globals.camera.position)
              .to(cameraPositions[3], 500)
              .easing(TWEEN.Easing.Linear.None)
              .onComplete(() => {
                new TWEEN.Tween(globals.camera.position)
                  .to(cameraPositions[4], 500)
                  .easing(TWEEN.Easing.Linear.None)
                  .onComplete(() => {
                    new TWEEN.Tween(globals.camera.position)
                      .to(cameraPositions[5], 1500)
                      .easing(TWEEN.Easing.Quadratic.InOut)
                      .onComplete(() => {
                        // add grabbable class to canvas-container
                        document
                          .getElementById("cv-container")
                          .classList.add("grabbable");
                        globals.isTransitioning = false;
                      })
                      .start();
                  })
                  .start();
              })
              .start();
          })
          .start();
      })
      .start();
  } else {
    // Fixed camera, orbit controls and select initial slide
    globals.camera.position.set(20, 0, 80);
    globals.camera.lookAt(new THREE.Vector3(3, 0, 100));
    globals.isTransitioning = false;

    if (globals.devOptions.orbitControls) {
      const controls = new OrbitControls(
        globals.camera,
        globals.renderer.domElement
      );
      globals.camera.position.set(-42, 7, 118);
      globals.camera.lookAt(new THREE.Vector3(-10, 0, 100));
    }

    // select initial slide devOptions.initialSlide (0-4) without animations
    globals.carousel.rotation.y -=
      globals.devOptions.initialSlide * Math.PI * 2 * (1 / 5);
  }
}

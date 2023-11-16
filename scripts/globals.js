async function fetchText() {
  const text = await fetch("../assets/en.texts.json");
  return text.json();
}

function getContainerRect() {
  return document.getElementById("cv-container").getBoundingClientRect();
}

// Global variables
const globals = {
  prod: true,
  renderer: null,
  scene: null,
  camera: null,
  composer: null,
  container: document.getElementById("cv-container"),
  containerRect: getContainerRect(),
  carousel: null,
  isTransitioning: true,
  isDragging: false,
  carousel: null,
  stars: null,
  mouseX: 0,
  mouseY: 0,
  texts: await fetchText(),
};

export default globals;

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
const fontLoader = new FontLoader();

async function fetchText() {
  const text = await fetch("../assets/en.texts.json");
  return text.json();
}

function getContainerRect() {
  return document.getElementById("cv-container").getBoundingClientRect();
}

function loadFont(fontPath) {
  return new Promise((resolve, reject) => {
    fontLoader.load(fontPath, (font) => {
      resolve(font);
    });
  });
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function isDarkReaderEnabled() {
  const isEnabled =
    "querySelector" in document &&
    !!document.querySelector('meta[name="darkreader"]');
  if (isEnabled) {
    const rootStyles = document.documentElement.style;
    rootStyles.setProperty("--text-color", "#fff");
  }
  return isEnabled;
}

// Global variables
const globals = {
  devOptions: {
    prod: false,
    orbitControls: false,
    initialSlide: 0,
  },
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
  slides: [],
  stars: null,
  mouseX: 0,
  mouseY: 0,
  texts: await fetchText(),
  fonts: {
    Nexa_Heavy_Regular: await loadFont(
      "../assets/fonts/Nexa Heavy_Regular.json"
    ),
  },
  currentSlide: 0,
  // TODO: responsive font sizes
  mainHeadingSize: isMobile() ? 3.3 : 5,
  mainTextSize: isMobile() ? 0.8 : 1,
  isMobile: isMobile(),
  isDarkReaderEnabled: isDarkReaderEnabled(),
  fontColor: isDarkReaderEnabled() ? "#fff" : "#000",
  isFadingOut: false,
};

globals.currentSlide = globals.devOptions.initialSlide;

export default globals;

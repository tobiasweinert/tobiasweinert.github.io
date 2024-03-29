import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const fontLoader = new FontLoader();

async function fetchText() {
  const text = await fetch("../assets/de.texts.json");
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
  // for now there will only be a dark theme
  return true;
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
    // gui: new GUI(),
  },
  renderer: null,
  scene: null,
  camera: null,
  composer: null,
  finalComposer: null,
  container: document.getElementById("cv-container"),
  containerRect: getContainerRect(),
  carousel: null,
  isTransitioning: true,
  isDragging: false,
  carousel: null,
  slides: [],
  redStars: [],
  blueStars: [],
  mouseX: 0,
  mouseY: 0,
  texts: await fetchText(),
  fonts: {
    //pixelFont: await loadFont("../assets/fonts/Press Start 2P_Regular.json"),
    // pixelFont: await loadFont("../assets/fonts/Fira Sans_Regular.json"),
    pixelFont: await loadFont("../assets/fonts/Russo One_Regular.json"),
  },
  currentSlide: 0,
  // TODO: responsive font size
  mainHeadingSize: isMobile() ? 2 : 2.5,
  mainTextSize: isMobile() ? 0.55 : 0.9,
  menuSize: isMobile() ? 1.1 : 1.6,
  isMobile: isMobile(),
  isDarkReaderEnabled: isDarkReaderEnabled(),
  fontColor: isDarkReaderEnabled() ? "#ffffff" : "#000000",
  backgroundColor: isDarkReaderEnabled() ? "#040404" : "#ffffff",
  isFadingOut: false,
  item: {
    speed: 0.001,
    defaultSpeed: isMobile() ? 0.01 : 0.001,
    moveSpeed: isMobile() ? 0.1 : 0.009,
  },
};

globals.currentSlide = globals.devOptions.initialSlide;

export default globals;

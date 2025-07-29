// Main sketch file - imports all modules
function preload() {
  loadAssets();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupMenuButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupMenuButtons();
}

function draw() {
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'almanac') {
    drawAlmanac();
  } else if (gameState === 'game') {
    drawGame();
  }
}

function mousePressed() {
  if (gameState === 'almanac') {
    handleAlmanacInteraction(mouseX, mouseY);
  } else if (gameState === 'game') {
    // Check for sun collection first
    if (checkSunCollection(mouseX, mouseY)) {
      return;
    }
    // Check for plant selection
    if (handlePlantSelection(mouseX, mouseY)) {
      return;
    }
    // Check for planting on grid
    handlePlanting(mouseX, mouseY);
  }
} 
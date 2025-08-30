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
  // Debug: log state changes
  if (typeof draw.lastState === 'undefined') {
    draw.lastState = '';
  }
  if (draw.lastState !== gameState) {
    console.log('Game state changed from', draw.lastState, 'to', gameState);
    draw.lastState = gameState;
  }
  
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'almanac') {
    drawAlmanac();
  } else if (gameState === 'mapselect') {
    drawMapSelect();
  } else if (gameState === 'game') {
    drawGame();
  }
}

function mousePressed() {
  if (gameState === 'almanac') {
    handleAlmanacInteraction(mouseX, mouseY);
  } else if (gameState === 'mapselect') {
    handleMapSelection(mouseX, mouseY);
  } else if (gameState === 'game') {
    // Check if game is over
    if (gameOver) {
      console.log('Game over screen clicked, returning to map selection');
      gameState = 'mapselect';
      resetGame();
      return;
    }
    
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
  // If we're in menu state, don't process any other mouse interactions
  // This prevents map selection from happening when clicking buttons in the menu
} 